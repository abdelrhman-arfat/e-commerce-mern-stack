import Link from "next/link";
import IfTheUserLogin from "./IfTheUserLogin";

const MainNav = () => {
  return (
    <header className="w-full h-[100px] flex items-center">
      <nav className=" w-[90%] h-full  mx-auto flex items-center justify-between">
        <div>
          <Link
            className="text-xl sm:text-2xl hover:text-neutral-500 duration-300 "
            href={"/"}
          >
            Ecommerce
          </Link>
        </div>
        <div className="flex items-center  gap-3">
          <IfTheUserLogin />
        </div>
      </nav>
    </header>
  );
};

export default MainNav;
