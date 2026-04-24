import { TriangleAlert, CircleAlert } from "lucide-react";
import axios from "axios";
import { useContext } from "react";
import { UserContext } from "../../Components/context/User.context";

export default function DeleteUser({ user, onClose }) {
  const { token } = useContext(UserContext);

  async function handleDelete() {
    try {
     const roleApi =
     user.role.toLowerCase().includes("doctor") ? "Doctor" : "Patient";

      const id = user.id;

      const options = {
        url: `https://her-journey-669913381811.us-central1.run.app/api/Admin/Delete${roleApi}/${id}`,
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      };

      await axios.request(options);
      console.log({
      role: user.role,
      id: user.id,
});

      onClose(true); 
    } catch (error) {
      console.error(error);
      onClose(false); 
    }
  }

  return (
    <>
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 p-4 px-6">
        <div className="bg-white rounded-2xl shadow-[0px_2px_4px_#00000012] w-full max-w-xl px-6 py-6">

          <div className="flex items-center flex-col gap-4 m-4">
            <div className="w-16 h-16 bg-red-200/50 rounded-full flex items-center justify-center">
              <TriangleAlert size={32} className="text-red-700 font-bold" />
            </div>

            <div>
              <h1 className="text-[#2C3E2FFF] font-bold text-[28px]">
                Confirm Deletion
              </h1>
            </div>

            <div>
              <p className="text-[#7A8F7CFF] text-[16px]">
                Are you sure you want to delete{" "}
                <span className="font-bold text-[#2C3E2FFF]">
                  {user.name}
                </span>
                ? This action will permanently remove her medical records,
                appointments, and predictions.
              </p>
            </div>
          </div>

          <div className="bg-[#FFFBEBFF] border border-[#FDE68AFF] rounded-lg p-4 flex gap-3 mt-6 items-center">
            <CircleAlert size={30} className="text-[#D97706FF]" />
            <p className="text-[#92400EFF] text-md">
              <span className="font-bold">Warning:</span> This operation cannot be undone.
            </p>
          </div>

          <div className="flex w-full gap-3 mt-6">
            <button
              className="border w-[50%] px-4 py-2 rounded-lg"
              onClick={() => onClose(false)}
            >
              Cancel
            </button>

            <button
              className="bg-red-800 w-[50%] text-white px-4 py-2 rounded-lg"
              onClick={handleDelete}
            >
              Delete User
            </button>
          </div>

        </div>
      </div>
    </>
  );
}