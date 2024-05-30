import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/button";
import { Spinner } from "@nextui-org/spinner";
import { useEffect, useState } from "react";

import DefaultLayout from "@/layouts/default";
import Files from "@/components/files";
import JsonDownload from "@/components/json-download";

const schema = z.object({
  name: z.string(),
  description: z.string(),
  type: z.string(),
  gps: z.object({
    lat: z.string(),
    long: z.string(),
  }),
  images: z.array(
    z.object({
      url: z.string(),
    }),
  ),
  tenantId: z.number(),
});

export type Inputs = z.infer<typeof schema>;

export default function IndexPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const { register, handleSubmit } = useForm<Inputs>({
    defaultValues: {
      name: "",
      description: "",
      tenantId: 0,
      type: "",
      gps: {
        lat: "4566",
        long: "4565",
      },
      images: [],
    },
  });
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    setIsSubmitting(true);

    const result = await fetch(
      "https://hw03-create-place.azurewebsites.net/api/upsertplace",
      {
        method: "POST",
        body: JSON.stringify({
          name: data.name,
          description: data.description,
          type: data.type,
          tanantId:
            typeof data.tenantId === "string"
              ? parseInt(data.tenantId)
              : data.tenantId,
          gps: [data.gps.lat, data.gps.long],
          images: data.images.map((image) => image.url),
        }),
      },
    );

    if (result.status === 200) {
      setMessage("Successfully submitted!!");
    }

    setIsSubmitting(false);
  };

  useEffect(() => {
    if (message !== "") {
      const timeout = setTimeout(() => {
        setMessage("");
      }, 5000);

      return () => clearTimeout(timeout);
    }
  }, [message]);

  return (
    <DefaultLayout>
      <h2 className="text-2xl mb-4">Create new place</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-4">
          {message && (
            <div className="border border-primary-700 bg-primary-100 rounded-xl p-4">
              {message}
            </div>
          )}
          <Input label="TenantId" type="number" {...register("tenantId")} />
          <Input label="Name" type="text" {...register("name")} />
          <Input label="Description" type="text" {...register("description")} />
          <Input label="Type" type="text" {...register("type")} />

          <div className="flex flex-row gap-4">
            <Input label="GPS - LAT" type="text" {...register("gps.lat")} />
            <Input label="GPS - LONG" type="text" {...register("gps.long")} />
          </div>
          <Files />
          <Button color="primary" type="submit">
            Submit
          </Button>
          {isSubmitting && <Spinner color="primary" label="Submitting..." />}
        </div>
      </form>
      <JsonDownload />
    </DefaultLayout>
  );
}
