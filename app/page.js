import Loginbtn from "../components/login-btn";
import Image from "next/image";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col items-center justify-center space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-6xl font-bold text-white">
              Welcome to Neoactyl
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl">
              Your next-generation game server management platform
            </p>
          </div>
          
          <div className="flex items-center justify-center gap-8 my-12">
            <Image
              src="/globe.svg"
              alt="Globe"
              width={48}
              height={48}
              className="opacity-80 hover:opacity-100 transition-opacity"
            />
            <Image
              src="/window.svg"
              alt="Window"
              width={48}
              height={48}
              className="opacity-80 hover:opacity-100 transition-opacity"
            />
          </div>

          <div className="w-full max-w-md">
            <Loginbtn />
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="p-6 bg-gray-800/50 rounded-lg">
              <h3 className="text-xl font-semibold text-white mb-2">Easy Setup</h3>
              <p className="text-gray-300">Quick and simple server deployment</p>
            </div>
            <div className="p-6 bg-gray-800/50 rounded-lg">
              <h3 className="text-xl font-semibold text-white mb-2">Powerful Control</h3>
              <p className="text-gray-300">Full management of your game servers</p>
            </div>
            <div className="p-6 bg-gray-800/50 rounded-lg">
              <h3 className="text-xl font-semibold text-white mb-2">24/7 Support</h3>
              <p className="text-gray-300">Always here to help you succeed</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
