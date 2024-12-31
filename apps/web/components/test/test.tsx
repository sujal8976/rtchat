
import { headers } from "next/headers";

export async function Test(){
  const res = await fetch(
    `http://localhost:3000/api/rooms?query=room`,{
      method: "GET",
      headers: headers(),
    }
  );
  console.log(await res.json())
  
  return null
}