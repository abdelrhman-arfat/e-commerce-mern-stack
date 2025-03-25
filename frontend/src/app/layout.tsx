import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import AppProvider from "./_RTK/provider/AppProvider";

const roboto = Roboto({ subsets: ["latin"], weight: "400" });

export const metadata: Metadata = {
  title: "Full stack E-commerce",
  description:
    "E-commerce website built with MERN stack, providing a medium-scale platform with admin functions, A feature-rich MERN stack e-commerce website with admin functionalities.",
  authors: [
    {
      name: "abdo yasser",
      url: "https://github.com/abdelrhman-arfat/e-commerce-mern-stack",
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${roboto.className} antialiased`}>
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
