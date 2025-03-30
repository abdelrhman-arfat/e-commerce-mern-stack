import app from "@/app/utils/axios_setting";
import toast from "react-hot-toast";
import { BsPlus } from "react-icons/bs";
const AddToCart = ({
  ifInCart,
  _id,
  refetch,
}: {
  ifInCart: boolean;
  _id: string;
  refetch: () => void;
}) => {
  return (
    <button
      className={` rounded-xl hover:scale-105 duration-300
        ${ifInCart ? "bg-green-500 text-white" : "text-green-500 bg-gray-100 "} 
        `}
      onClick={() => {
        toast.promise(app.post(`/cart/${_id}`), {
          loading: ifInCart ? "Increase count..." : "add to cart...",
          success: (res) => {
            refetch();
            return res.data.message;
          },
          error: (err) => {
            return (
              err.response?.data?.message ||
              "An error occurred while adding to favorites"
            );
          },
        });
      }}
    >
      <BsPlus
        size={"26px"}
      />
    </button>
  );
};

export default AddToCart;
