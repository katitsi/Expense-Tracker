import { useContext, useState } from "react";
import { format, parseISO } from "date-fns";

import DashboardLayout from "../../components/layouts/DashboardLayout";
import Modal from "../../components/Modal";
import EditAccountForm from "../../components/Account/EditAccountForm";
import NewPasswordForm from "../../components/Account/NewPasswordForm";
import CharAvatar from "../../components/Cards/CharAvatar";
import { LuSettings2, LuLock, LuUser, LuMail } from "react-icons/lu";
import { newPasswordSchema } from "../../../../validation/user/update";
import { UserContext } from "../../context/UserContext";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import toast from "react-hot-toast";

const Account = () => {
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openChangePasswordModal, setOpenChangePasswordModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user, updateUser } = useContext(UserContext);

  const handleEditAccount = async (data) => {
    setLoading(true);
    try {
      await axiosInstance.put(API_PATHS.USER.EDIT_ACCOUNT, {
        username: data.username || user?.username,
        fullname: data.fullname || user?.fullname,
        password: data.password,
      });

      updateUser({
        ...user,
        username: data.username || user.username,
        fullname: data.fullname || user.fullname,
      });

      toast.success("Account updated successfully!");
      setOpenEditModal(false);
    } catch (error) {
      toast.error(error.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  const handleNewPassword = async (passwords) => {
    setLoading(true);
    try {
      await axiosInstance.put(API_PATHS.USER.GHANGE_PASS, {
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword,
      });

      toast.success("Password changed successfully!");
    } catch (error) {
      toast.error(error.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout activeMenu="My Account">
      <div className="mt-8 mx-auto">
        <div className="flex justify-center">
          <div className="card w-full max-w-4xl">
            {/* -----Header ------ */}
            <div className="flex flex-col sm:flex-row itmes-start sm:items-center justify-between gap-4 mb-8 pb-5 border-b border-primary-light/15 ">
              <h5 className="text-xl font-semibold text-base">My Account</h5>

              <div className="flex flex-wrap gap-3">
                <button
                  className="btn-secodary flex items-center gap-2"
                  onClick={() => setOpenEditModal(true)}
                >
                  <LuSettings2 className="text-lg" />
                  Edit Account
                </button>

                <button
                  className="btn-secodary flex items-center gap-2"
                  onClick={() => setOpenChangePasswordModal(true)}
                >
                  <LuLock className="text-lg tex" />
                  Change Password
                </button>
              </div>
            </div>
            {/*------- User Info Section ------- */}
            <div className="flex items-center gap-6 mb-8 pb-8 border-b border-primary-light/15">
              <CharAvatar
                fullname={user?.fullname}
                width="w-20"
                height="h-20"
                style="text-xl"
                color={"from-secondary-light to-secondary-dark text-white"}
              />

              <div>
                <p className="text-xl text-gray-800 font-semibold pb-2">
                  {user?.fullname}
                </p>
                <p className="text-lg text-gray-700">{user?.username}</p>
                <p className="text-sm text-gray-500">
                  Member since{" "}
                  {user?.created_at &&
                    format(parseISO(user.created_at), "MMMM yyyy")}
                </p>
              </div>
            </div>
          </div>

          <Modal
            isOpen={openEditModal}
            onClose={() => setOpenEditModal(false)}
            title="Edit Account"
          >
            <EditAccountForm
              onEditAccount={handleEditAccount}
              defaultData={{
                username: user?.username,
                fullname: user?.fullname,
              }}
            />
          </Modal>

          <Modal
            isOpen={openChangePasswordModal}
            onClose={() => setOpenChangePasswordModal(false)}
            title="Change Password"
          >
            <NewPasswordForm
              onChangePassword={handleNewPassword}
              loading={loading}
            />
          </Modal>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Account;
