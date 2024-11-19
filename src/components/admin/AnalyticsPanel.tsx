import React, { useMemo } from 'react';
import { BarChart as BarChartIcon, PieChart, RotateCcw, Calendar } from 'lucide-react';
import { useAnalyticsStore } from '../../store/analyticsStore';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const AnalyticsPanel: React.FC = () => {
  const { data, resetStats } = useAnalyticsStore();

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset all analytics data? This action cannot be undone.')) {
      resetStats();
    }
  };

  // Prepare data for daily activity chart
  const dailyActivityData = useMemo(() => {
    const dates = Object.keys(data.dailyStats).sort();
    const lastSevenDays = dates.slice(-7);

    return {
      labels: lastSevenDays.map(date => new Date(date).toLocaleDateString()),
      datasets: [
        {
          label: 'Photos Taken',
          data: lastSevenDays.map(date => data.dailyStats[date].photosTaken),
          backgroundColor: 'rgba(53, 162, 235, 0.5)',
          borderColor: 'rgb(53, 162, 235)',
          borderWidth: 1
        },
        {
          label: 'Photos Printed',
          data: lastSevenDays.map(date => data.dailyStats[date].photosPrinted),
          backgroundColor: 'rgba(75, 192, 192, 0.5)',
          borderColor: 'rgb(75, 192, 192)',
          borderWidth: 1
        },
        {
          label: 'Photos Emailed',
          data: lastSevenDays.map(date => data.dailyStats[date].photosEmailed),
          backgroundColor: 'rgba(255, 159, 64, 0.5)',
          borderColor: 'rgb(255, 159, 64)',
          borderWidth: 1
        }
      ]
    };
  }, [data.dailyStats]);

  // Prepare data for feature usage pie chart
  const featureUsageData = {
    labels: ['Filters Applied', 'Props Used', 'Retakes', 'QR Codes Scanned'],
    datasets: [
      {
        data: [
          data.filtersApplied,
          data.propsUsed,
          data.retakes,
          data.qrCodesScanned
        ],
        backgroundColor: [
          'rgba(255, 99, 132, 0.5)',
          'rgba(54, 162, 235, 0.5)',
          'rgba(255, 206, 86, 0.5)',
          'rgba(75, 192, 192, 0.5)'
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)'
        ],
        borderWidth: 1
      }
    ]
  };

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold">Total Photos</h3>
            <BarChartIcon className="text-blue-500" size={24} />
          </div>
          <p className="text-3xl font-bold">{data.photosTaken}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold">Prints</h3>
            <PieChart className="text-green-500" size={24} />
          </div>
          <p className="text-3xl font-bold">{data.photosPrinted}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold">Shares</h3>
            <PieChart className="text-purple-500" size={24} />
          </div>
          <p className="text-3xl font-bold">{data.photosShared}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold">Emails</h3>
            <PieChart className="text-orange-500" size={24} />
          </div>
          <p className="text-3xl font-bold">{data.photosEmailed}</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Activity Chart */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Daily Activity</h3>
            <Calendar className="text-blue-500" size={24} />
          </div>
          <div className="h-[300px]">
            <Bar
              data={dailyActivityData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'top' as const
                  },
                  title: {
                    display: false
                  }
                }
              }}
            />
          </div>
        </div>

        {/* Feature Usage Chart */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Feature Usage</h3>
            <PieChart className="text-purple-500" size={24} />
          </div>
          <div className="h-[300px] flex items-center justify-center">
            <Pie
              data={featureUsageData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'right' as const
                  }
                }
              }}
            />
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Recent Activity</h3>
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
          >
            <RotateCcw size={20} />
            Reset Stats
          </button>
        </div>
        <div className="max-h-[300px] overflow-y-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left">Time</th>
                <th className="px-4 py-2 text-left">Action</th>
                <th className="px-4 py-2 text-left">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {data.history.slice(0, 50).map((event, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-4 py-2 text-sm text-gray-500">
                    {new Date(event.timestamp).toLocaleString()}
                  </td>
                  <td className="px-4 py-2">
                    <span className="capitalize">{event.type}</span>
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-500">
                    {event.details || '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPanel;