"use client";
import { useSession, signIn, signOut } from "next-auth/react";
import { useState } from "react";

export default function Loginbtn() {
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(false);

  const handleSignOut = async () => {
    setIsLoading(true);
    try {
      await signOut();
    } catch (error) {
      console.error("Sign out error:", error);
    }
    setIsLoading(false);
  };

  const handleSignIn = async () => {
    setIsLoading(true);
    try {
      await signIn();
    } catch (error) {
      console.error("Sign in error:", error);
    }
    setIsLoading(false);
  };

  if (status === "loading" || isLoading) {
    return (
      <div className="self-center bg-slate-500 items-center rounded-xl text-xl my-15 ml-70 p-4 w-60">
        <div className="text-center text-white">Loading...</div>
      </div>
    );
  }

  if (session) {
    return (
      <div className="self-center bg-slate-500/90 items-center rounded-xl text-xl my-15 ml-70 p-4 w-60 transition-all hover:bg-slate-500">
        <div className="text-white text-center mb-2">
          Welcome, {session.user?.firstname || session.user?.email}
        </div>
        <button
          onClick={handleSignOut}
          disabled={isLoading}
          className="w-full bg-gray-600 hover:bg-gray-700 disabled:bg-gray-400 px-5 py-2 rounded text-white transition-colors"
        >
          Sign out
        </button>
      </div>
    );
  }

  return (
    <div className="self-center bg-slate-500/90 items-center rounded-xl text-xl my-15 ml-70 p-4 w-60 transition-all hover:bg-slate-500">
      <div className="text-white text-center mb-2">Not signed in</div>
      <button
        onClick={handleSignIn}
        disabled={isLoading}
        className="w-full bg-gray-600 hover:bg-gray-700 disabled:bg-gray-400 px-5 py-2 rounded text-white transition-colors"
      >
        Sign in
      </button>
    </div>
  );
}
