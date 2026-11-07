import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Input from "../Input";
import { editAccountSchema } from "../../../../validation/user/update.js";
import { useEffect } from "react";

const EditAccountForm = ({ onEditAccount, defaultData }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ resolver: zodResolver(editAccountSchema), mode: "onSubmit" });

  useEffect(() => {
    if (defaultData)
      reset({
        username: defaultData.username,
        fullname: defaultData.fullname,
      });
  }, [defaultData, reset]);

  return (
    <div>
      <form onSubmit={handleSubmit(onEditAccount)}>
        <Input
          type="text"
          {...register("username")}
          label="Change your username"
          placeholder="Username"
        />
        <div className="text-error text-xs mt-0">
          {errors.username && <p>{errors.username.message}</p>}
        </div>

        <Input
          type="text"
          {...register("fullname")}
          label="Change your name"
          placeholder="Your name"
        />
        <div className="text-error text-xs mt-0">
          {errors.fullname && <p>{errors.fullname.message}</p>}
        </div>

        <Input
          type="password"
          {...register("password")}
          label="Input your password *"
          placeholder="Password"
        />
        <div className="text-error text-xs mt-0">
          {errors.password && <p>{errors.password.message}</p>}
        </div>

        <div className="flex justify-end mt-8">
          <button
            type="submit"
            className="btn-secodary btn-secodary-fill text-xl"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};
export default EditAccountForm;
