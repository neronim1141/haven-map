import React from "react";
import Image from "next/image";
import type { NextPage } from "next";
import logo from "public/logo.png";
import { useAuth } from "~/contexts/auth";

const Home: NextPage = () => {
  return (
    <div className="flex w-full items-center justify-center p-4">
      <div>
        <h1 className="logo-text bg-gradient-to-r from-gray-300 via-gray-400 to-gray-600 text-center text-4xl font-bold tracking-wider sm:text-6xl">
          HexIndustries
        </h1>
        <div className="-my-4  w-full sm:-my-8">
          <Image alt="HexindustriesLogo" src={logo} priority />
        </div>
      </div>
    </div>
  );
};

export default Home;
