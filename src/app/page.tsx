'use client'

import { useEffect, useState } from 'react';
import { connect, disconnect, exec, configure, is_connected, type Config } from 'tauri-plugin-awesome-api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from "next/link";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { RotatingLines } from "react-loader-spinner";
import { Label } from "@/components/ui/label";

export default function Home() {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [command, setCommand] = useState<string>("");
  const [response, setResponse] = useState<string>("");
  const [connecting, setConnecting] = useState<boolean>(false);
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [ipAddress, setIpAddress] = useState<string>("");

  const _exec = async () => {
    let res = await exec(command).catch((e)=>console.log(e));
    console.log(res);
    if (res) {
      setResponse(res);
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.nativeEvent.isComposing || e.key === 'Enter') {
      _exec()
    }
  }

  const toggleConnection = async () => {
    let connection = await is_connected();

    if (connection) {
      connection = await disconnect();
    } else {
      let config: Config = {username: username, password: password, ip_address: ipAddress};
      await configure(config);
      setConnecting(true);
      connection = await connect()
                          .catch((_)=> false)
                          .then((ret) => ret);
      setConnecting(false);
    }

    setIsConnected(connection);
  }

  useEffect(()=> {
    is_connected().then((connection)=> setIsConnected(connection));
  }, [])

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-muted/40 md:block">
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <div className='w-full font-bold'>
            connection
          </div>
          <div className='px-3'>
            <RotatingLines width='20' strokeColor='grey' visible={connecting}/>
          </div>
          <Switch checked={isConnected} onClick={toggleConnection}/>
        </div>

        <div className='flex-1'>
          <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
            <Link
                    href="#"
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-primary transition-all hover:text-primary"
            >
              Sidebar
            </Link>
            <Link
                    href="#"
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-primary transition-all hover:text-primary"
            >
              Home
            </Link>
          </nav>
        </div>
      </div>
      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
          header
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          <div className='flex gap-1.5'>
            <Label htmlFor='ssh-username'>username:</Label>
            <Input type='text' id='ssh-username' className='h-4'
            value={username}
            onChange={(event) => setUsername(event.target.value)}/>
          </div>
          <div className='flex gap-1.5'>
            <Label htmlFor='ssh-password'>password:</Label>
            <Input type='password' id='ssh-password' className='h-4'
            value={password}
            onChange={(event) => setPassword(event.target.value)}/>
          </div>
          <div className='flex gap-1.5'>
            <Label htmlFor='ssh-ip-address'>ip address:</Label>
            <Input type='text' id='ssh-ip-address' className='h-4'
            value={ipAddress}
            onChange={(event) => setIpAddress(event.target.value)}/>
          </div>
          <div className='flex'>
            <Input type='text' autoCorrect='off' value={command} onKeyDown={handleKeyDown} onChange={(event) => setCommand(event.target.value)}
            className='text-xs h-1'/>
            <Button className='text-xs h-4 mx-1 w-10'>
              送信
            </Button>
          </div>
          <Textarea value={response} readOnly
          className='text-xs'/>
        </main>
      </div>

    </div>
  );
}