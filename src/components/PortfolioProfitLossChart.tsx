import type { ScriptableContext } from 'chart.js';
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

export const PortfolioProfitLossChart: React.FC = () => {
  ChartJS.register(ArcElement, Tooltip, Legend);

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [values, setValues] = useState<any[]>([]);
  const [selectedType, setSelectedType] = useState<string>('WEEKLY');

  const getData = (historyType: string) => {
    PortfolioService.getPortfolioProfitLossHistory(historyType).then((res) => {
      setValues(res.data.map((history: any) => { return { x: history.date, y: history.value } }));
    }).catch((err) => {
      if (isAxiosError(err) && err.response && err.response.status === 401) {
        dispatch(logout());
        navigate("/");
      }
    });
  }

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
        label: "P/L",
        data: values,
        tension: 0.3,
        borderColor: "#1f1f1f",
        pointRadius: 2,
        steppedLine: true,
        fill: {
          target: 'origin',
          below: (context: ScriptableContext<"line">) => {
            const ctx = context.chart.ctx; const gradient = ctx.createLinearGradient(0, 200, 0, 0);
            gradient.addColorStop(1, "rgba(255,92,92,0)");
            gradient.addColorStop(0, "rgba(255,92,92,1)");
            return gradient;
          },
          above: (context: ScriptableContext<"line">) => {
            const ctx = context.chart.ctx; const gradient = ctx.createLinearGradient(0, 0, 0, 200);
            gradient.addColorStop(1, "rgba(178,210,164,0)");
            gradient.addColorStop(0, "rgba(178,210,164,1)");
            return gradient;
          },
        }
      },
    ],
  };

  return <Space direction="vertical" size="middle" style={{ display: "flex", padding: "0 0 20px 0" }}>
    <Segmented options={['Weekly', 'Monthly', 'Quarterly', 'All']} onChange={(selectedType: SegmentedValue) => { changeSelectedType(selectedType.toString().toUpperCase()) }} />
    <div>
      <Line
        // @ts-ignore
        data={data}
        options={
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
                  text: 'Change, $'
                },
              }
            },
          }
        } />
    </div>
  </Space>
}