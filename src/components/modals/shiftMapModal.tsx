import React from "react";
import { trpc } from "utils/trpc";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Dialog } from "@headlessui/react";
import { Button } from "../controls/buttons";
import { toast } from "react-toastify";

const schema = z.object({
  mapId: z.number(),
  x: z.number(),
  y: z.number(),
});
type ShiftMapSchema = z.infer<typeof schema>;

interface ModalProps<T extends any = any> {
  data: T;
  onClose: () => void;
}
export const EditGridModal = ({
  data,
  onClose,
}: ModalProps<{
  mapId: number;
  name?: string;
  x: number;
  y: number;
}>) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ShiftMapSchema>({
    resolver: zodResolver(schema),
    defaultValues: {
      mapId: data.mapId,
      x: data.x,
      y: data.y,
    },
  });
  const shift = trpc.useMutation("map.shiftZooms");
  const wipe = trpc.useMutation("map.wipeTile");

  const onSubmit = async (values: ShiftMapSchema) => {
    await toast.promise(
      shift.mutateAsync({
        mapId: data.mapId,
        shiftBy: {
          x: values.x - data.x,
          y: values.y - data.y,
        },
      }),
      {
        pending: "Shifting in progress",
        success: "Shifting sucessfull",
        error: {
          render({ data }) {
            return data.message;
          },
        },
      }
    );

    onClose();
  };
  return (
    <Dialog open={!!data} onClose={onClose}>
      <div className="fixed top-0 left-0 flex h-screen w-screen items-center justify-center bg-black bg-opacity-50 p-4  ">
        <Dialog.Panel className=" flex max-w-full flex-col divide-y-2 rounded-lg bg-neutral-800 px-4  py-2  shadow-xl">
          <Dialog.Title className="font bold py-2 text-xl text-white">
            Edit Grid {data.x},{data.y} in{" "}
            <span className="bold text-amber-400">
              {data.name ?? data.mapId}
            </span>
          </Dialog.Title>
          <Dialog.Description as="div" className="py-5 text-lg">
            <h1 className="text-white">Set Tile Coords to:</h1>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-wrap gap-1"
            >
              <input
                type="hidden"
                {...register("mapId", { valueAsNumber: true })}
              />
              <div>
                <>
                  <div className="flex flex-wrap  gap-1">
                    <div className="flex w-fit items-center gap-1">
                      <label className="text-white">X:</label>
                      <input
                        type="number"
                        placeholder="x"
                        className="w-full rounded p-2"
                        {...register("x", { valueAsNumber: true })}
                      />
                    </div>
                    <div className="flex w-fit items-center gap-1 ">
                      <label className="text-white">Y:</label>
                      <input
                        type="number"
                        placeholder="y"
                        className="w-full rounded p-2"
                        {...register("y", { valueAsNumber: true })}
                      />
                    </div>
                    <Button type="submit">shift map</Button>
                  </div>
                  {errors.x ||
                    (errors.y && (
                      <span
                        role="alert"
                        className="mt-1 text-sm font-bold text-red-600"
                      >
                        {"you need to set data"}
                      </span>
                    ))}
                </>
              </div>
            </form>
          </Dialog.Description>
          <div className="flex flex-wrap gap-2 pt-2">
            <Button onClick={onClose}>Close</Button>
            <Button
              onClick={async () => {
                await toast.promise(
                  wipe.mutateAsync({
                    mapId: data.mapId,
                    x: data.x,
                    y: data.y,
                  }),
                  {
                    pending: "Wiping in progress",
                    success: "Wiping sucessfull",
                    error: {
                      render({ data }) {
                        return data.message;
                      },
                    },
                  }
                );
              }}
              variant="danger"
            >
              WipeTile
            </Button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};
