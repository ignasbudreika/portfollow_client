import React, { useEffect, useState } from 'react'
import { ArcElement, Tooltip, Legend } from 'chart.js';
import { Chart as ChartJS } from 'chart.js/auto'

import { Line } from 'react-chartjs-2';
import { useNavigate } from 'react-router-dom';
import PortfolioService from '../services/PortfolioService';
import { Segmented } from 'antd';
import { SegmentedValue } from 'antd/es/segmented';
import { logout, useAppDispatch } from '../app/Store';
import 'chartjs-adapter-date-fns';
import { enGB } from 'date-fns/locale';

export const PortfolioPerformanceChart: React.FC = () => {
  ChartJS.register(ArcElement, Tooltip, Legend);

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [selectedType, setSelectedType] = useState<string>('WEEKLY');
  const [values, setValues] = useState<any[]>([]);
  const [comparison, setComparison] = useState<any[]>([]);

  const getData = async (historyType: string) => {
    const portfolioResponse = await PortfolioService.getPortfolioPerformanceHistory(
      historyType
    ).catch((err) => {
      if (err.response.status === 401) {
        dispatch(logout());
        navigate("/");
      }
    });

    const comparisonResponse =
      await PortfolioService.getPortfolioPerformanceComparisonHistory(
        historyType
      ).catch((err) => {
        if (err.response.status === 401) {
          dispatch(logout());
          navigate("/");
        }
      });

    if (portfolioResponse?.data) {
      setValues(
        portfolioResponse.data.map((history: any) => {
          return { x: history.date, y: history.value };
        })
      );
    }

    if (comparisonResponse?.data)
      setComparison(
        comparisonResponse.data.map((history: any) => {
          return { x: history.date, y: history.value };
        })
      );
  };

  const changeSelectedType = (type: string) => {
    setSelectedType(type);
    getData(type);
  }

  useEffect(() => {
    if (!localStorage.getItem(import.meta.env.VITE_ACCESS_TOKEN_KEY)) {
      navigate("/")
      return;
    }

    getData(selectedType);
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
    <Segmented options={['Weekly', 'Monthly', 'Quarterly', 'All']} onChange={(selectedType: SegmentedValue) => { changeSelectedType(selectedType.toString().toUpperCase()) }} />
    <div>
      <Line
        data={data}
        options={
          {
            animation: false,
            maintainAspectRatio: false,
            plugins:
            {
              legend: {
                display: true,
                onClick: () => { }
              },
            },
            scales: {
              x: {
                display: true,
                type: 'timeseries',
                time: {
                  round: 'day',
                  tooltipFormat: 'yyyy MM dd',
                  unit:
                    selectedType === 'WEEKLY' ?
                      'day' :
                      selectedType === 'MONTHLY' ? 'week' :
                        'month'
                },
                adapters: {
                  date: {
                    locale: enGB
                  }
                }
              },
              y: {
                display: true,
                beginAtZero: false,
                title: {
                  display: true,
                  text: 'Change, %'
                },
              }
            },
          }
        } />
    </div>
  </div>
}