import React, { useEffect, useState } from 'react'

import { Line } from 'react-chartjs-2';
import { useNavigate } from 'react-router-dom';
import PortfolioService from '../services/PortfolioService';
import { Segmented } from 'antd';
import { SegmentedValue } from 'antd/es/segmented';
import { logout, useAppDispatch } from '../app/Store';

import { ArcElement, Chart, Legend, ScriptableContext, Tooltip } from 'chart.js';
import 'chartjs-adapter-date-fns';
import { enGB } from 'date-fns/locale';

export const PortfolioValueChart: React.FC = () => {
  Chart.register(ArcElement, Tooltip, Legend);

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [values, setValues] = useState<any[]>([]);
  const [selectedType, setSelectedType] = useState<string>('WEEKLY');

  const getData = (historyType: string) => {
    PortfolioService.getPortfolioValueHistory(historyType).then((res) => {
      setValues(res.data.map((history: any) => {
        return {
          x: history.date,
          y: history.value
        }
      }));
    }).catch((err) => {
      if (err.response.status === 401) {
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
        label: "portfolio value",
        data: values,
        tension: 0.3,
        borderColor: "black",
        pointRadius: 2,
        steppedLine: true,
        fill: true,
        fillColor: (context: ScriptableContext<"line">) => {
          const ctx = context.chart.ctx; const gradient = ctx.createLinearGradient(0, 200, 0, 0);
          gradient.addColorStop(1, "rgba(255,0,0,0)");
          gradient.addColorStop(0, "rgba(255,120,120,1)");
          return gradient;
        },
      },
    ],
  };

  return <div>
    <Segmented
      options={['Weekly', 'Monthly', 'Quarterly', 'All']}
      onChange={(selectedType: SegmentedValue) => {
        changeSelectedType(selectedType.toString().toUpperCase())
      }}
    />
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
                display: false
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
                title: {
                  display: true,
                  text: 'Value, $'
                },
                display: true,
                beginAtZero: false
              }
            },
          }
        }
      />
    </div>
  </div>
}