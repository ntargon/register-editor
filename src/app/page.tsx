'use client'

import Image from "next/image";
import { add } from 'tauri-plugin-awesome-api';

const _add = async () => {
  let ret = await add(1, 2);
  console.log(ret);
}

export default function Home() {
  return (
    <>
      <button onClick={_add}>push</button>
    </>
  );
}
