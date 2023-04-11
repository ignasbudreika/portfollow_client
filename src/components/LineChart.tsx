import React, { useEffect, useState } from 'react'
import { ArcElement, Tooltip, Legend } from 'chart.js';
import { Chart as ChartJS } from 'chart.js/auto'

import { Line } from 'react-chartjs-2';
import { useNavigate } from 'react-router-dom';
import PortfolioService from '../services/PortfolioService';
import { Segmented } from 'antd';
import { SegmentedValue } from 'antd/es/segmented';

export const LineChart: React.FC = () => {
    ChartJS.register(ArcElement, Tooltip, Legend);

    const navigate = useNavigate();

    const [values, setValues] = useState<any[]>([]);

    const getData = (historyType: string) => {
      PortfolioService.getPortfolioHistory(historyType).then((res) => {
        if (res.status === 401) {
          navigate("/")
          return;
        }
        setValues(res.data.map((history: any) => { return {x: history.time, y: history.value} }));
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
          label: "portfolio value",
          data: values,
          tension: 0.3,
          borderColor: "black",
          pointRadius: 5,
          steppedLine: true
        },
      ],
    };

    return <div>
      <Segmented options={['Weekly', 'Monthly', 'Quarterly', 'All']} onChange={(selectedType: SegmentedValue) => {getData(selectedType.toString().toUpperCase())}} />
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
            scales:{
              x: {
                display: false
              },
              y: {
                beginAtZero: false
              }
            },
          }
        }/>
      </div>
    </div>
}