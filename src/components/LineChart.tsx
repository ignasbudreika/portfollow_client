import React, { useEffect, useState } from 'react'
import { ArcElement, Tooltip, Legend } from 'chart.js';
import { Chart as ChartJS } from 'chart.js/auto'

import { Line } from 'react-chartjs-2';
import { useNavigate } from 'react-router-dom';
import PortfolioService from '../services/PortfolioService';

export const LineChart: React.FC = () => {
    ChartJS.register(ArcElement, Tooltip, Legend);

    const navigate = useNavigate();

    const [values, setValues] = useState<any[]>([]);

    const getData = () => {
      PortfolioService.getPortfolioHistory().then((res) => {
          setValues(res.data.map((history: any) => { return {x: history.time, y: history.value} }));
      });
    }

    useEffect(() => {
      if (!localStorage.getItem(import.meta.env.VITE_ACCESS_TOKEN_KEY)) {
        navigate("/")
        return;
      }

      getData();
  }, []);

    const data = {
      datasets: [
        {
          label: "portfolio value",
          data: values,
          tension: 0.1,
          borderColor: "black",
        },
      ],
    };

    return <Line data={data} options={
      { 
        maintainAspectRatio: false, plugins: 
          { legend:  
              { display: false } 
          },
          scales:{
            x: {
                display: false
            },
            y: {
              display: false
          }
        }
      }
  } />;
}