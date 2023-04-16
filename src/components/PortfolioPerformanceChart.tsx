import React, { useEffect, useState } from 'react'
import { ArcElement, Tooltip, Legend } from 'chart.js';
import { Chart as ChartJS } from 'chart.js/auto'

import { Line } from 'react-chartjs-2';
import { useNavigate } from 'react-router-dom';
import PortfolioService from '../services/PortfolioService';
import { Segmented } from 'antd';
import { SegmentedValue } from 'antd/es/segmented';
import { logout, useAppDispatch } from '../app/store';

export const PortfolioPerformanceChart: React.FC = () => {
  ChartJS.register(ArcElement, Tooltip, Legend);

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [values, setValues] = useState<any[]>([]);
  const [comparison, setComparison] = useState<any[]>([]);

  const getData = (historyType: string) => {
    PortfolioService.getPortfolioPerformanceHistory(historyType).then((res) => {
      setValues(res.data.map((history: any) => { return { x: history.date, y: history.value } }));
    }).catch((err) => {
      if (err.response.status === 401) {
        dispatch(logout());
        navigate("/");
      }
    });

    PortfolioService.getPortfolioPerformanceComparisonHistory(historyType).then((res) => {
      setComparison(res.data.map((history: any) => { return { x: history.date, y: history.value } }));
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
        label: "Portfolio performance",
        data: values,
        tension: 0.3,
        borderColor: "black",
        pointRadius: 2,
      },
      {
        label: "SPY performance",
        data: comparison,
        tension: 0.3,
        borderColor: "#70a37f",
        pointRadius: 2,
      },
    ],
  };

  return <div>
    <Segmented options={['Weekly', 'Monthly', 'Quarterly', 'All']} onChange={(selectedType: SegmentedValue) => { getData(selectedType.toString().toUpperCase()) }} />
    <div>
      <Line data={data} options={
        {
          maintainAspectRatio: false,
          plugins:
          {
            legend: {
              display: false
            },
          },
          scales: {
            x: {
              display: false
            },
            y: {
              display: false,
              beginAtZero: false
            }
          },
        }
      } />
    </div>
  </div>
}