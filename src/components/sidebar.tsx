'use client'

import { useEffect, useState } from 'react';
import { connect, disconnect, exec, configure, is_connected, type Config } from 'tauri-plugin-awesome-api';
import { Input } from '@/components/ui/input';
import Link from "next/link";
import { Switch } from "@/components/ui/switch";
import { RotatingLines } from "react-loader-spinner";
import { Label } from "@/components/ui/label";

export function Sidebar() {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [connecting, setConnecting] = useState<boolean>(false);
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [ipAddress, setIpAddress] = useState<string>("");


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
    console.log('sidebar');
    is_connected().then((connection)=> setIsConnected(connection));
  }, [])

  return (
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
                  href="/"
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-primary transition-all hover:text-primary"
          >
            Home
          </Link>
          <Link
                  href="/graph"
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-primary transition-all hover:text-primary"
          >
            Graph
          </Link>
        </nav>
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
      </div>
    </div>
  );
}
