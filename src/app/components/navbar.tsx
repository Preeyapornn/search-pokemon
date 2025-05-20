"use client";

import React, { useState } from "react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import logo from "../../../public/image/pokemonLogo.png";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const isActive = (path: string) => pathname === path;

  const navItems = [
    {
      name: "Pokedex",
      path: "/",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="30"
          height="30"
          viewBox="0 0 24 24"
          fill={isActive("/") ? "#2563eb" : "#777777"}
        >
          <path
            fillOpacity="0.3"
            d="M12 4c4.08 0 7.45 3.05 7.94 7h-4.06c-.45-1.73-2.02-3-3.88-3s-3.43 1.27-3.87 3H4.06C4.55 7.05 7.92 4 12 4"
          />
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2m0 2c4.08 0 7.45 3.05 7.94 7h-4.06c-.45-1.73-2.02-3-3.88-3s-3.43 1.27-3.87 3H4.06C4.55 7.05 7.92 4 12 4m2 8c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2m-2 8c-4.08 0-7.45-3.05-7.94-7h4.06c.44 1.73 2.01 3 3.87 3s3.43-1.27 3.87-3h4.06c-.47 3.95-3.84 7-7.92 7" />
        </svg>
      ),
    },
    {
      name: "Pokedashboard",
      path: "/dashboard",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="30"
          height="30"
          viewBox="0 0 2048 2048"
          fill={isActive("/dashboard") ? "#2563eb" : "#777777"}
        >
          <path d="M512 896h384v1152H512zm128 1024h128v-896H640zm384-768h384v896h-384zm128 768h128v-640h-128zM0 1408h384v640H0zm128 512h128v-384H128zM1536 640h384v1408h-384zm128 1280h128V768h-128zM1389 621q19 41 19 83q0 40-15 75t-41 61t-61 41t-75 15t-75-15t-61-41t-41-61t-15-75v-12q0-6 1-12l-188-94q-26 26-61 40t-72 14q-42 0-83-19L365 877q19 41 19 83q0 40-15 75t-41 61t-61 41t-75 15t-75-15t-61-41t-41-61t-15-75t15-75t41-61t61-41t75-15q42 0 83 19l256-256q-19-41-19-83q0-40 15-75t41-61t61-41t75-15t75 15t61 41t41 61t15 75v12q0 6-1 12l188 94q26-26 61-40t72-14q42 0 83 19l256-256q-19-41-19-83q0-40 15-75t41-61t61-41t75-15t75 15t61 41t41 61t15 75t-15 75t-41 61t-61 41t-75 15q-42 0-83-19zM192 1024q26 0 45-19t19-45t-19-45t-45-19t-45 19t-19 45t19 45t45 19m1536-896q-26 0-45 19t-19 45t19 45t45 19t45-19t19-45t-19-45t-45-19M704 512q26 0 45-19t19-45t-19-45t-45-19t-45 19t-19 45t19 45t45 19m512 256q26 0 45-19t19-45t-19-45t-45-19t-45 19t-19 45t19 45t45 19" />
        </svg>
      ),
    },
  ];

  return (
    <div className="relative">
      <Image
        src={logo}
        alt="Logo"
        width={250}
        height={250}
        className="mx-auto my-10"
      />

      <div className="flex justify-end px-0 sm:px-10 md:hidden">
        <button onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={30} /> : <Menu size={30} />}
        </button>
      </div>

      <div
        className={`${
          isOpen ? "block" : "hidden"
        } md:flex flex-col md:flex-row justify-around items-center px-10 bg-white text-[#777777] py-5 rounded-xl shadow-md mt-4 md:mt-0`}
      >
        {navItems.map((item) => (
          <div
            key={item.path}
            onClick={() => {
              router.push(item.path);
              setIsOpen(false);
            }}
            className={`font-bold flex items-center gap-2 cursor-pointer  my-2 md:my-0 ${
              isActive(item.path) ? "text-blue-600" : "text-[#777777]"
            }`}
          >
            {item.icon}
            {item.name}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Navbar;
