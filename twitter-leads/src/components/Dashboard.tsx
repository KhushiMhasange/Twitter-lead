import { useState, useCallback } from 'react';
import axios from 'axios';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = ['#00C49F', '#FF8042', '#FFBB28', '#0088FE', '#FF6384', '#36A2EB', '#9966FF'];

interface ChartEntry {
  name: string;
  value: number;
}

export default function AnalyticsChart() {
  const [topicInput, setTopicInput] = useState('');
  const [chartData, setChartData] = useState<ChartEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = useCallback(async () => {
    if (!topicInput.trim()) {
      setError('Enter a topic to analyze');
      return;
    }

    setLoading(true);
    setError(null);
    setChartData([]);

    try {
      const res = await axios.get<ChartEntry[]>(`http://localhost:4000/analytics`, {
        params: { topic: topicInput },
      });

      setChartData(res.data);
    } catch (err: any) {
      console.error('Error fetching analytics:', err);
      setError('Failed to fetch analytics');
    } finally {
      setLoading(false);
    }
  }, [topicInput]);

  return (
    <div className="min-h-screen bg-zinc-900 text-white p-6 font-inter flex flex-col items-center">
      <h1 className="text-3xl font-bold text-teal-400 mb-6">Twitter Analytics Dashboard</h1>

      <div className="w-full max-w-md bg-zinc-800 p-6 rounded-lg shadow-lg flex flex-col gap-4 mb-8">
        <input
          type="text"
          value={topicInput}
          onChange={(e) => setTopicInput(e.target.value)}
          placeholder="Enter topic (e.g., Dev, AI)"
          className="w-full p-3 rounded bg-zinc-700 text-white border border-zinc-600 focus:outline-none focus:border-teal-400"
        />
        <button
          onClick={fetchAnalytics}
          disabled={loading}
          className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded"
        >
          {loading ? 'Analyzing...' : 'Analyze Tweets'}
        </button>
        {error && <p className="text-red-400">{error}</p>}
      </div>

      {chartData.length > 0 && (
        <div className="w-full max-w-2xl bg-zinc-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold text-teal-300 mb-4">Mention Breakdown</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                label
              >
                {chartData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
