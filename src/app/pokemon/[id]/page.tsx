"use client";

import { useRouter } from "next/navigation";
import Skeleton from "@mui/material/Skeleton";

import React from "react";

import Image from "next/image";
import { gql } from "@apollo/client";
import client from "../../lib/apollo-client";
import BarChart from "@/app/components/barChart";
import PokemonTypeBadge from "@/app/components/PokemonTypeBadge";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const GET_POKEMON_BY_ID = gql`
  query GetPokemonById($id: String!) {
    pokemon(id: $id) {
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
      evolutionRequirements {
        amount
        name
      }
      evolutions {
        id
        number
        name
        image
        maxCP
        types
      }
      image
    }
  }
`;

type Pokemon = {
  id: string;
  name: string;
  number: string;
  image: string;
  types: string[];
  maxHP: number;
  maxCP: number;
  weaknesses: string[];
  classification: string;
  height: {
    minimum: string;
    maximum: string;
  };
  weight: {
    minimum: string;
    maximum: string;
  };
  fleeRate: number;
  evolutions: {
    id: string;
    number: string;
    name: string;
    image: string;
    maxCP: number;
    types: string[];
  }[];
  attacks: {
    fast: {
      name: string;
      type: string;
      damage: number;
    }[];
    special: {
      name: string;
      type: string;
      damage: number;
    }[];
  };
};

function PokemonDetail({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [pokemon, setPokemon] = React.useState<Pokemon | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<Error | null>(null);

  const { id } = React.use(params);
  const decodedId = decodeURIComponent(id);

  const backToHome = () => {
    router.push("/");
  };

  React.useEffect(() => {
    if (!decodedId) return;

    const fetchPokemon = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await client.query({
          query: GET_POKEMON_BY_ID,
          variables: { id: decodedId },
        });
        setPokemon(result.data.pokemon);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchPokemon();
  }, [decodedId]);

  if (loading)
    return (
      <div className="grid grid-cols-10 gap-4 items-start justify-center h-screen bg-white px-10  pt-10">
        <div className="col-span-1 flex items-center justify-center gap-2 font-medium text-gray-500">
          <Skeleton variant="rectangular" width={80} height={40} />
        </div>

        <div className="col-span-4 px-20 mt-10 space-y-4">
          <Skeleton variant="text" width={200} height={40} />
          <div className="flex space-x-2">
            <Skeleton variant="rectangular" width={80} height={30} />
            <Skeleton variant="rectangular" width={80} height={30} />
          </div>
          <Skeleton variant="rectangular" width="80%" height={250} />
          <Skeleton variant="text" width="100%" height={30} />
        </div>

        <div className="col-span-5 grid justify-start mt-10 space-y-6">
          <Skeleton variant="text" width={130} height={30} />
          <div className="flex space-x-3">
            <Skeleton variant="rectangular" width={60} height={30} />
            <Skeleton variant="rectangular" width={60} height={30} />
            <Skeleton variant="rectangular" width={60} height={30} />
          </div>

          <Skeleton variant="text" width={100} height={30} />
          <div className="flex space-x-4">
            <Skeleton variant="rectangular" width={110} height={90} />
            <Skeleton variant="rectangular" width={110} height={90} />
            <Skeleton variant="rectangular" width={110} height={90} />
          </div>

          <Skeleton variant="text" width={100} height={30} />
          <div className="space-y-3">
            <Skeleton variant="text" width="100%" height={20} />
            <Skeleton variant="text" width="100%" height={20} />
            <Skeleton variant="text" width="100%" height={20} />
          </div>
        </div>
      </div>
    );

  if (error) return <p>Error: {error.message}</p>;
  if (!pokemon) return <p>No data found</p>;
  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start justify-center min-h-screen bg-white px-4 pb-10 sm:px-6 md:px-10 pt-10">
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

      <div className="col-span-1 md:col-span-5 px-2 sm:px-6 mt-10">
        <div className="flex flex-wrap gap-4 items-center">
          <h2 className="text-2xl sm:text-3xl font-bold">{pokemon.name}</h2>
          <p className="text-lg sm:text-xl font-semibold text-gray-500">
            #{pokemon.number}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-4 my-3">
          {pokemon.types.map((type, index) => (
            <PokemonTypeBadge key={index} type={type} />
          ))}
        </div>

        <Image
          width={300}
          height={300}
          src={pokemon.image}
          alt={pokemon.name}
          className="w-full sm:w-[80%] h-auto object-cover mx-auto"
        />
      </div>

      <div className="col-span-1 md:col-span-6 mt-10">
        <div className="flex flex-col gap-6">
          <div>
            <div className="font-bold">Weaknesses</div>
            <div className="flex  gap-2 mt-2">
              {pokemon.weaknesses.map((weakness, index) => (
                <div
                  key={index}
                  className="px-2 py-1 rounded-xl bg-gray-200 text-sm"
                >
                  {weakness}
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="font-bold">Version</div>
            <div className="flex flex-wrap gap-4 mt-2">
              <div className="px-4 py-3 bg-gray-200 rounded-md text-sm">
                <div className="font-bold">Height</div>
                <div>Min: {pokemon.height.minimum}</div>
                <div>Max: {pokemon.height.maximum}</div>
              </div>
              <div className="px-4 py-3 bg-gray-200 rounded-md text-sm">
                <div className="font-bold">Weight</div>
                <div>Min: {pokemon.weight.minimum}</div>
                <div>Max: {pokemon.weight.maximum}</div>
              </div>
              <div className="px-4 py-3 bg-gray-200 rounded-md text-sm">
                <div className="font-bold">Classification</div>
                <div>{pokemon.classification}</div>
              </div>
            </div>
          </div>

          <div>
            <div className="font-bold">Stats</div>

            <BarChart value={pokemon?.maxHP ?? 0} label="HP" />
            <BarChart value={pokemon?.maxCP ?? 0} label="CP" />
            <BarChart value={pokemon?.fleeRate ?? 0} label="Flee Rate" />
            <BarChart
              value={
                pokemon?.evolutions?.length
                  ? Math.max(...pokemon.evolutions.map((evo) => evo.maxCP))
                  : 0
              }
              label="Max Evolution CP"
            />
          </div>
        </div>
      </div>
      <div className="grid col-span-full justify-center items-center justify-items-center">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 justify-center items-start justify-items-center mt-10 w-full max-w-6xl px-4">
          {/* Evolutions Section */}
          <div className="w-full">
            <div className="font-bold text-lg">Evolutions</div>
            {pokemon.evolutions && pokemon.evolutions.length > 0 ? (
              <div className="flex flex-wrap justify-center gap-6 my-4">
                {pokemon.evolutions.map((evolution, index) => (
                  <React.Fragment key={index}>
                    <div className="flex flex-col items-center px-2 py-1 rounded-xl text-sm text-center">
                      <Image
                        width={100}
                        height={100}
                        src={evolution.image}
                        alt={evolution.name}
                        className="w-20 h-20 sm:w-24 sm:h-24 rounded-full mb-1 border-2 border-gray-200"
                      />
                      <div className="flex gap-2 items-center justify-center">
                        <div className="font-semibold">{evolution.name}</div>
                        <div className="text-xs text-gray-600">
                          #{evolution.number}
                        </div>
                      </div>
                      <div className="my-2 flex gap-1 flex-wrap justify-center">
                        {evolution.types.map((type, index) => (
                          <PokemonTypeBadge key={index} type={type} />
                        ))}
                      </div>
                    </div>
                    {index < pokemon.evolutions.length - 1 && (
                      <div className="text-xl text-gray-400 self-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="30"
                          height="30"
                          viewBox="0 0 32 32"
                        >
                          <path
                            fill="#000"
                            d="M2 16A14 14 0 1 0 16 2A14 14 0 0 0 2 16m6-1h12.15l-5.58-5.607L16 8l8 8l-8 8l-1.43-1.427L20.15 17H8Z"
                          />
                          <path
                            fill="none"
                            d="m16 8l-1.43 1.393L20.15 15H8v2h12.15l-5.58 5.573L16 24l8-8z"
                          />
                        </svg>
                      </div>
                    )}
                  </React.Fragment>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 mt-2">No Evolutions</p>
            )}
          </div>

          {/* Attacks Section */}
          <div className="w-full">
            <div className="font-bold text-lg">Attacks</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              {/* Special Attacks */}
              <div className="flex flex-col gap-2">
                <div className="font-semibold flex items-center gap-2">
                  {/* Special Attack Icon */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="30"
                    height="30"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fill="#ff2900"
                      d="M7 0a2 2 0 0 0-2 2h9a2 2 0 0 1 2 2v12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z"
                    />
                    <path
                      fill="#ff2900"
                      d="M13 20H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2m-6.5-3.5l.41-1.09L8 15l-1.09-.41l-.41-1.09l-.41 1.09L5 15l1.09.41zm2.982-.949l.952-2.561l2.53-.964l-2.53-.964L9.482 8.5l-.952 2.562l-2.53.964l2.53.964zM6 10.5l.547-1.453L8 8.5l-1.453-.547L6 6.5l-.547 1.453L4 8.5l1.453.547z"
                    />
                  </svg>
                  Special Attacks
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {pokemon.attacks.special.map((attack, index) => (
                    <div
                      key={index}
                      className="px-4 py-3 bg-gray-200 rounded-md text-sm"
                    >
                      <div className="font-bold mb-2">{attack.name}</div>
                      <PokemonTypeBadge key={index} type={attack.type} />
                      <div className="flex gap-2 mt-2 items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="15"
                          height="15"
                          viewBox="0 0 24 24"
                        >
                          <path
                            fill="#ff2900"
                            d="M8.106 18.247C5.298 16.083 2 13.542 2 9.137c0-4.6 4.923-7.935 9.264-4.323L9.81 8.204a.75.75 0 0 0 .253.906l2.833 2.024l-2.466 2.878a.75.75 0 0 0 .039 1.018l1.7 1.7l-.91 3.64c-.756-.253-1.516-.843-2.298-1.46q-.417-.326-.856-.663"
                          />
                          <path
                            fill="#ff2900"
                            d="M12.812 20.345c.732-.265 1.469-.837 2.226-1.434q.417-.328.856-.664C18.702 16.083 22 13.542 22 9.137c0-4.515-4.741-7.81-9.02-4.518l-1.553 3.622l3.009 2.149a.75.75 0 0 1 .133 1.098l-2.548 2.973l1.51 1.509a.75.75 0 0 1 .197.712z"
                          />
                        </svg>
                        {attack.damage} damage
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Fast Attacks */}
              <div className="flex flex-col gap-2">
                <div className="font-semibold flex items-center gap-2">
                  {/* Fast Attack Icon */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="30"
                    height="30"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill="#ffb800"
                      d="m11.712 14l-5.945-.692q-.528-.056-.677-.56t.243-.852l9.783-8.78q.067-.068.155-.101q.088-.034.254-.034q.27 0 .426.233t.003.49l-3.723 6.315l5.983.692q.528.056.687.55t-.234.843l-9.783 8.8q-.067.067-.155.091t-.254.024q-.27 0-.407-.232t-.003-.471z"
                    />
                  </svg>
                  Fast Attacks
                </div>
                {pokemon.attacks.fast.map((attack, index) => (
                  <div
                    key={index}
                    className="px-4 py-2 bg-gray-200 rounded-md text-sm"
                  >
                    <div className="font-bold">{attack.name}</div>
                    <div className="flex gap-3 my-2">
                      <PokemonTypeBadge key={index} type={attack.type} />
                      <div className="flex gap-2 items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="15"
                          height="15"
                          viewBox="0 0 24 24"
                        >
                          <path
                            fill="#ff2900"
                            d="M8.106 18.247C5.298 16.083 2 13.542 2 9.137c0-4.6 4.923-7.935 9.264-4.323L9.81 8.204a.75.75 0 0 0 .253.906l2.833 2.024l-2.466 2.878a.75.75 0 0 0 .039 1.018l1.7 1.7l-.91 3.64c-.756-.253-1.516-.843-2.298-1.46q-.417-.326-.856-.663"
                          />
                          <path
                            fill="#ff2900"
                            d="M12.812 20.345c.732-.265 1.469-.837 2.226-1.434q.417-.328.856-.664C18.702 16.083 22 13.542 22 9.137c0-4.515-4.741-7.81-9.02-4.518l-1.553 3.622l3.009 2.149a.75.75 0 0 1 .133 1.098l-2.548 2.973l1.51 1.509a.75.75 0 0 1 .197.712z"
                          />
                        </svg>
                        {attack.damage} damage
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PokemonDetail;
