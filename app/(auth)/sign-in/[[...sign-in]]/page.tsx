"use client";
import { SignIn } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();
  return (
    <div className='w-full min-h-screen flex items-center justify-center flex-col gap-4'>
      <SignIn />
      <p
        className='text-white underline font-bold cursor-pointer'
        onClick={() => router.push("/sign-up")}
      >
        Don&apos;t have an account, register here
      </p>
    </div>
  );
}
