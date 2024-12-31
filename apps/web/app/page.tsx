import { Test } from "../components/test/test";
import { auth } from "../lib/auth";

export default async function Home() {
  const session = await auth();

  return (
    <div className="w-screen overflow-">
      <div>
        <h1 className="">Hello</h1>
      </div>
      {session && session.user && JSON.stringify(session)}
    </div>
  );
}
