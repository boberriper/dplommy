import React, { useState, useEffect } from 'react';
import { Line, Pie } from 'react-chartjs-2';
import { getAnalytics, exportCSV } from '../api';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Tooltip, Legend);

const Dashboard = () => {
  const [analytics, setAnalytics] = useState({ revenue: [], popular_items: [] });
  const [dateRange, setDateRange] = useState({
    start_date: new Date().toISOString().split('T')[0],
    end_date: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    getAnalytics(dateRange).then((res) => setAnalytics(res.data));
  }, [dateRange]);

  const revenueData = {
    labels: analytics.revenue.map((r) => r.date),
    datasets: [
      {
        label: 'Выручка',
        data: analytics.revenue.map((r) => r.total),
        borderColor: 'rgba(75, 192, 192, 1)',
        fill: false,
      },
    ],
  };

  const popularItemsData = {
    labels: analytics.popular_items.map((item) => item.menu_item__name),
    datasets: [
      {
        data: analytics.popular_items.map((item) => item.total),
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
      },
    ],
  };

  const handleExport = async () => {
    const res = await exportCSV(dateRange);
    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'analytics.csv');
    document.body.appendChild(link);
    link.click();
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl mb-4">Аналитика</h2>
      <div className="mb-4">
        <label>С даты:</label>
        <input
          type="date"
          value={dateRange.start_date}
          onChange={(e) => setDateRange({ ...dateRange, start_date: e.target.value })}
          className="border p-1"
        />
        <label className="ml-4">По дату:</label>
        <input
          type="date"
          value={dateRange.end_date}
          onChange={(e) => setDateRange({ ...dateRange, end_date: e.target.value })}
          className="border p-1"
        />
      </div>
      <button onClick={handleExport} className="bg-blue-500 text-white p-2 mb-4">
        Экспорт в CSV
      </button>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h3>Выручка</h3>
          <Line data={revenueData} />
        </div>
        <div>
          <h3>Популярные блюда</h3>
          <Pie data={popularItemsData} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;