// app/page.jsx

import Link from "next/link";

export default function HomePage() {
  return (
    <div className="relative h-screen w-full overflow-hidden text-white">
      <div
        className="absolute inset-0 bg-cover bg-center blur-sm opacity-30"
        style={{
          backgroundImage: "url('/images/space-Bg.jpg')",
        }}
      />

      <div className="relative z-10 flex flex-col h-full justify-between">
        <div className="flex justify-end font-serif p-4 ">
          <Link href="/login">
            <button className="bg-white text-black px-4 py-2 rounded hover:bg-gray-200 transition cursor-pointer">
              Login / Sign Up
            </button>
          </Link>
        </div>

        <div className="flex flex-col items-center justify-center text-center flex-grow px-4">
          <h1 className="text-4xl font-serif md:text-6xl font-bold mb-4">
            CosmicNuggets
          </h1>
          <p className="text-xl font-serif md:text-2xl max-w-xl">
            Discover bite-sized science and space facts. Fuel your curiosity in
            just a few seconds a day.
          </p>
        </div>
        <div className="flex flex-col items-center justify-center text-center mb-4 px-2">
          <p className="text-xl md:text-2xl  max-w-xl font-serif">
            Contact Us for more information
          </p>
        </div>
      </div>
    </div>
  );
}
