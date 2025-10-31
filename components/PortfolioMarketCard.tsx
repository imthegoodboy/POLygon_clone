import moment from "moment";
import Img from "next/image";
import React from "react";
import Web3 from "web3";

export interface MarketProps {
  id: string;
  title: string;
  imageHash: string;
  totalAmount: string;
  totalYes: string;
  totalNo: string;
  userYes: string;
  userNo: string;
  hasResolved?: boolean;
  timestamp: string;
  endTimestamp: string;
}

export const PortfolioMarketCard: React.FC<MarketProps> = ({
  title,
  userYes,
  userNo,
  id,
  imageHash,
  totalYes,
  totalNo,
  totalAmount,
  hasResolved,
  timestamp,
  endTimestamp,
}) => {
  const endingOn = moment(parseInt(endTimestamp));
  const now = moment(new Date());
  const daysLeft = moment.duration(endingOn.diff(now)).asDays().toFixed(0);
  const isYes = !!userYes;
  const betAmount = parseFloat(Web3.utils.fromWei(userYes ?? userNo));
  
  return (
    <div className="w-full overflow-hidden my-2">
      <div className="glass-card p-6 hover:scale-[1.02] transition-transform cursor-pointer">
        <div className="flex flex-col md:flex-row md:items-center gap-6">
          <div className="flex items-center space-x-4 flex-1">
            <div className="w-14 h-14 flex-shrink-0">
              <Img
                src={`https://ipfs.infura.io/ipfs/${imageHash}`}
                className="rounded-full ring-2 ring-white/30"
                width={56}
                height={56}
              />
            </div>
            <div className="flex-1">
              <h3 className="text-white font-semibold text-lg mb-1">{title}</h3>
              <div className="flex items-center space-x-3">
                <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                  isYes 
                    ? 'bg-green-500/30 text-green-300 border border-green-400/30' 
                    : 'bg-red-500/30 text-red-300 border border-red-400/30'
                }`}>
                  {isYes ? "YES" : "NO"}
                </div>
                {hasResolved && (
                  <div className="px-3 py-1 rounded-full text-xs font-bold bg-purple-500/30 text-purple-300 border border-purple-400/30">
                    RESOLVED
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 flex-1">
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-3">
              <span className="text-xs text-white/60 uppercase tracking-wider font-medium block mb-1">Amount</span>
              <span className="text-white font-bold text-base block">
                {betAmount.toFixed(2)}
                <span className="text-sm text-white/70 ml-1">POLY</span>
              </span>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-3">
              <span className="text-xs text-white/60 uppercase tracking-wider font-medium block mb-1">Added</span>
              <span className="text-white font-semibold text-sm block">
                {timestamp ? moment(parseInt(timestamp) * 1000).format("MMM D, YYYY") : "N/A"}
              </span>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-3">
              <span className="text-xs text-white/60 uppercase tracking-wider font-medium block mb-1">Ends In</span>
              <span className="text-white font-semibold text-sm block">
                {parseInt(daysLeft) > 0 ? `${daysLeft} days` : "Ended"}
              </span>
            </div>

            <div className="flex items-center justify-end">
              <a 
                href={`/market/${id}`}
                className="bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-3 rounded-full font-semibold text-white hover:scale-105 transition-transform text-sm"
              >
                View
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
