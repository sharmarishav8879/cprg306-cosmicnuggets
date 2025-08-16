"use client";

import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../_utils/firebase";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { doc, setDoc } from "firebase/firestore";

export default function SignUp() {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    if (
      firstName === "" ||
      lastName === "" ||
      email === "" ||
      password === ""
    ) {
      alert("Please fill in all fields");
      return;
    }

    if (password.length < 6) {
      alert("Password must be at least 6 characters");
      return;
    }
    try {
      setLoading(true);
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        firstName,
        lastName,
        email,
      });

      router.push("/login");
    } catch (error) {
      alert(error.message);
    } finally {
      setFirstName("");
      setLastName("");
      setEmail("");
      setPassword("");
      setLoading(false);
    }
  };

  return (
    <main className="flex flex-col items-center justify-center  h-screen w-full">
      <div
        style={{
          backgroundImage: "url('/images/space-Bg.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: "100px",
          width: "400px",
          marginBottom: "20px",
          opacity: "0.8",
        }}
        className="flex flex-col items-center border-2 border-gray-300 p-4 justify-center rounded-2xl"
      >
        <h1 className="text-4xl font-serif text-white font-bold">Sign Up</h1>
      </div>

      <div className="flex flex-col w-1/2 items-center gap-4 border-2 border-gray-300 p-4 justify-center rounded-2xl">
        <input
          type="text"
          placeholder="First Name"
          value={firstName}
          className="mb-2 w-full bg-white text-black px-4 py-2 rounded hover:bg-gray-200 transition cursor-pointer"
          onChange={(e) => setFirstName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Last Name"
          className="mb-2 w-full bg-white text-black px-4 py-2 rounded hover:bg-gray-200 transition cursor-pointer"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          className="mb-2 w-full bg-white text-black px-4 py-2 rounded hover:bg-gray-200 transition cursor-pointer"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="mb-2 w-full bg-white text-black px-4 py-2 rounded hover:bg-gray-200 transition cursor-pointer"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          onClick={handleSignUp}
          disabled={loading}
          className="bg-white text-black px-4 py-2 rounded hover:bg-gray-200 transition cursor-pointer"
        >
          {loading ? "Signing Up..." : "Sign Up"}
        </button>
      </div>
    </main>
  );
}
