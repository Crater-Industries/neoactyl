import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
      <div className="bg-gray-900 m-13 p-5 mt-12 rounded">
        <h1 className="text-white bg-gray-500 mx-12 my-12 rounded text-lg">
          Hello, welcome to Neoactyl
        </h1>
        <Link
          className="btn-primary py-1 px-2 bg-gray-400 rounded"
          href="/auth/sign-in"
        >
          Get start
        </Link>
      </div>
    </main>
  );
}
