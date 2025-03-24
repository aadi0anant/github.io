"use strict";
/**
 File: statistics.ts
 Author: Ritik Sharma(100952840), Brendan Obilo(100952871)
 Date: 2025-03-18
 Description: This is the typescript functionalities to display stats graph and interact with them
 */

interface IStatEach {
    date: string;
    day: string;
    men: number;
    women: number;
}

async function fetchStatistics():Promise<IStatEach[]> {
    const response = await fetch('/data/stats.json');
    const data = await response.json();
    return data.visits.slice(-7); // Get only the last 7 days
}

let chartInstance: any = null;
let pieChartInstance: any = null;

export function DisplayStatisticsPage():void {
    async function renderChart() {
        const stats:IStatEach[] = await fetchStatistics();
        const labels:string[] = stats.map(entry => `${entry.day} (${entry.date})`); // "Mon (2024-03-11)"
        const values:number[] = stats.map(entry => entry.men + entry.women);
        const totalMen = stats.reduce((sum, entry) => sum + entry.men, 0);
        const totalWomen = stats.reduce((sum, entry) => sum + entry.women, 0);
        const chartElement = document.getElementById("visitorChart") as HTMLCanvasElement;
        const pieChartElement = document.getElementById("visitorPieChart") as HTMLCanvasElement;

        // Access Chart.js from the global window object
        const Chart = (window as any).Chart;

        // Destroy existing chart if it exists
        if (chartInstance) {
            chartInstance.destroy();
        }

        if(pieChartInstance) {
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