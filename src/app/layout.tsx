import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThirdwebProvider } from "thirdweb/react";
import Image from "next/image";
import walletIcon from "@public/bitcoin.svg";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Account Abstraction examples | thirdweb",
  description: "Account Abstraction examples using the thirdweb Connect SDK",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`bg-[#1e1e1e] text-[#f9f6f1] ${inter.className}`}>
        <ThirdwebProvider>
          <div className="flex flex-col">
            <Header />
            <main className="flex-grow container mx-auto px-4 py-12 bg-[#f9f6f1] text-black shadow-md">
              {children}
            </main>
            <Footer />
          </div>
        </ThirdwebProvider>
      </body>
    </html>
  );
}

function Header() {
  return (
    <header className="bg-[#f9f6f1] text-black shadow-sm py-6">
      <div className="container mx-auto flex justify-between items-center px-4">
        <div className="flex items-center space-x-4">
          <Image
            src={walletIcon}
            alt="Wallet Logo"
            width={60}
            height={60}
          />
          <h1 className="text-xl font-bold tracking-wide">Account Abstraction</h1>
        </div>
        <nav className="space-x-6">
          <MenuItem title="Sponsored" href="/gasless" />
          <MenuItem title="Session keys" href="/session-keys" />
          <MenuItem title="Batching" href="/batching" />
        </nav>
      </div>
    </header>
  );
}

function MenuItem(props: { title: string; href: string }) {
  return (
    <Link
      href={props.href}
      className="text-sm font-medium hover:underline hover:text-[#a726a9] transition"
    >
      {props.title}
    </Link>
  );
}

function Footer() {
  return (
    <footer className="bg-[#f9f6f1] text-black py-6 mt-auto border-t border-gray-300">
      <div className="container mx-auto text-center">
        <Link
          className="text-sm hover:underline"
          target="_blank"
          href="https://github.com/thirdweb-example/account-abstraction"
        >
          View code on GitHub
        </Link>
      </div>
    </footer>
  );
}