import LinksOfNavbar from "./LinksOfNavbar";

const MainNav = () => {
  const LINKS = [
    { label: "Home", href: "/" },
    // { label: "Products", href: "/products" },
    // { label: "About", href: "/about" },
    // { label: "Contact", href: "/contact" },
    // { label: "Login", href: "/login" },
    { label: "Register", href: "/register" },
    // { label: "Cart", href: "/cart" },
    // { label: "Profile", href: "/profile" },
  ];

  return (
    <header className="w-full h-[100px] flex items-center">
      <nav className=" w-[90%] h-full  mx-auto flex items-center justify-between">
        <h1>Logo</h1>
        <ul className="flex gap-3">
          {LINKS.map((link) => (
            <LinksOfNavbar
              key={"link-" + link.label}
              label={link.label}
              href={link.href}
            />
          ))}
        </ul>
      </nav>
    </header>
  );
};

export default MainNav;
