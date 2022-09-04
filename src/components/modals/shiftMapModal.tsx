import React from "react";
import { trpc } from "utils/trpc";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Dialog } from "@headlessui/react";
import { Button } from "../controls/buttons";
import { Spinner } from "../spinner";

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
    await shift.mutateAsync({
      mapId: data.mapId,
      shiftBy: {
        x: values.x - data.x,
        y: values.y - data.y,
      },
    });
    onClose();
  };
  return (
    <Dialog open={!!data} onClose={onClose}>
      <div className="fixed top-0 left-0 h-screen w-screen flex justify-center items-start p-40 bg-black bg-opacity-50">
        <Dialog.Panel className=" px-4 py-2 flex flex-col rounded-lg bg-neutral-800 divide-y-2  shadow-xl">
          <Dialog.Title className="text-white text-xl font bold py-2">
            Edit Grid {data.x},{data.y} in{" "}
            <span className="text-amber-400 bold">
              {data.name ?? data.mapId}
            </span>
          </Dialog.Title>
          <Dialog.Description as="div" className="py-5  text-lg">
            <h1 className="text-white">Set Tile Coords to:</h1>
            <form onSubmit={handleSubmit(onSubmit)} className="flex gap-1">
              <input
                type="hidden"
                {...register("mapId", { valueAsNumber: true })}
              />
              <div>
                <>
                  <div className="flex gap-1">
                    <input
                      type="number"
                      placeholder="x"
                      className="p-2 rounded"
                      {...register("x", { valueAsNumber: true })}
                    />
                    <input
                      type="number"
                      placeholder="y"
                      className="p-1 rounded"
                      {...register("y", { valueAsNumber: true })}
                    />
                  </div>
                  {errors.x ||
                    (errors.y && (
                      <span
                        role="alert"
                        className="mt-1 text-sm text-red-600 font-bold"
                      >
                        {"you need to set data"}
                      </span>
                    ))}
                </>
              </div>
              <Button type="submit">shift map</Button>
              {shift.isLoading && <Spinner />}
            </form>
          </Dialog.Description>
          <div className="flex pt-2 gap-2">
            <Button onClick={onClose}>Close</Button>
            <Button
              onClick={async () => {
                await wipe.mutateAsync({
                  mapId: data.mapId,
                  x: data.x,
                  y: data.y,
                });
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
