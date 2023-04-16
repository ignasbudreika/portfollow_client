import { ArcElement, Tooltip, Legend } from 'chart.js';
import { Chart as ChartJS } from 'chart.js/auto'

import { Line } from 'react-chartjs-2';

interface Props {
    values: any[]
}

export const PublicPortfolioHistoryChart = (props: Props) => {
    ChartJS.register(ArcElement, Tooltip, Legend);

    const data = {
        datasets: [
            {
                data: props.values,
                tension: 0.3,
                borderColor: "black",
                pointRadius: 0,
                steppedLine: true
            },
        ],
    };

    return <div>
        <Line data={data} options={
            {
                animation: false,
                aspectRatio: 3,
                maintainAspectRatio: false,
                plugins:
                {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        enabled: false
                    }
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
}