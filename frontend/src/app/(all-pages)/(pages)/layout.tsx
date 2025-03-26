// layout of work pages

import MainNav from "@/app/_components/navbar/MainNav";

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="w-full">
      <MainNav />
      <main className="w-[90%] flex-col flex gap-8 mx-auto min-h-screen">
        {children}
      </main>
    </div>
  );
}
