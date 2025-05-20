"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import client from "../lib/apollo-client";
import { gql } from "@apollo/client";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts";

type Attack = {
  name: string;
  type: string;
  damage: number;
};

type Pokemon = {
  id: string;
  number: string;
  name: string;
  image: string;
  classification: string;
  types: string[];
  weaknesses: string[];
  maxHP: number;
  maxCP: number;
  attacks: {
    fast: Attack[];
    special: Attack[];
  };
  weight: { minimum: string; maximum: string };
  height: { minimum: string; maximum: string };
  fleeRate: number;
};

const GET_ALL_POKEMONS = gql`
  query GetAllPokemons {
    pokemons(first: 151) {
      id
      number
      name
      image
      classification
      types
      weaknesses
      maxHP
      maxCP
      attacks {
        fast {
          name
          type
          damage
        }
        special {
          name
          type
          damage
        }
      }
      weight {
        minimum
        maximum
      }
      height {
        minimum
        maximum
      }
      fleeRate
    }
  }
`;

const DashboardPage = () => {
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const result = await client.query({ query: GET_ALL_POKEMONS });
      setPokemons(result.data.pokemons);
      setLoading(false);
    };
    fetchData();
  }, []);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? pokemons.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === pokemons.length - 1 ? 0 : prev + 1));
  };

  const parseNumber = (value: string) =>
    parseFloat(value.replace(" kg", "").replace(" m", ""));

  const getRadarData = (pokemon: Pokemon) => {
    const avgWeight =
      (parseNumber(pokemon.weight.minimum) +
        parseNumber(pokemon.weight.maximum)) /
      2;
    const avgHeight =
      (parseNumber(pokemon.height.minimum) +
        parseNumber(pokemon.height.maximum)) /
      2;
    const fastAvg =
      pokemon.attacks.fast.reduce((sum, a) => sum + a.damage, 0) /
      (pokemon.attacks.fast.length || 1);
    const specialAvg =
      pokemon.attacks.special.reduce((sum, a) => sum + a.damage, 0) /
      (pokemon.attacks.special.length || 1);

    return [
      { subject: "HP", value: pokemon.maxHP },
      { subject: "CP", value: pokemon.maxCP },
      { subject: "Weight", value: avgWeight },
      { subject: "Height", value: avgHeight },
      { subject: "Flee Rate", value: pokemon.fleeRate * 100 },
      { subject: "Fast DMG", value: fastAvg },
      { subject: "Special DMG", value: specialAvg },
      { subject: "Weaknesses", value: pokemon.weaknesses.length },
    ];
  };

  if (loading || pokemons.length === 0)
    return (
      <div className="flex flex-col items-center px-4 py-8 animate-pulse">
        <div className="w-full max-w-5xl flex rounded-lg shadow-lg overflow-hidden relative">
          <div className="w-1/2 bg-gray-100 p-4">
            <div className="h-6 bg-gray-300 rounded w-1/3 mx-auto mb-6"></div>
            <div className="w-full h-[400px] bg-gray-200 rounded"></div>
          </div>

          <div className="w-1/2 bg-gray-50 p-6 text-center">
            <div className="mx-auto w-40 h-40 bg-gray-200 rounded mb-4"></div>
            <div className="flex justify-center items-center gap-x-2 mb-4">
              <div className="w-24 h-6 bg-gray-300 rounded"></div>
              <div className="w-12 h-4 bg-gray-300 rounded"></div>
            </div>
            <div className="space-y-2 mt-4 text-left px-4">
              <div className="w-full h-4 bg-gray-200 rounded"></div>
              <div className="w-3/4 h-4 bg-gray-200 rounded"></div>
              <div className="w-5/6 h-4 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );

  const pokemon = pokemons[currentIndex];

  type RadarDataItem = {
    subject: string;
    value: number;
  };

  const normalizeRadarData = (data: RadarDataItem[]) => {
    const ranges: Record<string, { min: number; max: number }> = {
      HP: { min: 0, max: 500 },
      CP: { min: 0, max: 5000 },
      Weight: { min: 0, max: 500 },
      Height: { min: 0, max: 20 },
      "Flee Rate": { min: 0, max: 100 },
      "Fast DMG": { min: 0, max: 100 },
      "Special DMG": { min: 0, max: 200 },
      Weaknesses: { min: 0, max: 10 },
    };

    return data.map((item) => {
      const range = ranges[item.subject];
      const normalized =
        ((item.value - range.min) / (range.max - range.min)) * 100;
      return { ...item, normalized };
    });
  };

  const radarData = getRadarData(pokemon);
  const normalizedData = normalizeRadarData(radarData);

  const highestStat = normalizedData.reduce((max, curr) =>
    curr.normalized > max.normalized ? curr : max
  );
  const lowestStat = normalizedData.reduce((min, curr) =>
    curr.normalized < min.normalized ? curr : min
  );

  const recommendRole = () => {
    const stat = highestStat.subject;
    if (stat === "HP" || stat === "CP") {
      return "This Pokémon has high durability or power. Great for front-line battles.";
    } else if (stat === "Fast DMG" || stat === "Special DMG") {
      return "This Pokémon delivers strong attacks. Ideal for offensive roles.";
    } else if (stat === "Weight" || stat === "Height") {
      return "This Pokémon has impressive size. Can intimidate or tank well.";
    } else if (stat === "Flee Rate") {
      return "This Pokémon tends to flee easily. Suitable for hit-and-run or scouting.";
    } else if (stat === "Weaknesses") {
      return "This Pokémon has many weaknesses. Handle with care or support with team synergy.";
    } else {
      return "Balanced stats. Versatile for various strategies.";
    }
  };

  const description = `
Strongest Stat: ${highestStat.subject} (${highestStat.value.toFixed(1)})
Weakest Stat: ${lowestStat.subject} (${lowestStat.value.toFixed(1)})

${recommendRole()}
`;
  const backToHome = () => {
    router.push("/");
  };

  return (
    <div className="flex flex-col items-center px-4 py-8">
      <div className="flex flex-col sm:flex-row items-center justify-between w-full max-w-5xl mb-6">
        <div
          onClick={backToHome}
          className="col-span-1 flex items-center justify-start gap-2 font-medium text-gray-500 hover:text-gray-800 cursor-pointer"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 1024 1024"
          >
            <path
              fill="#777777"
              d="M224 480h640a32 32 0 1 1 0 64H224a32 32 0 0 1 0-64"
            />
            <path
              fill="#777777"
              d="m237.248 512l265.408 265.344a32 32 0 0 1-45.312 45.312l-288-288a32 32 0 0 1 0-45.312l288-288a32 32 0 1 1 45.312 45.312z"
            />
          </svg>
          <div className="text-sm sm:text-base">Pokedex</div>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center">
          Pokémon Dashboard
        </h1>
        <div></div>
      </div>

      <div className="relative flex flex-col md:flex-row w-full max-w-5xl rounded-lg shadow-lg overflow-hidden">
        <button
          onClick={handlePrev}
          className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10 bg-white/75 rounded-full p-2 shadow hover:bg-gray-100"
        >
          <ChevronLeftIcon className="w-6 h-6 text-gray-600" />
        </button>

        <div className="w-full md:w-1/2 bg-gray-50 p-4">
          <h2 className="text-base sm:text-lg font-semibold text-center mb-4">
            Stats Overview
          </h2>
          <div className="w-full h-64 sm:h-96">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" />
                <PolarRadiusAxis angle={30} domain={[0, "auto"]} />
                <Radar
                  name={pokemon.name}
                  dataKey="value"
                  stroke="#8884d8"
                  fill="#8884d8"
                  fillOpacity={0.6}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="w-full md:w-1/2 bg-white p-6 text-center">
          <Image
            src={pokemon.image}
            alt={pokemon.name}
            className="mx-auto w-32 h-32 sm:w-40 sm:h-40 object-contain"
          />
          <div className="flex justify-center items-center gap-x-2 mt-4">
            <h2 className="text-xl sm:text-2xl font-bold">{pokemon.name}</h2>
            <p className="text-gray-600 text-sm sm:text-base">
              #{pokemon.number}
            </p>
          </div>
          <div className="mt-4 text-sm text-gray-700 whitespace-pre-line px-4 text-left">
            {description}
          </div>
        </div>

        <button
          onClick={handleNext}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10 bg-white/50 rounded-full p-2 shadow hover:bg-gray-100"
        >
          <ChevronRightIcon className="w-6 h-6 text-gray-600" />
        </button>
      </div>
    </div>
  );
};

export default DashboardPage;
