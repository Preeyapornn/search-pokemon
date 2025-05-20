import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface BarChartProps {
  value: number;
  label: string;
  maxValue?: number;
  width?: number;
  height?: number;
}

const BarChart: React.FC<BarChartProps> = ({
  value,
  label,
  maxValue = 100,
  width = 100,
  height = 20,
}) => {
  const percentage = (value / maxValue) * 100;
  const barColor = percentage > 50 ? "#8DC540" : "#ff6384";
  const data = {
    labels: [label],
    datasets: [
      {
        label: label,
        data: [value],
        backgroundColor: barColor,
        borderWidth: 0,
        barThickness: 20,
      },
      {
        label: "Remaining",
        data: [Math.max(0, maxValue - value)],
        backgroundColor: "#d3d3d3",
        borderWidth: 0,
        barThickness: 20,
      },
    ],
  };

  const options = {
    indexAxis: "y" as const,
    responsive: false,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
    },
    scales: {
      x: {
        stacked: true,
        beginAtZero: true,
        max: maxValue,
        grid: { display: false },
        ticks: { display: false },
        border: { display: false },
        display: false,
      },
      y: {
        stacked: true,
        grid: { display: false },
        border: { display: false },
        ticks: {
          display: true,
          font: {
            size: 14,
            weight: "bold" as const,
          },
          padding: 4,
        },
        display: true,
      },
    },
  };

  return (
    <div className="flex  items-center gap-3 py-2">
      <div style={{ width, height }} className="flex  items-center gap-3">
        <Bar data={data} options={options} />
        <div>{value}</div>
      </div>
    </div>
  );
};

export default BarChart;
