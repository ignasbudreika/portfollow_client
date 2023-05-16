import { ArcElement, Legend, Tooltip } from 'chart.js';
import { Chart as ChartJS } from 'chart.js/auto';
import React, { useEffect, useState } from 'react';

import { Segmented, Space } from 'antd';
import type { SegmentedValue } from 'antd/es/segmented';
import { isAxiosError } from 'axios';
import 'chartjs-adapter-date-fns';
import { enGB } from 'date-fns/locale';
import { Line } from 'react-chartjs-2';
import { useNavigate } from 'react-router-dom';
import { logout, useAppDispatch } from '../app/store';
import PortfolioService from '../services/PortfolioService';

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
      if (isAxiosError(err) && err.response && err.response.status === 401) {
        dispatch(logout());
        navigate("/");
      }
    });

    const comparisonResponse =
      await PortfolioService.getPortfolioPerformanceComparisonHistory(
        historyType
      ).catch((err) => {
        if (isAxiosError(err) && err.response && err.response.status === 401) {
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
    void getData(type);
  }

  useEffect(() => {
    if (!localStorage.getItem(import.meta.env.VITE_ACCESS_TOKEN_KEY)) {
      navigate("/")
      return;
    }

    void getData(selectedType);
  }, []);

  const data = {
    datasets: [
      {
        label: "Portfolio performance",
        data: values,
        tension: 0.3,
        borderColor: "#1f1f1f",
        pointRadius: 2,
      },
      {
        label: "SPY performance",
        data: comparison,
        tension: 0.3,
        borderColor: "#3f6600",
        pointRadius: 2,
      },
    ],
  };

  return <Space direction="vertical" size="middle" style={{ display: "flex", padding: "0 0 20px 0" }}>
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
  </Space>
}