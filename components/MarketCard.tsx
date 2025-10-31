import Img from "next/image";
import Link from "next/link";
import React from "react";
import Web3 from "web3";
import { MarketProps } from "../pages";

export const MarketCard: React.FC<MarketProps> = ({
  id,
  title,
  totalAmount,
  totalYes,
  totalNo,
  imageHash,
}) => {
  const yesAmount = parseFloat(Web3.utils.fromWei(totalYes, "ether"));
  const noAmount = parseFloat(Web3.utils.fromWei(totalNo, "ether"));
  const total = yesAmount + noAmount;
  const yesPercentage = total > 0 ? ((yesAmount / total) * 100).toFixed(0) : 50;
  const noPercentage = total > 0 ? ((noAmount / total) * 100).toFixed(0) : 50;

  return (
    <div className="w-full overflow-hidden sm:my-1 sm:px-1 sm:w-1/2 md:my-2 md:px-2 md:w-1/2 lg:w-1/3 xl:w-1/3 my-2">
      <Link href={`/market/${id}`} passHref>
        <div className="glass-card p-6 cursor-pointer group h-full flex flex-col">
          <div className="flex flex-row space-x-4 pb-6">
            <div className="w-14 h-14 flex-shrink-0">
              <Img
                src={`https://ipfs.infura.io/ipfs/${imageHash}`}
                className="rounded-full ring-2 ring-white/30 group-hover:ring-white/50 transition-all"
                width={56}
                height={56}
              />
            </div>
            <h3 className="text-white font-semibold text-base leading-tight flex-1 line-clamp-3 group-hover:text-purple-200 transition-colors">
              {title}
            </h3>
          </div>

          <div className="mt-auto space-y-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <span className="text-xs text-white/60 uppercase tracking-wider font-medium">Volume</span>
              </div>
              <span className="text-white font-bold text-lg">
                {parseFloat(Web3.utils.fromWei(totalAmount, "ether")).toFixed(2)}
                <span className="text-sm text-white/70 ml-1">POLY</span>
              </span>
            </div>

            <div className="h-3 bg-white/10 rounded-full overflow-hidden flex">
              <div 
                className="bg-gradient-to-r from-green-400 to-green-500 transition-all duration-500"
                style={{ width: `${yesPercentage}%` }}
              />
              <div 
                className="bg-gradient-to-r from-red-400 to-red-500 transition-all duration-500"
                style={{ width: `${noPercentage}%` }}
              />
            </div>

            <div className="flex flex-row justify-between items-center gap-3">
              <div className="flex-1 bg-green-500/20 backdrop-blur-sm rounded-lg p-3 border border-green-400/30">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-green-300 font-semibold uppercase">Yes</span>
                  <span className="text-lg font-bold text-green-400">{yesPercentage}%</span>
                </div>
                <span className="text-xs text-white/70 mt-1 block">
                  {yesAmount.toFixed(2)} POLY
                </span>
              </div>
              <div className="flex-1 bg-red-500/20 backdrop-blur-sm rounded-lg p-3 border border-red-400/30">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-red-300 font-semibold uppercase">No</span>
                  <span className="text-lg font-bold text-red-400">{noPercentage}%</span>
                </div>
                <span className="text-xs text-white/70 mt-1 block">
                  {noAmount.toFixed(2)} POLY
                </span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};
