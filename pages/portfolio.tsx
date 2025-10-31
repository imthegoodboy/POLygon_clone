import Head from "next/head";
import Link from "next/link";
import React, { useCallback, useEffect, useState } from "react";
import Web3 from "web3";
import Navbar from "../components/Navbar";
import { PortfolioMarketCard } from "../components/PortfolioMarketCard";
import { AIChatbot } from "../components/AIChatbot";
import { useData } from "../contexts/DataContext";
import styles from "../styles/Home.module.css";

export interface MarketProps {
  id: string;
  title?: string;
  imageHash?: string;
  totalAmount?: string;
  totalYes?: string;
  totalNo?: string;
  userYes?: string;
  hasResolved?: boolean;
  userNo?: string;
  timestamp?: string;
  endTimestamp?: string;
}

export interface QuestionsProps {
  id: string;
  title?: string;
  imageHash?: string;
  totalAmount?: string;
  totalYes?: string;
  totalNo?: string;
  hasResolved?: boolean;
  endTimestamp?: string;
}

const Portfolio = () => {
  const { polymarket, account, loadWeb3, loading } = useData();
  const [markets, setMarkets] = useState<MarketProps[]>([]);
  const [portfolioValue, setPortfolioValue] = useState<number>(0);
  const [allQuestions, setAllQuestions] = useState<QuestionsProps[]>([]);
  const [openPositions, setOpenPositions] = useState<number>(0);

  const getMarkets = useCallback(async () => {
    var totalQuestions = await polymarket.methods
      .totalQuestions()
      .call({ from: account });
    for (var i = 0; i < totalQuestions; i++) {
      var questions = await polymarket.methods
        .questions(i)
        .call({ from: account });
      allQuestions.push({
        id: questions.id,
        title: questions.question,
        imageHash: questions.creatorImageHash,
        totalAmount: questions.totalAmount,
        totalYes: questions.totalYesAmount,
        totalNo: questions.totalNoAmount,
        hasResolved: questions.eventCompleted,
        endTimestamp: questions.endTimestamp,
      });
    }

    var dataArray: MarketProps[] = [];
    var totalPortValue = 0;
    for (var i = 0; i < totalQuestions; i++) {
      var data = await polymarket.methods
        .getGraphData(i)
        .call({ from: account });
      data["0"].forEach((item: any) => {
        if (item[0] == account) {
          dataArray.push({
            id: i.toString(),
            userYes: item[1].toString(),
            timestamp: item[2].toString(),
          });
          totalPortValue += parseInt(item[1]);
        }
      });
      data["1"].forEach((item: any) => {
        if (item[0] == account) {
          dataArray.push({
            id: i.toString(),
            userNo: item[1].toString(),
            timestamp: item[2].toString(),
          });
          totalPortValue += parseInt(item[1]);
        }
      });
    }
    setPortfolioValue(totalPortValue);
    for (var i = 0; i < dataArray.length; i++) {
      var question = allQuestions.find((item) => item.id == dataArray[i].id);
      dataArray[i].title = question!.title;
      dataArray[i].imageHash = question!.imageHash;
      dataArray[i].totalAmount = question!.totalAmount;
      dataArray[i].totalYes = question!.totalYes;
      dataArray[i].totalNo = question!.totalNo!;
      dataArray[i].hasResolved = question!.hasResolved;
      dataArray[i].endTimestamp = question!.endTimestamp;
    }
    setMarkets(dataArray);
  }, [account, polymarket]);

  useEffect(() => {
    loadWeb3().then(() => {
      if (!loading) {
        getMarkets();
      }
    });
  }, [loading]);

  return (
    <div className={styles.container}>
      <Head>
        <title>Portfolio - Polymarket Pro</title>
        <meta name="description" content="Manage your prediction market positions" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar />
      <main className="w-full flex flex-col sm:flex-row flex-wrap sm:flex-nowrap py-4 flex-grow max-w-7xl px-4">
        <div className="w-full flex flex-col pt-1">
          <div className="glass-card p-8 mb-8">
            <h1 className="text-4xl font-bold text-white mb-6">Your Portfolio</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="bg-gradient-to-br from-purple-500/30 to-pink-500/30 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-white/70 text-sm uppercase tracking-wider font-semibold">Total Value</h3>
                  <svg className="w-8 h-8 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-white text-3xl font-bold">
                  {parseFloat(Web3.utils.fromWei(portfolioValue.toString())).toFixed(2)}
                  <span className="text-lg text-white/70 ml-2">POLY</span>
                </p>
              </div>

              <div className="bg-gradient-to-br from-green-500/30 to-emerald-500/30 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-white/70 text-sm uppercase tracking-wider font-semibold">Active Positions</h3>
                  <svg className="w-8 h-8 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <p className="text-white text-3xl font-bold">{markets.length}</p>
              </div>

              <div className="bg-gradient-to-br from-blue-500/30 to-cyan-500/30 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-white/70 text-sm uppercase tracking-wider font-semibold">Markets</h3>
                  <svg className="w-8 h-8 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <p className="text-white text-3xl font-bold">{allQuestions.length}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between mb-6">
            <h2 className="font-bold text-2xl text-white">Your Positions</h2>
            {markets.length === 0 && (
              <span className="text-white/60">No positions yet</span>
            )}
          </div>

          {markets.length === 0 ? (
            <div className="glass-card p-12 text-center">
              <div className="text-white/40 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">No Active Positions</h3>
              <p className="text-white/60 mb-4">Start trading on markets to see your positions here!</p>
              <Link href="/" className="inline-block bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-3 rounded-full font-semibold text-white hover:scale-105 transition-transform">
                Browse Markets
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {markets.map((market) => (
                <PortfolioMarketCard
                  id={market.id}
                  title={market.title!}
                  imageHash={market.imageHash!}
                  totalAmount={market.totalAmount!}
                  totalYes={market.totalYes!}
                  totalNo={market.totalNo!}
                  userYes={market.userYes!}
                  userNo={market.userNo!}
                  key={market.id!}
                  hasResolved={market.hasResolved!}
                  timestamp={market.timestamp!}
                  endTimestamp={market.endTimestamp!}
                />
              ))}
            </div>
          )}
        </div>
      </main>
      <AIChatbot />
    </div>
  );
};

export default Portfolio;
