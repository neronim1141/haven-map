import Link from "next/link";

export const NavLink = ({
  href,
  children,
}: {
  href: string;
  children: string;
}) => {
  return (
    <Link href={href}>
      <a className="bg-gray-400 p-1 rounded text-sm font-bold  hover:bg-gray-300 transition-colors">
        {children}
      </a>
    </Link>
  );
};
