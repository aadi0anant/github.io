"use strict";
async function fetchStatistics() {
    const response = await fetch('/data/stats.json');
    const data = await response.json();
    return data.visits.slice(-7); // Get only the last 7 days
}
let chartInstance = null;
let pieChartInstance = null;
export function DisplayStatisticsPage() {
    async function renderChart() {
        const stats = await fetchStatistics();
        const labels = stats.map(entry => `${entry.day} (${entry.date})`); // "Mon (2024-03-11)"
        const values = stats.map(entry => entry.men + entry.women);
        const totalMen = stats.reduce((sum, entry) => sum + entry.men, 0);
        const totalWomen = stats.reduce((sum, entry) => sum + entry.women, 0);
        const chartElement = document.getElementById("visitorChart");
        const pieChartElement = document.getElementById("visitorPieChart");
        // Access Chart.js from the global window object
        const Chart = window.Chart;
        // Destroy existing chart if it exists
        if (chartInstance) {
            chartInstance.destroy();
        }
        if (pieChartInstance) {
            pieChartInstance.destroy();
        }
        // Create new chart instance and store reference
        chartInstance = new Chart(chartElement, {
            type: "line",
            data: {
                labels,
                datasets: [{
                        label: "Visitors in Last 7 Days",
                        data: values,
                        backgroundColor: "rgba(54, 162, 235, 0.6)",
                        borderColor: "blue",
                        borderWidth: 1
                    }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: { beginAtZero: true }
                }
            }
        });
        // Create new chart instance and store reference
        pieChartInstance = new Chart(pieChartElement, {
            type: 'pie',
            data: {
                labels: ["Men", "Women"],
                datasets: [{
                        label: "Gender Distribution",
                        data: [totalMen, totalWomen],
                        backgroundColor: ["#ADD8E6", "pink"],
                    }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
            }
        });
    }
    renderChart().then().catch(console.error);
}
//# sourceMappingURL=statistics.js.map