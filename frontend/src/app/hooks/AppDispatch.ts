import { useDispatch } from "react-redux";
import { AppDispatch } from "../_RTK/redux-store/Redux_store";

const useAppDispatch = () => {
  return useDispatch<AppDispatch>();
};

export default useAppDispatch;
