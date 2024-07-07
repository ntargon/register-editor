'use client'

import { useEffect, useState } from 'react';
import { connect, disconnect, exec, configure, is_connected, type Config } from 'tauri-plugin-awesome-api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from "@/components/ui/textarea";

export default function Graph() {
  const [command, setCommand] = useState<string>("");
  const [response, setResponse] = useState<string>("");

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

  return (
    <>
        <h1>Graph</h1>
        <div className='flex'>
          <Input type='text' autoCorrect='off' value={command} onKeyDown={handleKeyDown} onChange={(event) => setCommand(event.target.value)}
          className='text-xs h-1'/>
          <Button className='text-xs h-4 mx-1 w-10'>
            送信
          </Button>
        </div>
        <Textarea value={response} readOnly
        className='text-xs'/>
    </>
  );
}