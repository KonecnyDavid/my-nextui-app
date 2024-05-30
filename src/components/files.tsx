import { useFieldArray, useForm } from "react-hook-form";
import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/button";

import { Inputs } from "@/pages";

const Files = () => {
  const { control, register } = useForm<Inputs>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "images",
  });

  return (
    <div className="flex flex-col gap-4">
      {fields.map((field, index) => (
        <div key={field.id} className="flex flex-row items-center gap-4">
          <Input
            label="Image URL"
            type="text"
            {...register(`images.${index}.url`)}
          />
          <Button color="danger" onClick={() => remove(index)}>
            Remove
          </Button>
        </div>
      ))}
      <Button color="default" onClick={() => append({ url: "" })}>
        Add image
      </Button>
    </div>
  );
};

export default Files;
