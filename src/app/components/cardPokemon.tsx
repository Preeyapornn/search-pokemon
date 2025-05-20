"use client";
import React from "react";
import PokemonTypeBadge from "@/app/components/PokemonTypeBadge";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  useMediaQuery,
  Chip,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useRouter } from "next/navigation";

interface Attack {
  name: string;
  type: string;
  damage: number;
}

interface Evolution {
  id: string;
  name: string;
}

interface PokemonType {
  name: string;
}

interface Pokemon {
  id: string;
  name: string;
  number: string;
  image: string;
  types: PokemonType[];
  attacks?: {
    fast: Attack[];
    special: Attack[];
  };
  evolutions?: Evolution[];
}

interface CardPokenProps {
  pokemon: Pokemon;
}

const CardPoken: React.FC<CardPokenProps> = ({ pokemon }) => {
  const router = useRouter();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const handleClick = () => {
    router.push(`/pokemon/${pokemon.id}`);
  };

  const handleEvolutionClick = () => {
    router.push(`/pokemon/${pokemon.id}`);
  };

  return (
    <Box
      onClick={handleClick}
      sx={{
        width: isSmallScreen ? "100%" : 500,
        maxWidth: "100%",
        margin: "auto",
        cursor: "pointer",
      }}
    >
      <Card
        sx={{
          height: 500,
          borderRadius: 3,
          boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
          transition: "transform 0.3s ease",
          "&:hover": {
            transform: "scale(1.03)",
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "white",
            padding: 2,
            height: isSmallScreen ? 160 : 200,
          }}
        >
          <CardMedia
            component="img"
            image={pokemon.image}
            alt={pokemon.name}
            sx={{
              width: "60%",
              height: isSmallScreen ? 160 : 200,
              objectFit: "contain",
              backgroundColor: "white",
              padding: 2,
              justifyContent: "center",
              alignItems: "center",
            }}
          />
        </Box>
        <CardContent>
          <Typography variant="h6" fontWeight="bold">
            {pokemon.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            #{pokemon.number}
          </Typography>
          <Box mt={1} display="flex" gap={1} flexWrap="wrap">
            {pokemon.types.map((type, index) => (
              <PokemonTypeBadge key={index} type={type.name} />
            ))}
          </Box>
        </CardContent>
        <CardContent
          sx={{
            flexGrow: 1,
            maxHeight: 400 - (isSmallScreen ? 160 : 200) - 32,
            overflowY: "auto",
          }}
        >
          {pokemon.evolutions && pokemon.evolutions.length > 0 && (
            <Box>
              <Typography variant="subtitle2" fontWeight="bold">
                Evolutions
              </Typography>
              <Box display="flex" flexWrap="wrap" gap={1}>
                {pokemon.evolutions.map((evo, i) => (
                  <Chip
                    key={i}
                    label={evo.name}
                    clickable
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEvolutionClick();
                    }}
                    color="primary"
                    variant="outlined"
                  />
                ))}
              </Box>
            </Box>
          )}

          {pokemon.attacks && (
            <Box
              mt={2}
              display="flex"
              gap={2}
              flexDirection={isSmallScreen ? "column" : "row"}
            >
         
              <Box flex={1}>
                <Typography variant="subtitle2" fontWeight="bold">
                  Fast Attacks
                </Typography>
                <Box display="flex" flexWrap="wrap" gap={1}>
                  {pokemon.attacks.fast.map((attack, i) => (
                    <Chip
                      key={i}
                      label={`${attack.name} (${attack.type}, ${attack.damage})`}
                      size="small"
                      variant="outlined"
                    />
                  ))}
                </Box>
              </Box>

    
              <Box flex={1}>
                <Typography variant="subtitle2" fontWeight="bold">
                  Special Attacks
                </Typography>
                <Box display="flex" flexWrap="wrap" gap={1}>
                  {pokemon.attacks.special.map((attack, i) => (
                    <Chip
                      key={i}
                      label={`${attack.name} (${attack.type}, ${attack.damage})`}
                      size="small"
                      color="secondary"
                    />
                  ))}
                </Box>
              </Box>
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default CardPoken;
