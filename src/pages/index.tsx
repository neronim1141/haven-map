import React from "react";

import type { NextPage } from "next";
import Link from "next/link";
import { toast } from "react-toastify";

const Home: NextPage = () => {
  return (
    <div>
      <Link href="/">
        <a>Index</a>
      </Link>
    </div>
  );
};

export default Home;
