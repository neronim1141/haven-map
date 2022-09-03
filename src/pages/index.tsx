import React from "react";

import type { NextPage } from "next";
import Link from "next/link";
import { useSocketIO } from "~/hooks/useSocketIO";

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
