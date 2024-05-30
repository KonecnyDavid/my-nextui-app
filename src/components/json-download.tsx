import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/button";

const schema = z.object({
  tenantId: z.number(),
});

type Inputs = z.infer<typeof schema>;

export default function JsonDownload() {
  const { register, handleSubmit } = useForm<Inputs>({
    defaultValues: {
      tenantId: 0,
    },
  });
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    window.open(
      `https://hw03.blob.core.windows.net/data/${data.tenantId}-data.json`,
      "_blank",
    );
  };

  return (
    <div>
      <h2 className="text-2xl my-4">Download json</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-4">
          <Input label="TenantId" type="number" {...register("tenantId")} />

          <Button color="primary" type="submit">
            Download
          </Button>
        </div>
      </form>
    </div>
  );
}
