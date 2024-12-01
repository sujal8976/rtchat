"use client";

import { LabelInput } from "@repo/ui/components/custom/labeledInput";
import { Button } from "@repo/ui/components/ui/button";
import { MoveRight } from "@repo/ui/icons";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export function Register() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      username: formData.get("username") as string,
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    };

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
        throw new Error(result.message || "Failed to register");
      }

      router.push("/api/auth/signin");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
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
          <Button type="submit" disabled={loading}>
            <span className="flex items-center gap-2">
              {loading ? "Registering" : "Register"}
              <MoveRight />
            </span>
          </Button>
        </form>
        {error && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
            role="alert"
          >
            <span className="block sm:inline">{error}</span>
          </div>
        )}
      </div>
    </div>
  );
}
