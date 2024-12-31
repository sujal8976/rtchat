"use client";

import { LabelInput } from "@repo/ui/components/custom/labeledInput";
import { Button } from "@repo/ui/components/ui/button";
import { useToast } from "@repo/ui/hooks/use-toast";
import { MoveRight } from "@repo/ui/icons";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { registerSchema } from "@repo/common/schema";
import { formatZodErrors } from "@repo/common/utils";

export function Register() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      username: formData.get("username") as string,
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    };

    const result = registerSchema.safeParse(data);
    if (!result.success) {
      const errorMessages = formatZodErrors(result.error.errors);
      toast({
        title: "Register Validation Error",
        description: `Please correct the following errors:\n${errorMessages}`,
        variant: "destructive",
      });

      return setLoading(false);
    }

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const result = await response.json();

      if (!response.ok) {
        toast({
          title: "Register Submission Error",
          description: result.error ? result.error : "Something went wrong",
          variant: "destructive",
        });
        return setLoading(false);
      }

      router.push("/api/auth/signin");
      router.refresh();
    } catch (err) {
      toast({
        title: "Register Submission Error",
        description:
          err instanceof Error ? err.message : "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex w-full justify-center">
      <div className="flex flex-col justify-center items-center mt-44 border-2 dark:border-slate-500 shadow-lg dark:shadow-slate-500 rounded-xl p-4 w-full max-w-[90%] sm:max-w-[80%] md:max-w-[70%] lg:max-w-[60%] xl:max-w-[50%]">
        <div className="mb-8 text-2xl ">Register</div>
        <form
          className="w-full space-y-4 flex flex-col items-center"
          onSubmit={handleSubmit}
        >
          <LabelInput
            label="Username"
            className="w-full sm:max-w-[50%]"
            type="text"
            placeholder="johndoe"
            name="username"
          />
          <LabelInput
            label="Email"
            className="w-full sm:max-w-[50%]"
            type="text"
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
          <Button type="submit" disabled={loading}>
            <span className="flex items-center gap-2">
              {loading ? "Registering" : "Register"}
              <MoveRight />
            </span>
          </Button>
        </form>
      </div>
    </div>
  );
}
