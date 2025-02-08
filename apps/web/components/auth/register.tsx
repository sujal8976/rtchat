"use client";

import { LabelInput } from "@repo/ui/components/custom/labeledInput";
import { Button } from "@repo/ui/components/ui/button";
import { useToast } from "@repo/ui/hooks/use-toast";
import { MoveRight, Camera, UserCircle, X } from "@repo/ui/icons";
import { useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useState } from "react";
import { registerSchema } from "@repo/common/schema";
import { formatZodErrors } from "@repo/common/utils";
import { getSignedURL } from "../../lib/s3/getSignedUrl";
import { computeSHA256 } from "../../lib/utils/sha";

type RequestDataType = {
  username: string;
  password: string;
  email: string;
  image: string | null;
};

export function Register() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const [selectedImage, setSelectedImage] = useState<null | File>(null);
  const [previewUrl, setPreviewUrl] = useState<null | string>(null);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (previewUrl) URL.revokeObjectURL(previewUrl);

      if (!file.type.startsWith("image/")) {
        toast({
          title: "Please select an image file",
          variant: "destructive",
        });
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "Image should be less than 5MB",
          variant: "destructive",
        });
        return;
      }

      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    let data: RequestDataType = {
      username: formData.get("username") as string,
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      image: null,
    };

    const result = registerSchema.safeParse(data);
    if (!result.success) {
      const errorMessages = formatZodErrors(result.error.errors);
      toast({
        title: "Register Validation Error",
        description: `Please correct the following errors:\n${errorMessages}`,
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    try {
      if (selectedImage) {
        try {
          const signedUrl = await getSignedURL(
            selectedImage.type,
            await computeSHA256(selectedImage)
          );

          const url = signedUrl.success.url;

          const response = await fetch(url, {
            method: "PUT",
            body: selectedImage,
            headers: {
              "Content-Type": selectedImage.type,
            },
          });

          if (!response.ok) {
            toast({
              title: "Something went wrong",
              description: "Failed to upload Profile picture.",
              variant: "destructive",
            });
            setLoading(false);
            return;
          }

          data.image = url.split("?")[0] as string;
        } catch (error) {
          toast({
            title: "Something went wrong",
            description: "Failed to upload Profile picture.",
            variant: "destructive",
          });
          setLoading(false);
          return;
        }
      }

      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        toast({
          title: "Register Submission Error",
          description: result.error ? result.error : "Something went wrong",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setSelectedImage(null);
      setPreviewUrl(null);
      router.push("/api/auth/signin");
      router.refresh();
    } catch (err) {
      toast({
        title: "Register Submission Error",
        description: "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveImage = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setSelectedImage(null);
    setPreviewUrl(null);
    const fileInput = document.querySelector(
      '#image'
    ) as HTMLInputElement;
    if (fileInput) {
      fileInput.value = "";
    }
  };

  return (
    <div className="flex w-full h-[calc(100svh-73px)] items-center justify-center">
      <div className="flex flex-col justify-center items-center border-2 dark:border-slate-500 shadow-lg dark:shadow-slate-500 rounded-xl p-4 w-full max-w-[90%] sm:max-w-[80%] md:max-w-[70%] lg:max-w-[60%] xl:max-w-[50%]">
        <div className="mb-8 text-2xl">Register</div>

        <div className="mb-4 flex flex-col items-center">
          <div className="relative">
            <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700">
              {previewUrl ? (
                <>
                  <img
                    src={previewUrl}
                    alt="Profile preview"
                    className="w-full h-full object-cover"
                  />
                  <div
                    onClick={handleRemoveImage}
                    className="absolute top-3 p-1 right-0 bg-red-500 rounded-full flex items-center justify-center cursor-pointer"
                  >
                    <X size={16} className="text-white" />
                  </div>
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <UserCircle size={40} />
                </div>
              )}
            </div>
            <label className="absolute bottom-0 right-0 cursor-pointer">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors">
                <Camera size={16} className="text-white" />
              </div>
              <input
                id="image"
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleImageChange}
              />
            </label>
          </div>
        </div>

        <form
          className="w-full space-y-4 flex flex-col items-center"
          onSubmit={handleSubmit}
        >
          <LabelInput
            label="Username *"
            className="w-full sm:max-w-[50%]"
            type="text"
            placeholder="johndoe"
            name="username"
          />
          <LabelInput
            label="Email *"
            className="w-full sm:max-w-[50%]"
            type="text"
            placeholder="johndoe@gmail.com"
            name="email"
          />
          <LabelInput
            label="Password *"
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
