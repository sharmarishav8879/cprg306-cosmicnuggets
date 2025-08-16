"use client";

import React, { useState, useEffect } from "react";
import { auth, db } from "../_utils/firebase";
import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  deleteUser,
  updateProfile,
  updateEmail,
} from "firebase/auth";

export default function Profile() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [password, setPassword] = useState("");
  const [showPasswordInput, setShowPasswordInput] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [updating, setUpdating] = useState(false);

  const currentUser = auth.currentUser;
  const isOAuthUser = currentUser?.providerData.some(
    (provider) => provider.providerId !== "password"
  );

  useEffect(() => {
    async function fetchUserData() {
      setLoading(true);
      try {
        if (currentUser) {
          setEmail(currentUser.email || "");
          if (!isOAuthUser) {
            const userDoc = doc(db, "users", currentUser.uid);
            const userSnapshot = await getDoc(userDoc);
            if (userSnapshot.exists()) {
              const data = userSnapshot.data();
              setFirstName(data.firstName || "");
              setLastName(data.lastName || "");
            }
          } else {
            const displayName = currentUser.displayName || "";
            if (displayName.includes(" ")) {
              const [first, ...last] = displayName.split(" ");
              setFirstName(first);
              setLastName(last.join(" "));
            } else {
              setFirstName(displayName);
              setLastName("");
            }
          }
        }
      } catch (e) {
        alert("Failed to load user data.");
      } finally {
        setLoading(false);
      }
    }
    fetchUserData();
  }, [currentUser?.uid]);

  const handleUpdate = async () => {
    if (isOAuthUser) {
      alert("Profile updates are disabled for OAuth users.");
      return;
    }

    setUpdating(true);
    try {
      if (!currentUser) {
        alert("No authenticated user found.");
        return;
      }

      const userDoc = doc(db, "users", currentUser.uid);
      await updateDoc(userDoc, {
        firstName,
        lastName,
        email,
      });

      await updateProfile(currentUser, {
        displayName: firstName + " " + lastName,
      });

      if (email !== currentUser.email) {
        await updateEmail(currentUser, email);
      }

      alert("Profile updated successfully");
    } catch (error) {
      alert("Failed to update profile: " + error.message);
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!password) {
      alert("Please enter your password to confirm deletion.");
      return;
    }

    const user = auth.currentUser;
    if (!user || !user.email) {
      alert("No authenticated user.");
      return;
    }

    setDeleting(true);
    try {
      const credential = EmailAuthProvider.credential(user.email, password);
      await reauthenticateWithCredential(user, credential);

      await deleteDoc(doc(db, "users", user.uid));

      await deleteUser(user);

      alert("Account deleted successfully.");
    } catch (error) {
      alert(error.message || "Error deleting account");
    } finally {
      setDeleting(false);
      setPassword("");
      setShowPasswordInput(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="loader">Loading...</div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto bg-white shadow rounded p-8 mt-24 mb-10">
      <h2 className="text-2xl text-black font-bold mb-6 text-center">
        Profile Details
      </h2>

      {!isOAuthUser && (
        <>
          <label className="block mb-2 text-gray-700 font-semibold">
            First Name
          </label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="w-full text-black p-3 border rounded mb-4"
          />

          <label className="block mb-2 text-gray-700 font-semibold">
            Last Name
          </label>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="w-full text-black p-3 border rounded mb-4"
          />
        </>
      )}

      <label className="block mb-2 text-gray-700 font-semibold">Email</label>

      {isOAuthUser ? (
        <div className="p-3 bg-gray-100 rounded mb-6 text-gray-600">
          {email}
        </div>
      ) : (
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full text-black p-3 border rounded mb-6"
        />
      )}

      <button
        onClick={handleUpdate}
        disabled={updating || isOAuthUser}
        className={`w-full bg-green-600 text-white p-3 rounded font-semibold mb-6 ${
          updating || isOAuthUser
            ? "opacity-70 cursor-not-allowed"
            : "hover:bg-green-700"
        }`}
        title={isOAuthUser ? "Profile updates disabled for OAuth users" : ""}
      >
        {updating ? "Updating..." : "Update Profile"}
      </button>

      {showPasswordInput ? (
        <>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full text-black p-3 border rounded mb-4"
          />
          <button
            onClick={handleDelete}
            disabled={deleting}
            className={`w-full bg-red-600 text-white p-3 rounded font-semibold mb-3 ${
              deleting ? "opacity-70 cursor-not-allowed" : "hover:bg-red-700"
            }`}
          >
            {deleting ? "Deleting..." : "Confirm Delete"}
          </button>
          <button
            onClick={() => {
              setShowPasswordInput(false);
              setPassword("");
            }}
            className="w-full border border-red-600 text-red-600 p-3 rounded font-semibold"
          >
            Cancel
          </button>
        </>
      ) : (
        <button
          onClick={() => setShowPasswordInput(true)}
          className="w-full bg-red-600 text-white p-3 rounded font-semibold hover:bg-red-700"
        >
          Delete Account
        </button>
      )}
    </div>
  );
}
