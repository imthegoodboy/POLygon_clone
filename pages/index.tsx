import Head from "next/head";
import { useCallback, useEffect, useState } from "react";
import { Filter } from "../components/Filter";
import { MarketCard } from "../components/MarketCard";
import Navbar from "../components/Navbar";
import { AIChatbot } from "../components/AIChatbot";
import { useData } from "../contexts/DataContext";
import styles from "../styles/Home.module.css";

export interface MarketProps {
  id: string;
  title: string;
  imageHash: string;
  totalAmount: string;
  totalYes: string;
  totalNo: string;
}

export default function Home() {
  const { polymarket, account, loadWeb3, loading } = useData();
  const [markets, setMarkets] = useState<MarketProps[]>([]);

  const getMarkets = useCallback(async () => {
    try {
      if (!polymarket || !account) return;
      const totalQuestions = await polymarket.methods
        .totalQuestions()
        .call({ from: account });
      const dataArray: MarketProps[] = [];
      for (let i = 0; i < totalQuestions; i++) {
        const data = await polymarket.methods
          .questions(i)
          .call({ from: account });
        dataArray.push({
          id: data.id,
          title: data.question,
          imageHash: data.creatorImageHash,
          totalAmount: data.totalAmount,
          totalYes: data.totalYesAmount,
          totalNo: data.totalNoAmount,
        });
      }
      setMarkets(dataArray);
    } catch (error) {
      console.error(error);
    }
  }, [account, polymarket]);

  useEffect(() => {
    loadWeb3();
  }, []);

  useEffect(() => {
    if (!loading) {
      getMarkets();
    }
  }, [loading, getMarkets]);

  return (
    <div className={styles.container}>
      <Head>
        <title>Polymarket Pro - Decentralized Prediction Markets</title>
        <meta name="description" content="Trade on the outcome of real-world events with blockchain technology" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar />
      <main className="w-full flex flex-col sm:flex-row flex-wrap sm:flex-nowrap py-4 flex-grow max-w-7xl px-4">
        <div className="w-full flex flex-col flex-grow pt-1">
          <div className="glass-card p-8 mb-8">
            <div className="flex items-center gap-3 mb-4">
              <h1 className="text-4xl md:text-5xl font-bold text-white">
                Discover Prediction Markets
              </h1>
              <span className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-bold rounded-full animate-pulse shadow-lg">
                Built with Polygon
              </span>
            </div>
            <p className="text-white/80 text-lg mb-6">
              Trade on the outcome of real-world events. Your knowledge is valuable.
            </p>
            
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-all">
              <div className="text-2xl font-bold text-white">{markets.length}</div>
              <div className="text-white/60 text-sm">Active Markets</div>
            </div>
          </div>
            
            <div className="relative text-gray-400 focus-within:text-gray-300 w-full">
              <span className="absolute inset-y-0 left-0 flex items-center px-5">
                <svg
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  className="w-6 h-6"
                >
                  <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              </span>
              <input
                type="search"
                name="q"
                className="w-full py-4 px-5 text-base text-white bg-white/10 backdrop-blur-sm rounded-full pl-14 focus:outline-none focus:ring-2 focus:ring-purple-400 placeholder-white/50"
                placeholder="Search markets by topic..."
                autoComplete="off"
              />
            </div>
          </div>

          <div className="flex flex-row space-x-3 items-center flex-wrap mt-2 mb-6">
            <Filter
              list={["All", "Crypto", "Football", "Covid 19", "Politics"]}
              activeItem="All"
              category="Category"
              onChange={() => {}}
            />
            <Filter
              list={["Volume", "Newest", "Expiring"]}
              activeItem="Volume"
              category="Sort By"
              onChange={() => {}}
            />
          </div>

          <div className="flex items-center justify-between mb-6">
            <h2 className="font-bold text-2xl text-white">Active Markets</h2>
            <span className="text-white/60">
              {markets.length} {markets.length === 1 ? 'market' : 'markets'} available
            </span>
          </div>

          <div className="flex flex-wrap overflow-hidden sm:-mx-1 md:-mx-2">
            {markets.length === 0 ? (
              <div className="w-full glass-card p-12 text-center">
                <div className="text-white/40 mb-4">
                  <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">No Markets Available</h3>
                <p className="text-white/60">Connect your wallet and create the first market!</p>
              </div>
            ) : (
              markets.map((market) => {
                return (
                  <MarketCard
                    id={market.id}
                    key={market.id}
                    title={market.title}
                    totalAmount={market.totalAmount}
                    totalYes={market.totalYes}
                    totalNo={market.totalNo}
                    imageHash={market.imageHash}
                  />
                );
              })
            )}
          </div>
        </div>
      </main>
      <AIChatbot />
    </div>
  );
}
