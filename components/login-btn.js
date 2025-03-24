"use client";
import { useSession, signIn, signOut } from "next-auth/react";

export default function Loginbtn() {
  const { data: session } = useSession();

  if (session) {
    return (
      <div className="self-center bg-slate-500 items-center rounded-xl text-xl my-15 ml-70 p-0 w-60 bg-[liner-gradient()] from-amber-500 to-amber-900">
        Signed in as {session.user?.email} <br />
        <button
          onClick={() => signOut()}
          className="bg-gray-600 m-8 mx-10 px-5 py-1 rounded text-white"
        >
          Sign out
        </button>
      </div> // ✅ Corrected closing tag
    );
  }

  return (
    <div className="self-center bg-slate-500 items-center rounded-xl text-xl my-15 ml-70 p-0 w-60 bg-[liner-gradient()] from-amber-500 to-amber-900">
      Not signed in <br />
      <button
        onClick={() => signIn()}
        className="bg-gray-600 m-8 mx-10 px-5 py-1 rounded text-white"
      >
        Sign in
      </button>
    </div> // ✅ Corrected closing tag
  );
}
