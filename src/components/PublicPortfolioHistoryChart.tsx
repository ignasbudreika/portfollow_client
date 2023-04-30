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
                tension: 0.5,
                borderColor: "#1f1f1f",
                borderWidth: 3,
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
                        display: false,
                    },
                    tooltip: {
                        enabled: false
                    }
                },
                scales: {
                    x: {
                        display: true,
                        type: 'timeseries',
                        time: {
                            round: 'day',
                            tooltipFormat: 'yyyy MM dd',
                            unit: 'week'
                        },
                    },
                    y: {
                        display: true,
                        beginAtZero: false
                    }
                },
            }
        } />
    </div>
}