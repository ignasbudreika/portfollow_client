import { useEffect, useRef, useState } from 'react'
import { ArcElement, Tooltip } from 'chart.js';
import { Chart as ChartJS } from 'chart.js/auto'

import { Doughnut, getElementAtEvent } from 'react-chartjs-2';
import { useNavigate } from 'react-router-dom';
import PortfolioService from '../services/PortfolioService';
import { logout, useAppDispatch } from '../app/Store';
import { Empty } from 'antd';

interface Props {
  percentage: boolean;
}

const PortfolioDistributionChart = (props: Props) => {
  ChartJS.register(ArcElement, Tooltip);

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const chartRef = useRef(null);

  const [categories, setCategories] = useState<any[]>([]);
  const [percentage, setPercentage] = useState<any[]>([]);
  const [values, setValues] = useState<any[]>([]);
  const [selectedInvestmentType, setSelectedInvestmentType] = useState<string>('');

  const onReturn = () => {
    setSelectedInvestmentType('');
    getData('');
  }

  const onSelectedType = (event: any) => {
    if (chartRef.current) {
      console.log(getElementAtEvent(chartRef.current, event)[0].index);
      getData(categories[getElementAtEvent(chartRef.current, event)[0].index]);
    }
  }

  const getData = (investmentType: string) => {
    if (investmentType.length == 0) {
      PortfolioService.getPortfolioDistribution().then((res) => {
        setPercentage(res.data.map((distribution: any) => distribution.percentage));
        setValues(res.data.map((distribution: any) => distribution.value));
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
        setPercentage(res.data.map((distribution: any) => distribution.percentage));
        setValues(res.data.map((distribution: any) => distribution.value));
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
        label:
          props.percentage ? 'percentage' : 'invested amount',
        data:
          props.percentage ? percentage : values,
        backgroundColor: ["#70a37f", "#659482", "#598485", "#4d7588", "#476d89", "#41658a", "#474f71", "#4c3957"],
      },
    ],
  };

  return <div>
    {
      values.length === 0 ?
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} /> :
        <Doughnut ref={chartRef} onClick={onSelectedType} data={data} options={
          {
            maintainAspectRatio: false, aspectRatio: 1, plugins: {
              legend:
              {
                display: true,
                position: 'right',
                onClick: () => { },
              }
            }
          }
        } />
    }
  </div>
}

export default PortfolioDistributionChart;