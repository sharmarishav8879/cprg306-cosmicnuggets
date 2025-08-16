"use client";

import { useUserAuth } from "../_utils/auth-context";
import { useRouter } from "next/navigation";
import facts from "./spaceFacts.json";
import { useState, useEffect } from "react";

export default function Home() {
  const { firebaseSignOut } = useUserAuth();
  const router = useRouter();

  useEffect(() => {
    setCurrentFact(getRandomFact());
  }, []);
  const getRandomFact = () => {
    return facts[Math.floor(Math.random() * facts.length)].fact;
  };

  const [currentFact, setCurrentFact] = useState("");

  const handleSignOut = async () => {
    try {
      await firebaseSignOut();
      router.push("/login");
    } catch (error) {
      alert(error.message);
    }
  };

  const newFacts = () => {
    setCurrentFact(getRandomFact());
  };

  return (
    <main className="flex flex-col items-center justify-center mt-1.5">
      <h1 className="text-4xl font-bold font-serif mb-4">
        Welcome to Land of Space
      </h1>

      <div className="flex flex-col items-center justify-center w-180 h-130 gap-4">
        <img
          src="/images/space.jpg"
          alt="Space"
          className="absolute h-full w-full mt-13 opacity-30"
        ></img>
        <div className="bg-blue-200 shadow-md relative rounded-lg p-6 w-3/4 max-w-md text-center">
          <p className="text-lg text-black font-extrabold font-serif mb-2">
            Random Space Fact:
          </p>
          <p className="text-md font-serif text-black ">{currentFact}</p>
          <button
            onClick={newFacts}
            className="bg-black mt-4 text-white px-4 py-2 rounded hover:bg-gray-800 transition-colors duration-300"
          >
            New Fact
          </button>
        </div>
      </div>

      <button
        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 position absolute bottom-3"
        onClick={handleSignOut}
        type="button"
      >
        Sign Out
      </button>
    </main>
  );
}
