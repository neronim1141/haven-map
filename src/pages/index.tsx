import React, { useState } from "react";
import { trpc } from "utils/trpc";

import type { NextPage } from "next";
import Link from "next/link";

const Home: NextPage = () => {
  const [num, setNumber] = useState<number>();
  trpc.useSubscription(["randomNumber", undefined], {
    onNext(n) {
      setNumber(n);
    },
  });
  return (
    <div>
      Here&apos;s a random number from a sub: {num} <br />
      <Link href="/">
        <a>Index</a>
      </Link>
    </div>
  );
};

export default Home;
