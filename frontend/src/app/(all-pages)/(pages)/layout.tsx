// layout of work pages

import Footer from "@/app/_components/navbar/Footer";
import MainNav from "@/app/_components/navbar/MainNav";

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="w-full">
      <MainNav />
      <main className="w-[90%] py-10 flex-col flex gap-8 mx-auto min-h-screen">
        {children}
      </main>
      <footer className="w-[90%] py-5 flex-col flex gap-8 mx-auto ">
        <Footer />
      </footer>
    </div>
  );
}
