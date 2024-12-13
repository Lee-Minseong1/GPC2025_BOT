const ChartJSNodeCanvas = require('chartjs-node-canvas');
const fs = require('fs');

const createChart = async (data) => {
    const width = 800;
    const height = 600;
    const chartCallback = (ChartJS) => {
        ChartJS.register(require('chart.js').CategoryScale);
    };

    const chartCanvas = new ChartJSNodeCanvas({ width, height, chartCallback });

    const configuration = {
        type: 'bar',
        data: {
            labels: data.map((item) => item.label),
            datasets: [
                {
                    label: 'User Statistics',
                    data: data.map((item) => item.value),
                },
            ],
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
            },
        },
    };

    const image = await chartCanvas.renderToBuffer(configuration);
    fs.writeFileSync('chart.png', image); // chart.png로 저장
};

module.exports = createChart;
