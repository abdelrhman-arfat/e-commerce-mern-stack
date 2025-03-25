// layout of work pages

import MainNav from "@/app/_components/navbar/MainNav";

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="w-full">
      <MainNav />
      {children}
    </div>
  );
}
