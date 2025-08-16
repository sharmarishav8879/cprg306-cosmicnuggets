"use client";
import { useState, useEffect } from "react";
import { useUserAuth } from "../_utils/auth-context";
import { useRouter } from "next/navigation";

export default function Explore() {
  const [planets, setPlanets] = useState("");
  const [facts, setFacts] = useState(null);
  const [fetching, setFetching] = useState(false);
  const { user, loading: authLoading } = useUserAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  if (authLoading || !user) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-800">
        <p className="text-white">Loading...</p>
      </div>
    );
  }

  const fetchPlanets = async () => {
    if (!planets.trim()) return;
    setFetching(true);
    try {
      const response = await fetch(
        `https://api.api-ninjas.com/v1/planets?name=${encodeURIComponent(
          planets
        )}`,
        {
          headers: {
            "X-Api-Key": "YHg5pKRuNeVnEPEHWgvTLw==k3du7UpQPrX2c79C",
          },
        }
      );
      const json = await response.json();
      setFacts(json);
    } catch (error) {
      alert("Failed to fetch planets.");
    } finally {
      setFetching(false);
    }
  };

  const imageSrc =
    planets.trim() !== ""
      ? `/images/planetImages/${planets.toLowerCase()}.jpg`
      : "/images/sun.jpg";

  return (
    <div className="flex gap-10 items-center justify-center mt-35 px-6">
      <div className="w-64 h-64 border-2 border-blue-500 rounded overflow-hidden flex justify-center items-center">
        <img
          src={imageSrc}
          alt={planets ? planets : "Space"}
          className="object-cover w-full h-full opacity-80"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = "/images/sun.jpg";
          }}
        />
      </div>

      <div className="flex flex-col max-w-lg">
        <h1 className="text-4xl font-bold font-serif mb-6">Explore Planets</h1>
        <input
          type="text"
          value={planets}
          placeholder="Enter a planet name"
          onChange={(e) => setPlanets(e.target.value)}
          className="w-80 p-2 border rounded mb-4"
        />
        <button
          className="bg-blue-500 text-white px-4 py-2 mb-4 rounded hover:bg-blue-600 transition-colors duration-300"
          onClick={fetchPlanets}
          disabled={fetching}
        >
          {fetching ? "Fetching..." : "Fetch Planet Facts"}
        </button>

        {facts && facts.length > 0 && (
          <div className="bg-white text-black shadow-md rounded-lg p-6 border-blue-500 border-2">
            <p>
              The planet <strong>{facts[0].name}</strong> has a mass of{" "}
              <strong>{facts[0].mass}</strong> and a radius of{" "}
              <strong>{facts[0].radius}</strong>. It takes approximately{" "}
              <strong>{facts[0].period}</strong> days to complete one orbit. The
              average distance from its star is about{" "}
              <strong>{facts[0].semi_major_axis}</strong> astronomical units.
              Its temperature is around <strong>{facts[0].temperature}</strong>{" "}
              Kelvin. The planet is located roughly{" "}
              <strong>{facts[0].distance_light_year}</strong> light years away,
              orbiting a star with a mass of{" "}
              <strong>{facts[0].host_star_mass}</strong> solar masses and a
              temperature of <strong>{facts[0].host_star_temperature}</strong>{" "}
              Kelvin.
            </p>
          </div>
        )}

        {facts && !facts.length && <p>No facts found for this planet.</p>}
      </div>
    </div>
  );
}
