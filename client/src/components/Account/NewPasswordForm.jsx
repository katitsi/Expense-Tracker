import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Input from "../Input";
import { newPasswordSchema } from "../../../../validation/user/update";

const NewPasswordForm = ({ onChangePassword, loading }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(newPasswordSchema), mode: "onChange" });

  return (
    <div>
      <Input
        type="password"
        label="Current Password"
        placeholder="Current Password"
        {...register("currentPassword")}
      />
      <div className="text-error text-xs mt-0">
        {errors.currentPassword && <p>{errors.currentPassword.message}</p>}
      </div>

      <Input
        type="password"
        label="New Password"
        placeholder="New Password"
        {...register("newPassword")}
      />
      <div className="text-error text-xs mt-0">
        {errors.newPassword && <p>{errors.newPassword.message}</p>}
      </div>

      <Input
        type="password"
        label="Confirm New Password *"
        placeholder="Confirm Password"
        {...register("confirmPassword")}
      />
      <div className="text-error text-xs mt-0">
        {errors.confirmPassword && <p>{errors.confirmPassword.message}</p>}
      </div>

      <div className="flex justify-end">
        <button
          className="btn-secodary btn-secodary-fill text-xl"
          onClick={handleSubmit(onChangePassword)}
        >
          {loading ? "Changing Password..." : "Change Password"}
        </button>
      </div>
    </div>
  );
};

export default NewPasswordForm;
