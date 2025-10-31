import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { useData } from "../contexts/DataContext";

function Navbar() {
  const router = useRouter();
  const { account, loadWeb3 } = useData();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <nav className="w-full mt-auto max-w-7xl">
        <div className="glass-card px-6 py-4 mb-6">
          <div className="flex flex-row justify-between items-center">
            <Link href="/" passHref>
              <div className="flex items-center space-x-3 cursor-pointer group">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center float-animation">
                  <span className="text-white font-bold text-xl">P</span>
                </div>
                <span className="font-bold text-2xl text-white group-hover:scale-105 transition-transform">
                  Polymarket Pro
                </span>
              </div>
            </Link>
            
            {!router.asPath.includes("/market") &&
              !router.asPath.includes("/admin") && (
                <div className="hidden md:flex flex-row items-center space-x-2 bg-white/10 rounded-full p-1">
                  <TabButton
                    title="Markets"
                    isActive={router.asPath === "/"}
                    url={"/"}
                  />
                  <TabButton
                    title="Portfolio"
                    isActive={router.asPath === "/portfolio"}
                    url={"/portfolio"}
                  />
                </div>
              )}

            <div className="flex items-center space-x-4">
              {account ? (
                <div className="glass-card px-6 py-3 cursor-pointer group hover:scale-105 transition-transform">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full pulse-animation"></div>
                    <span className="text-sm font-semibold text-white">
                      {account.substr(0, 6)}...{account.substr(-4)}
                    </span>
                  </div>
                </div>
              ) : (
                <div
                  className="bg-gradient-to-r from-purple-500 to-pink-500 px-8 py-3 rounded-full cursor-pointer hover:shadow-lg hover:scale-105 transition-all font-semibold text-white"
                  onClick={() => {
                    loadWeb3();
                  }}
                >
                  Connect Wallet
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}

export default Navbar;

const TabButton = ({
  title,
  isActive,
  url,
}: {
  title: string;
  isActive: boolean;
  url: string;
}) => {
  return (
    <Link href={url} passHref>
      <div
        className={`px-6 py-2 rounded-full font-semibold transition-all cursor-pointer ${
          isActive
            ? "bg-white text-purple-600 shadow-lg"
            : "text-white hover:bg-white/20"
        }`}
      >
        <span>{title}</span>
      </div>
    </Link>
  );
};
