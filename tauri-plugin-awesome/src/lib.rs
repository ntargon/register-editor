use serde::{ser::Serializer, Deserialize, Serialize};
use tauri::{
    command,
    plugin::{Builder, TauriPlugin},
    AppHandle, Manager, Runtime, State, Window,
};

use ssh2::Session;
use std::io::prelude::*;
use std::net::TcpStream;
use std::sync::Mutex;

type Result<T> = std::result::Result<T, Error>;

#[derive(Debug, thiserror::Error)]
pub enum Error {
    #[error(transparent)]
    Io(#[from] std::io::Error),
    #[error(transparent)]
    Ssh2(#[from] ssh2::Error),
}

impl Serialize for Error {
    fn serialize<S>(&self, serializer: S) -> std::result::Result<S::Ok, S::Error>
    where
        S: Serializer,
    {
        serializer.serialize_str(self.to_string().as_ref())
    }
}

#[derive(Default)]
struct MyState {
    session: Mutex<Option<Session>>,
    config: Mutex<Config>,
}

#[command]
async fn add<R: Runtime>(
    _app: AppHandle<R>,
    _window: Window<R>,
    _state: State<'_, MyState>,
    x: u32,
    y: u32,
) -> Result<u32> {
    Ok(x + y)
}

#[command]
async fn connect<R: Runtime>(
    _app: AppHandle<R>,
    _window: Window<R>,
    state: State<'_, MyState>,
) -> Result<bool> {
    let mut session = state.session.lock().unwrap();

    match *session {
        // already connected
        Some(_) => Ok(true),
        // not connected. try to connect.
        None => {
            let config = state.config.lock().unwrap();
            let tcp = TcpStream::connect(&config.ip_address)?;
            let mut sess = Session::new()?;
            sess.set_tcp_stream(tcp);
            sess.handshake()?;
            sess.userauth_password(&config.username, &config.password)?;
            *session = Some(sess);
            Ok(true)
        }
    }
}

#[command]
async fn disconnect<R: Runtime>(
    _app: AppHandle<R>,
    _window: Window<R>,
    state: State<'_, MyState>,
) -> Result<bool> {
    let mut session = state.session.lock().unwrap();

    match session.as_ref() {
        Some(sess) => {
            sess.disconnect(None, "", None)?;
            *session = None;
            Ok(false)
        }
        None => Ok(false),
    }
}

#[derive(Default, Debug, Serialize, Deserialize)]
struct Config {
    username: String,
    password: String,
    ip_address: String,
}

#[command]
async fn configure<R: Runtime>(
    _app: AppHandle<R>,
    _window: Window<R>,
    state: State<'_, MyState>,
    config: Config,
) -> Result<()> {
    *state.config.lock().unwrap() = config;
    Ok(())
}

#[command]
async fn is_connected<R: Runtime>(
    _app: AppHandle<R>,
    _window: Window<R>,
    state: State<'_, MyState>,
) -> Result<bool> {
    match *(state.session.lock().unwrap()) {
        Some(_) => Ok(true),
        None => Ok(false),
    }
}

#[command]
async fn exec<R: Runtime>(
    _app: AppHandle<R>,
    _window: Window<R>,
    state: State<'_, MyState>,
    command: String,
) -> Result<String> {
    let session = state.session.lock().unwrap();

    match session.as_ref() {
        // connected
        Some(session) => {
            let mut channel = session.channel_session()?;
            channel.exec(&command)?;
            let mut s = String::new();
            channel.read_to_string(&mut s)?;

            Ok(s)
        }
        // not connected
        None => Ok("".to_string()),
    }
}

/// Initializes the plugin.
pub fn init<R: Runtime>() -> TauriPlugin<R> {
    Builder::new("awesome")
        .invoke_handler(tauri::generate_handler![
            configure,
            connect,
            disconnect,
            is_connected,
            exec,
            add
        ])
        .setup(|app| {
            app.manage(MyState::default());
            Ok(())
        })
        .build()
}
