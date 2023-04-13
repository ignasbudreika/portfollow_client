import React, { useEffect, useRef, useState } from 'react'
import { ArcElement, Tooltip } from 'chart.js';
import { Chart as ChartJS } from 'chart.js/auto'

import { Doughnut, getElementAtEvent } from 'react-chartjs-2';
import { useNavigate } from 'react-router-dom';
import PortfolioService from '../services/PortfolioService';
import { logout, useAppDispatch } from '../app/store';
import { Empty } from 'antd';

export const PortfolioDistributionChart: React.FC = () => {
  ChartJS.register(ArcElement, Tooltip);

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
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
        setDistribution(res.data.map((distribution: any) => distribution.value));
        setCategories(res.data.map((distribution: any) => distribution.label));
      }).catch((err) => {
        if (err.response.status === 401) {
          dispatch(logout());
          navigate("/");
        }
      });
    } else if (selectedInvestmentType.length == 0) {
      PortfolioService.getPortfolioDistributionByType(investmentType).then((res) => {
        setSelectedInvestmentType(investmentType);
        setDistribution(res.data.map((distribution: any) => distribution.value));
        setCategories(res.data.map((distribution: any) => distribution.label));
      }).catch((err) => {
        if (err.response.status === 401) {
          dispatch(logout());
          navigate("/");
        }
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
        backgroundColor: ["#70a37f", "#659482", "#598485", "#4d7588", "#476d89", "#41658a", "#474f71", "#4c3957"],
      },
    ],
  };

  // @ts-ignore
  return <div>
    {
      distribution.length === 0 ?
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} /> :
        <Doughnut ref={chartRef} onClick={onSelectedType} data={data} options={
          {
            maintainAspectRatio: false, radius: 90, aspectRatio: 1, plugins:
            {
              legend:
              {
                display: false,
              }
            }
          }
        } />
    }
  </div>
}