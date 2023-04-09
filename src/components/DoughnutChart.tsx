import React, { useEffect, useRef, useState } from 'react'
import { ArcElement, Tooltip } from 'chart.js';
import { Chart as ChartJS } from 'chart.js/auto'

import { Doughnut, getElementAtEvent } from 'react-chartjs-2';
import { useNavigate } from 'react-router-dom';
import PortfolioService from '../services/PortfolioService';
import { ChartJSOrUndefined } from 'react-chartjs-2/dist/types';
import { Breadcrumb } from 'antd';

export const DoughnutChart: React.FC = () => {
    ChartJS.register(ArcElement, Tooltip);

    const navigate = useNavigate();
    const chartRef = useRef(null);

    const [categories, setCategories] = useState<any[]>([]);
    const [distribution, setDistribution] = useState<any[]>([]);
    const [selectedInvestmentType, setSelectedInvestmentType] = useState<string>('');

    const onReturn = () => {
      setSelectedInvestmentType('');
      getData('');
    }

    const onSelectedType = (event: any) => {
      if (chartRef.current) {
        getData(categories[getElementAtEvent(chartRef.current, event)[0].index]);
      }
    }

    const getData = (investmentType: string) => {
      if (investmentType.length == 0) {
        PortfolioService.getPortfolioDistribution().then((res) => {
          if (res.status === 401) {
            navigate("/")
            return;
          }
          setDistribution(res.data.map((distribution: any) => distribution.value));
          setCategories(res.data.map((distribution: any) => distribution.label));
        });
      } else if (selectedInvestmentType.length == 0) {
        PortfolioService.getPortfolioDistributionByType(investmentType).then((res) => {
          if (res.status === 401) {
            navigate("/")
            return;
          }
          setSelectedInvestmentType(investmentType);
          setDistribution(res.data.map((distribution: any) => distribution.value));
          setCategories(res.data.map((distribution: any) => distribution.label));
        });
      } else {
        onReturn();
      }
    };
    
    useEffect(() => {
      if (!localStorage.getItem(import.meta.env.VITE_ACCESS_TOKEN_KEY)) {
          navigate("/")
          return;
      }

      getData('');
    }, []);

    const data = {
      labels: categories,
      datasets: [
        {
          label: 'invested amount',
          data: distribution,
          backgroundColor: ["#888a88","#989898","#a8a6a7","#bdbabb","#c7c4c5","#ccc9ca","#d1cdce","#dedddd","#eaecec","#dfe0e0"],
        },
      ],
    };

    // @ts-ignore
    return <div>
      <Doughnut ref={chartRef} onClick={onSelectedType} data={data} options={
        { maintainAspectRatio: false, radius: 90, aspectRatio: 1, plugins: 
          { legend:  
            { 
              display: false,
            }
          }
        }
      } />
    </div>
}