import React, { useEffect, useState } from 'react'
import { ArcElement, Tooltip, Legend, ScriptableContext } from 'chart.js';
import { Chart as ChartJS } from 'chart.js/auto'

import { Line } from 'react-chartjs-2';
import { useNavigate } from 'react-router-dom';
import PortfolioService from '../services/PortfolioService';
import { Segmented } from 'antd';
import { SegmentedValue } from 'antd/es/segmented';
import { logout, useAppDispatch } from '../app/store';

export const PortfolioProfitLossChart: React.FC = () => {
  ChartJS.register(ArcElement, Tooltip, Legend);

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [values, setValues] = useState<any[]>([]);

  const getData = (historyType: string) => {
    PortfolioService.getPortfolioProfitLossHistory(historyType).then((res) => {
      setValues(res.data.map((history: any) => { return { x: history.date, y: history.value } }));
    }).catch((err) => {
      if (err.response.status === 401) {
        dispatch(logout());
        navigate("/");
      }
    });
  }

  useEffect(() => {
    if (!localStorage.getItem(import.meta.env.VITE_ACCESS_TOKEN_KEY)) {
      navigate("/")
      return;
    }

    getData('WEEKLY');
  }, []);

  const data = {
    datasets: [
      {
        label: "P/L",
        data: values,
        tension: 0.3,
        borderColor: "black",
        pointRadius: 2,
        steppedLine: true,
        fill: {
          target: 'origin',
          below: (context: ScriptableContext<"line">) => {
            const ctx = context.chart.ctx; const gradient = ctx.createLinearGradient(0, 200, 0, 0);
            gradient.addColorStop(1, "rgba(255,0,0,0)");
            gradient.addColorStop(0, "rgba(255,120,120,1)");
            return gradient;
          },
          above: (context: ScriptableContext<"line">) => {
            const ctx = context.chart.ctx; const gradient = ctx.createLinearGradient(0, 0, 0, 200);
            gradient.addColorStop(1, "rgba(120,255,120,0)");
            gradient.addColorStop(0, "rgba(120,255,120,1)");
            return gradient;
          },
        }
      },
    ],
  };

  return <div>
    <Segmented options={['Weekly', 'Monthly', 'Quarterly', 'All']} onChange={(selectedType: SegmentedValue) => { getData(selectedType.toString().toUpperCase()) }} />
    <div>
      <Line data={data} options={
        {
          animation: false,
          maintainAspectRatio: false,
          plugins:
          {
            legend: {
              display: false,
            },
          },
          scales: {
            x: {
              display: true
            },
            y: {
              display: true,
              beginAtZero: false
            }
          },
        }
      } />
    </div>
  </div>
}