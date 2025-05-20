"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import {
  Box,
  FormControl,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
  Pagination,
  Stack,
} from "@mui/material";

import CardPoken from "../components/cardPokemon";
import client from "../lib/apollo-client";
import { gql } from "@apollo/client";

const WelcomePage = () => {
  const [search, setSearch] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [from, setFrom] = useState(1);
  const [to, setTo] = useState(151);
  const [loading, setLoading] = useState(true);
  const [pokemons, setPokemons] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const itemsPerPage = 9;
  const [types, setTypes] = useState<string[]>([]);
  const [weaknesses, setWeaknesses] = useState<string[]>([]);
  const [selectedType, setSelectedType] = useState<string>("");
  const [selectedWeakness, setSelectedWeakness] = useState<string>("");
  const [selectedHeight, setSelectedHeight] = useState<string>("");
  const [selectedWeight, setSelectedWeight] = useState<string>("");
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const nameParam = searchParams.get("name");
    if (nameParam) {
      setSearch(nameParam);
      setSearchTerm(nameParam);
    }
  }, [searchParams]);

  // Dropdown onchange handlers
  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedType(e.target.value);
    setPage(1);
  };

  const handleWeaknessChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedWeakness(e.target.value);
    setPage(1);
  };

  const handleHeightChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedHeight(e.target.value);
    setPage(1);
  };

  const handleWeightChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedWeight(e.target.value);
    setPage(1);
  };

  useEffect(() => {
    const fetchTypes = async () => {
      const result = await client.query({
        query: gql`
          query GetAllTypes {
            pokemons(first: 151) {
              types
            }
          }
        `,
      });

      const uniqueTypes = [
        ...new Set(
          result.data.pokemons.flatMap((pokemon: any) => pokemon.types)
        ),
      ] as string[];
      setTypes(uniqueTypes);
    };

    fetchTypes();
  }, []);

  useEffect(() => {
    const fetchWeaknesses = async () => {
      const result = await client.query({
        query: gql`
          query GetAllWeaknesses {
            pokemons(first: 151) {
              weaknesses
            }
          }
        `,
      });

      const uniqueWeaknesses = [
        ...new Set(
          result.data.pokemons.flatMap((pokemon: any) => pokemon.weaknesses)
        ),
      ] as string[];
      setWeaknesses(uniqueWeaknesses);
    };

    fetchWeaknesses();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const result = await client.query({
        query: gql`
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
              evolutionRequirements {
                amount
                name
              }
              evolutions {
                name
                maxCP
              }
              image
            }
          }
        `,
      });
      setPokemons(result.data.pokemons);
      setLoading(false);
    };
    fetchData();
  }, []);

  const handleChangePage = (_: any, value: number) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // const handleSearch = () => {
  //   router.push(`/?name=${encodeURIComponent(search.trim())}`);
  // };

  const handleSearch = () => {
    const trimmed = search.trim();
    setSearchTerm(trimmed);
    setPage(1);
    if (trimmed) {
      router.push(`/?name=${encodeURIComponent(trimmed)}`);
    } else {
      router.push(`/`);
    }
  };

  const heightRanges = [
    { label: "Short (0 - 1 m)", value: "0-1" },
    { label: "Medium (1 - 2 m)", value: "1-2" },
    { label: "Tall (2+ m)", value: "2-100" },
  ];

  const weightRanges = [
    { label: "Light (0 - 10 kg)", value: "0-10" },
    { label: "Medium (10 - 50 kg)", value: "10-50" },
    { label: "Heavy (50+ kg)", value: "50-999" },
  ];

  const handleEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSearch();
  };

  const handleFromChange = (e: SelectChangeEvent<number>) => {
    setFrom(Number(e.target.value));
  };

  const handleToChange = (e: SelectChangeEvent<number>) => {
    setTo(Number(e.target.value));
  };

  const filteredPokemons = pokemons
    .filter((p) => {
      const number = parseInt(p.number);
      return number >= from && number <= to;
    })
    .filter((p) =>
      searchTerm
        ? p.name.toLowerCase().includes(searchTerm.toLowerCase())
        : true
    )
    .filter((p) => (selectedType ? p.types.includes(selectedType) : true))
    .filter((p) =>
      selectedWeakness ? p.weaknesses.includes(selectedWeakness) : true
    )
    .filter((p) => {
      if (!selectedHeight) return true;
      const [minH, maxH] = selectedHeight.split("-").map(Number);

      const minHeight = parseFloat(p.height.minimum);
      const maxHeight = parseFloat(p.height.maximum);
      return maxHeight >= minH && minHeight <= maxH;
    })
    .filter((p) => {
      if (!selectedWeight) return true;
      const [minW, maxW] = selectedWeight.split("-").map(Number);
      const minWeight = parseFloat(p.weight.minimum);
      const maxWeight = parseFloat(p.weight.maximum);
      return maxWeight >= minW && minWeight <= maxW;
    })
    .sort((a, b) => {
      const aNum = parseInt(a.number);
      const bNum = parseInt(b.number);
      return sortOrder === "asc" ? aNum - bNum : bNum - aNum;
    })
    .filter((p) => {
      if (!selectedHeight) return true;
      const [minH, maxH] = selectedHeight.split("-").map(Number);
      const min = parseFloat(p.height.minimum);
      const max = parseFloat(p.height.maximum);
      return max >= minH && min <= maxH;
    })
    .filter((p) => {
      if (!selectedWeight) return true;
      const [minW, maxW] = selectedWeight.split("-").map(Number);
      const min = parseFloat(p.weight.minimum);
      const max = parseFloat(p.weight.maximum);
      return max >= minW && min <= maxW;
    });

  const handleResetFilters = () => {
    setSearch("");
    setSearchTerm("");
    setSortOrder("asc");
    setFrom(1);
    setTo(151);

    setSelectedType("");
    setSelectedWeakness("");
    setSelectedHeight("");
    setSelectedWeight("");
    setPage(1);
    window.location.reload();
  };

  const paginatedPokemons = filteredPokemons.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const numberOptions = Array.from({ length: 151 }, (_, i) => i + 1);

  return (
    <div>
      <div className="flex flex-row items-center gap-4 bg-white rounded-xl shadow-md px-4 py-2 mt-10">
        <TextField
          variant="standard"
          placeholder="Search Your Pokémon!"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          fullWidth
          onKeyDown={handleEnter}
          InputProps={{ disableUnderline: true }}
          className="flex-1"
        />
        <button onClick={handleSearch} aria-label="Search">
          <div className="bg-red-700 p-2 rounded-xl transition duration-300 hover:cursor-pointer hover:shadow-[10px_10px_20px_rgba(239,68,68,0.6)]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="30"
              height="30"
              viewBox="0 0 24 24"
              className="hover:animate-spin"
            >
              <path
                fill="#fff"
                d="M12 4c4.08 0 7.45 3.05 7.94 7h-4.06c-.45-1.73-2.02-3-3.88-3s-3.43 1.27-3.87 3H4.06C4.55 7.05 7.92 4 12 4"
                opacity="0.3"
              />
              <path
                fill="#fff"
                d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10s10-4.48 10-10S17.52 2 12 2m0 2c4.08 0 7.45 3.05 7.94 7h-4.06c-.45-1.73-2.02-3-3.88-3s-3.43 1.27-3.87 3H4.06C4.55 7.05 7.92 4 12 4m2 8c0 1.1-.9 2-2 2s-2-.9-2-2s.9-2 2-2s2 .9 2 2m-2 8c-4.08 0-7.45-3.05-7.94-7h4.06c.44 1.73 2.01 3 3.87 3s3.43-1.27 3.87-3h4.06c-.47 3.95-3.84 7-7.92 7"
              />
            </svg>
          </div>
        </button>
      </div>

      <Box
        display="flex"
        flexDirection={{ xs: "column", md: "row" }}
        justifyContent="space-between"
        alignItems="center"
        gap={2}
        my={4}
      >
        <FormControl
          size="small"
          sx={{
            minWidth: 120,
            ".MuiOutlinedInput-notchedOutline": { border: "none" },
            backgroundColor: "transparent",
          }}
        >
          <Select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          >
            <MenuItem value="asc">Ascending</MenuItem>
            <MenuItem value="desc">Descending</MenuItem>
          </Select>
        </FormControl>

        <Box
          display="flex"
          flexWrap="wrap"
          alignItems="center"
          gap={2}
          mt={{ xs: 2, md: 0 }}
        >
          <Typography>From</Typography>
          <FormControl
            size="small"
            sx={{
              minWidth: 100,
              backgroundColor: "#fff",
              borderRadius: "12px",
              ".MuiOutlinedInput-notchedOutline": { border: "none" },
            }}
          >
            <Select value={from} onChange={handleFromChange}>
              {numberOptions.map((num) => (
                <MenuItem key={num} value={num}>
                  {num}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Typography>To</Typography>
          <FormControl
            size="small"
            sx={{
              minWidth: 100,
              backgroundColor: "#fff",
              borderRadius: "12px",
              ".MuiOutlinedInput-notchedOutline": { border: "none" },
            }}
          >
            <Select value={to} onChange={handleToChange}>
              {numberOptions.map((num) => (
                <MenuItem key={num} value={num}>
                  {num}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Box>

      <div className="flex flex-wrap justify-center gap-4">
        <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg min-w-[140px]">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="30"
            height="30"
            viewBox="0 0 24 24"
          >
            <g
              fill="none"
              stroke="#777777"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
            >
              <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2S2 6.477 2 12s4.477 10 10 10" />
              <path d="M8 14a2 2 0 1 0 0-4a2 2 0 0 0 0 4m8 0a2 2 0 1 0 0-4a2 2 0 0 0 0 4" />
            </g>
          </svg>

          <select
            onChange={handleTypeChange}
            className="bg-white border-none outline-none text-gray-800 text-base"
            defaultValue=""
          >
            <option value="" disabled hidden>
              Types
            </option>
            {types.map((type, index) => (
              <option key={index} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg min-w-[140px]">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="30"
            height="30"
            viewBox="0 0 16 16"
          >
            <path
              fill="#777777"
              d="M10.748 14.25a.75.75 0 0 1-.396-.114C10.212 14.047 9 13.218 9 11.247c0-1.027.339-1.577.611-2.02c.234-.38.389-.631.389-1.233s-.154-.851-.389-1.23C9.339 6.322 9 5.772 9 4.746c0-2.014 1.298-2.849 1.353-2.883a.76.76 0 0 1 .397-.113c.262 0 .499.132.637.353a.753.753 0 0 1-.232 1.028c-.022.015-.654.452-.654 1.615c0 .601.154.851.389 1.23c.272.442.611.992.611 2.017s-.339 1.577-.611 2.02c-.234.38-.389.631-.389 1.233c0 1.167.632 1.606.658 1.624c.343.227.44.69.219 1.034a.75.75 0 0 1-.63.345zm-3.37-.345a.754.754 0 0 0-.219-1.034c-.026-.018-.658-.457-.658-1.624c0-.602.154-.854.391-1.236c.271-.443.609-.993.609-2.017s-.338-1.572-.611-2.017c-.234-.379-.389-.63-.389-1.23c0-1.164.63-1.598.654-1.615a.75.75 0 0 0-.802-1.268C6.298 1.899 5 2.733 5 4.747c0 1.026.339 1.576.613 2.02c.232.379.387.63.387 1.228s-.154.851-.389 1.233c-.272.442-.611.993-.611 2.02c0 2.021 1.297 2.854 1.352 2.889a.746.746 0 0 0 1.026-.231z"
            />
          </svg>

          <select
            onChange={handleWeaknessChange}
            className="bg-white border-none outline-none text-gray-800 text-base"
            defaultValue=""
          >
            <option value="" disabled hidden>
              Weaknesses
            </option>
            {weaknesses.map((weak, index) => (
              <option key={index} value={weak}>
                {weak}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg min-w-[140px]">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="30"
            height="30"
            viewBox="0 0 24 24"
          >
            <path
              fill="#777777"
              d="M20.57 14.86L22 13.43L20.57 12L17 15.57L8.43 7L12 3.43L10.57 2L9.14 3.43L7.71 2L5.57 4.14L4.14 2.71L2.71 4.14l1.43 1.43L2 7.71l1.43 1.43L2 10.57L3.43 12L7 8.43L15.57 17L12 20.57L13.43 22l1.43-1.43L16.29 22l2.14-2.14l1.43 1.43l1.43-1.43l-1.43-1.43L22 16.29z"
            />
          </svg>

          <select
            className="bg-white border-none outline-none text-gray-800 text-base"
            defaultValue={selectedWeight}
            onChange={handleWeightChange}
          >
            <option value="" disabled hidden>
              Weight
            </option>
            <option value="light">Light</option>
            <option value="medium">Medium</option>
            <option value="heavy">Heavy</option>
          </select>
        </div>

        <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg min-w-[140px]">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="30"
            height="30"
            viewBox="0 0 24 24"
          >
            <path
              fill="#777777"
              d="M7 2c1.78 0 2.67 2.16 1.42 3.42C7.16 6.67 5 5.78 5 4a2 2 0 0 1 2-2M5.5 7h3a2 2 0 0 1 2 2v5.5H9V22H5v-7.5H3.5V9a2 2 0 0 1 2-2M19 8h2l-3-4l-3 4h2v8h-2l3 4l3-4h-2m3-14h-8v2h8m0 16h-8v2h8"
            />
          </svg>

          <select
            className="bg-white border-none outline-none text-gray-800 text-base"
            defaultValue={selectedHeight}
            onChange={handleHeightChange}
          >
            <option value="" disabled hidden>
              Height
            </option>
            <option value="short">Short</option>
            <option value="medium">Medium</option>
            <option value="tall">Tall</option>
          </select>
        </div>

        <button
          onClick={handleResetFilters}
          aria-label="Reset Filters"
          className="self-center bg-gray-200 hover:bg-gray-300 rounded-xl p-2 transition"
        >
          <svg
            className="hover:animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            width="30"
            height="30"
            viewBox="0 0 32 32"
          >
            <path
              fill="#000"
              d="M16 4c-5.11 0-9.383 3.16-11.125 7.625l1.844.75C8.176 8.64 11.71 6 16 6c3.24 0 6.134 1.59 7.938 4H20v2h7V5h-2v3.094A11.93 11.93 0 0 0 16 4m9.28 15.625C23.824 23.36 20.29 26 16 26c-3.276 0-6.157-1.612-7.97-4H12v-2H5v7h2v-3.094C9.19 26.386 12.395 28 16 28c5.11 0 9.383-3.16 11.125-7.625z"
            />
          </svg>
        </button>
      </div>

      <Box p={2}>
        {loading ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="50vh"
          >
            <span className="flex  items-center">
              Loading
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="30"
                height="30"
                viewBox="0 0 24 24"
              >
                <circle cx="4" cy="12" r="3" fill="#777777">
                  <animate
                    id="svgSpinners3DotsBounce0"
                    attributeName="cy"
                    begin="0;svgSpinners3DotsBounce1.end+0.25s"
                    calcMode="spline"
                    dur="0.6s"
                    keySplines=".33,.66,.66,1;.33,0,.66,.33"
                    values="12;6;12"
                  />
                </circle>
                <circle cx="12" cy="12" r="3" fill="#777777">
                  <animate
                    attributeName="cy"
                    begin="svgSpinners3DotsBounce0.begin+0.1s"
                    calcMode="spline"
                    dur="0.6s"
                    keySplines=".33,.66,.66,1;.33,0,.66,.33"
                    values="12;6;12"
                  />
                </circle>
                <circle cx="20" cy="12" r="3" fill="#777777">
                  <animate
                    id="svgSpinners3DotsBounce1"
                    attributeName="cy"
                    begin="svgSpinners3DotsBounce0.begin+0.2s"
                    calcMode="spline"
                    dur="0.6s"
                    keySplines=".33,.66,.66,1;.33,0,.66,.33"
                    values="12;6;12"
                  />
                </circle>
              </svg>
            </span>
          </Box>
        ) : filteredPokemons.length === 0 ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="50vh"
          >
            <Typography variant="h6" color="text.secondary">
              Data Not Found
            </Typography>
          </Box>
        ) : (
          <div className="grid  mt-4 grid-cols-2 md:grid-cols-3  gap-4 justify-center">
            {paginatedPokemons.map((pokemon) => (
              <div key={pokemon.id}>
                <CardPoken
                  pokemon={{
                    id: pokemon.id,
                    name: pokemon.name,
                    number: pokemon.number,
                    image: pokemon.image,
                    types: pokemon.types.map((t: string) => ({ name: t })),
                    attacks: pokemon.attacks,
                    evolutions: pokemon.evolutions,
                  }}
                />
              </div>
            ))}
          </div>
        )}
        {filteredPokemons.length > 0 && (
          <Stack mt={4} alignItems="center">
            <Pagination
              count={Math.ceil(filteredPokemons.length / itemsPerPage)}
              page={page}
              onChange={handleChangePage}
              color="primary"
            />
          </Stack>
        )}
      </Box>
    </div>
  );
};

export default WelcomePage;
