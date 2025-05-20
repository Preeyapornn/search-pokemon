"use client";
import React from "react";

type PokemonType =
  | "Fire"
  | "Water"
  | "Grass"
  | "Electric"
  | "Bug"
  | "Normal"
  | "Poison"
  | "Ground"
  | "Fairy"
  | "Fighting"
  | "Flying"
  | "Psychic"
  | "Rock"
  | "Ghost"
  | "Ice"
  | "Dragon"
  | "Steel"
  | string;

const typeColors: Record<PokemonType, string> = {
  Fire: "bg-red-400",
  Water: "bg-blue-400",
  Grass: "bg-green-400",
  Electric: "bg-yellow-400",
  Bug: "bg-lime-500",
  Normal: "bg-gray-300",
  Poison: "bg-purple-400",
  Ground: "bg-yellow-600",
  Fairy: "bg-pink-400",
  Fighting: "bg-orange-500",
  Flying: "bg-sky-400",
  Psychic: "bg-pink-300",
  Rock: "bg-yellow-800",
  Ghost: "bg-indigo-500",
  Ice: "bg-cyan-300",
  Dragon: "bg-purple-700",
  Steel: "bg-gray-700",
};

interface Props {
  type: PokemonType;
}

const PokemonTypeBadge: React.FC<Props> = ({ type }) => {
  const bgColor = typeColors[type] || "bg-gray-200";

  return (
    <div
      className={`inline-block px-2 py-1 rounded-xl text-sm mr-2 text-white ${bgColor}`}
    >
      {type}
    </div>
  );
};

export default PokemonTypeBadge;
