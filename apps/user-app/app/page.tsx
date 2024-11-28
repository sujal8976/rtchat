import { ModeToggle } from "@repo/ui/components/theme/selectMode"
import { Appbar } from "../components/Appbar"
import { auth } from '../lib/auth'

export default async function Home (){
  const session = await auth();

  return (
    <div>
      <Appbar />
      <ModeToggle />
      <div>
        <h1 className="">Hello</h1>
      </div>
      {session && session.user && JSON.stringify(session)}
    </div>
  )
}
