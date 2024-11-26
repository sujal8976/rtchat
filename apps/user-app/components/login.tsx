import { LabelInput } from "@repo/ui/components/custom/labeledInput";
import { Button } from "@repo/ui/components/ui/button";
import { MoveRight } from "@repo/ui/icons/moveRight";

export function Login() {
  return (
    <div className="flex w-full justify-center">
      <div className="flex flex-col justify-center items-center mt-44 border-2 dark:border-slate-500 shadow-lg dark:shadow-slate-500 rounded-xl p-4 w-full max-w-[90%] sm:max-w-[80%] md:max-w-[70%] lg:max-w-[60%] xl:max-w-[50%]">
        <div className="mb-8 text-2xl ">Login</div>
        <div className="w-full space-y-4 flex flex-col items-center">
          <LabelInput
            label="Email"
            className="w-full sm:max-w-[50%]"
            type="email"
            placeholder="johndoe@gmail.com"
            name="email"
          />
          <LabelInput
            label="Password"
            className="w-full sm:max-w-[50%]"
            type="password"
            name="password"
            placeholder="Password"
          />
          <Button type="submit">
            <span className="flex items-center gap-2">
              Login<MoveRight />
            </span>
          </Button>
        </div>
      </div>
    </div>
  );
}
