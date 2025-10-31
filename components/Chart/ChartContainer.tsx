import type { Layout } from "plotly.js";
import React, { useEffect } from "react";
import Web3 from "web3";
import { useData } from "../../contexts/DataContext";

interface Props {
  questionId: string;
}

interface ChartData {
  time: Date[];
  amount: number[];
}

const ChartContainer: React.FC<Props> = ({ questionId }) => {
  const { polymarket } = useData();

  const fetchGraphData = async () => {
    const Plotly = (await import("plotly.js-dist-min")).default;
    var data = await polymarket.methods.getGraphData(questionId).call();
    var yesData: ChartData = {
      time: [],
      amount: [],
    };
    var noData: ChartData = {
      time: [],
      amount: [],
    };
    data["0"].forEach((item: any) => {
      var sum = yesData.amount.reduce((a, b) => a + b, 0);
      yesData.amount.push(
        sum + parseFloat(Web3.utils.fromWei(item[1], "ether"))
      );
      yesData.time.push(new Date(parseInt(item[2] + "000")));
    });
    data["1"].forEach((item: any) => {
      var sum = noData.amount.reduce((a, b) => a + b, 0);
      noData.amount.push(
        sum + parseFloat(Web3.utils.fromWei(item[1], "ether"))
      );
      noData.time.push(new Date(parseInt(item[2] + "000")));
    });

    var yes = {
      x: [...yesData.time],
      y: [...yesData.amount],
      mode: "lines+markers",
      name: "Yes",
    };

    var no = {
      x: [...noData.time],
      y: [...noData.amount],
      mode: "lines+markers",
      name: "No",
    };
    var chartData = [yes, no];

    const layout: Partial<Layout> = {
      title: { text: "YES / NO Graph" },
    };

    Plotly.newPlot("myDiv", chartData, layout, { displayModeBar: false });
  };

  useEffect(() => {
    fetchGraphData();
  });

  return (
    <>
      <div id="myDiv"></div>
    </>
  );
};

export default ChartContainer;
