import { useSelector } from "react-redux";
import { RootState } from "../_RTK/redux-store/Redux_store";

const useUserSelector = () => {
  return useSelector((state: RootState) => state.auth);
};
export default useUserSelector;
