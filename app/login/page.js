"use client";

import { useUserAuth } from "../_utils/auth-context";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const { user, gitHubSignIn, firebaseSignOut, login } = useUserAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSignIn = async () => {
    try {
      await gitHubSignIn();
    } catch (error) {
      alert(error.message);
    }
  };

  const handleLogin = async () => {
    try {
      await login(email, password);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleSignOut = async () => {
    try {
      await firebaseSignOut();
    } catch (error) {
      alert(error.message);
    }
  };

  useEffect(() => {
    if (user) {
      router.push("/home");
    }
  }, [user]);

  return (
    <main>
      {!user && (
        <section className="h-screen w-screen font-serif flex flex-col items-center mt-10 text-white">
          <div className="flex flex-col items-center text-center mb-4">
            <img
              src="images/image2.jpeg"
              alt="CosmicNuggets"
              className="w-20 h-20 rounded-full mb-4 border-3 border-white"
            />
            <h1 className="text-4xl md:text-6xl  font-bold mb-4">
              Welcome to CosmicNuggets
            </h1>
          </div>

          <p className="text-xl font-serif md:text-2xl w-3/4">
            Join us on a journey of discovery, where we'll explore the latest
            scientific findings and unravel the secrets of the universe, one
            bite-sized nugget at a time.
          </p>

          <div className="flex flex-col items-center text-center mb-4 px-4 py-4 mt-4 gap-2 rounded-2xl border-2 border-white">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              className="mb-2 px-2 py-1 rounded bg-white text-black"
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              className="mb-2 px-2 py-1 rounded bg-white text-black"
            />

            <button
              className="bg-black text-white px-3 py-1 rounded transition cursor-pointer"
              onClick={handleLogin}
            >
              Login
            </button>
            <p
              onClick={() => router.push("/signUp")}
              className="text-white cursor-pointer"
            >
              Not signed up yet? Sign up
            </p>
            {error && <p className="text-red-500">{error}</p>}
          </div>
          <button
            className="bg-white text-black px-4 py-2 rounded hover:bg-gray-200 transition cursor-pointer"
            onClick={handleSignIn}
            type="button"
          >
            🐱 Login with GitHub
          </button>
        </section>
      )}
    </main>
  );
}
