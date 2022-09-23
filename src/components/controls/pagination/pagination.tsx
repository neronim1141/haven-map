import React from "react";
import { HiChevronRight, HiChevronLeft } from "react-icons/hi";
import { Button } from "../buttons";
interface PaginationProps {
  count: number;
  onPageChange: (page: number) => void;
  current: number;
  perPage: number;
}
export const Pagination = (props: PaginationProps) => {
  const pages = Math.ceil(props.count / props.perPage);
  if (props.count <= props.perPage) return null;
  return (
    <div className="flex items-center">
      <Button
        disabled={props.current === 1}
        onClick={() => props.onPageChange(props.current - 1)}
      >
        <HiChevronLeft className="h-5 w-5" />
      </Button>
      <div className="flex items-center gap-1 px-1">
        <Button
          onClick={() => props.onPageChange(1)}
          className={props.current === 1 ? "bg-neutral-500 text-black" : ""}
        >
          1
        </Button>
        {props.current > 3 && <Button disabled>...</Button>}
        {Array.from({ length: pages })
          .map((_, i) => i + 1)
          .filter((i) => {
            if (i === 1) return false;
            if (i <= props.current - 3) return false;
            if (i >= props.current + 3) return false;
            if (i === pages) return false;
            return true;
          })
          .map((i) => (
            <Button
              key={i}
              onClick={() => props.onPageChange(i)}
              className={props.current === i ? "bg-neutral-500 text-black" : ""}
            >
              {i}
            </Button>
          ))}
        {props.current + 3 < pages && <Button disabled>...</Button>}
        <Button
          onClick={() => props.onPageChange(pages)}
          className={props.current === pages ? "bg-neutral-500 text-black" : ""}
        >
          {pages}
        </Button>
      </div>
      <Button
        disabled={props.current === pages}
        onClick={() => props.onPageChange(props.current + 1)}
      >
        <HiChevronRight className="h-5 w-5" />
      </Button>
    </div>
  );
};
