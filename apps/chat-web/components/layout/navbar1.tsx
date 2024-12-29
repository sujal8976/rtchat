import { ModeToggle } from "@repo/ui/components/theme/selectMode";
import { Button } from "@repo/ui/components/ui/button";
import Link from "next/link";
import { LoginButton } from "../client utilities/loginButton";
import { cn } from "@repo/ui/lib/utils";
import { auth } from "../../lib/auth";
import { Logo } from "../client utilities/logo";

export async function Navbar() {
  const session = await auth();

  return (
    <nav
      className={cn(
        "w-full flex justify-center border-b-2 dark:border-b",
        session?.user && session.user?.id && "hidden"
      )}
    >
      <div className="w-[1400px] max-w-[90%] flex justify-between py-4 items-center">
        <Logo />
        <div className="flex gap-6 items-center">
          <LoginButton />
          <Link href={"/auth/register"}>
            <Button className="text-base">Sign Up</Button>
          </Link>
          <ModeToggle />
        </div>
      </div>
    </nav>
  );
}
