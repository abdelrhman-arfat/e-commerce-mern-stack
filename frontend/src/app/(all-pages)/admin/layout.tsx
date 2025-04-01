import AdminNavBar from "@/app/_components/navbar/AdminNavBar";

// layout of admin workspace:
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <AdminNavBar />
      <main className="w-[99%] mx-auto py-10">{children}</main>;
    </>
  );
}
