import React from "react";

import type { NextPage } from "next";
import Link from "next/link";
import { useSession } from "next-auth/react";

const Home: NextPage = () => {
  const session = useSession();

  return (
    <div className=" mx-auto w-full max-w-lg  p-2">
      <h1 className="text-center text-4xl font-bold">Instuctions</h1>
      <ol className="  m-8 list-decimal space-y-2">
        <li>
          Download Client from{" "}
          <a
            href="https://github.com/Cediner/ArdClient/releases/download/v1unstable/LauncherUnstable.zip"
            rel="noopener noreferrer nofollow"
            className="rounded border-b-2 border-blue-400  tracking-wide  hover:text-blue-500"
          >
            HERE
          </a>
        </li>
        <li>
          Copy link from your{" "}
          {session.data?.user.role ? (
            <Link
              href={`/profile/[name]`}
              as={`/profile/${session.data.user.name}`}
            >
              <a className="rounded border-b-2 border-blue-400  tracking-wide   hover:text-blue-500">
                profile
              </a>
            </Link>
          ) : (
            "profile"
          )}
        </li>
        <li>Go to client</li>
        <li>Go to Options (Shift-O) -{">"} Mapping </li>
        <li>Paste the link into Server URL field</li>
        <li>Click enter</li>
        <li>Check if you have desired options enabled</li>
        <li>
          If you do everything correctly you should see your character on mapper
        </li>
        <li>
          <h2 className="te text-lg font-bold tracking-widest"> Enjoy</h2>
        </li>
      </ol>
    </div>
  );
};

export default Home;
