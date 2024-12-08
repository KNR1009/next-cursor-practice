'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

type FinancialMetrics = {
  売上高: number;
  売上総利益: number;
  営業利益: number;
  経常利益: number;
  当期純利益: number;
};

export default function FinancialStatementsPage() {
  const metrics: FinancialMetrics = {
    売上高: 840432,
    売上総利益: 59963,
    営業利益: 59963,
    経常利益: 59963,
    当期純利益: 59963,
  };

  const chartData = [
    { year: '2014年度', 売上高: 150000, 売上総利益: 45000, 売上原価: 105000 },
    { year: '2015年度', 売上高: 180000, 売上総利益: 54000, 売上原価: 126000 },
    { year: '2016年度', 売上高: 220000, 売上総利益: 66000, 売上原価: 154000 },
    { year: '2017年度', 売上高: 280000, 売上総利益: 84000, 売上原価: 196000 },
    { year: '2018年度', 売上高: 350000, 売上総利益: 105000, 売上原価: 245000 },
    { year: '2019年度', 売上高: 420000, 売上総利益: 126000, 売上原価: 294000 },
    { year: '2020年度', 売上高: 520000, 売上総利益: 156000, 売上原価: 364000 },
    { year: '2021年度', 売上高: 620000, 売上総利益: 186000, 売上原価: 434000 },
    { year: '2022年度', 売上高: 730000, 売上総利益: 219000, 売上原価: 511000 },
    { year: '2023年度', 売上高: 840432, 売上総利益: 252130, 売上原価: 588302 },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">損益計算書</h1>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* メトリクスカード */}
        <div className="lg:w-1/3 grid grid-cols-1 gap-4">
          <MetricCard
            title="売上高"
            value={metrics.売上高}
            subtitle="着地見込 - 仮テキスト"
            unit="千円"
            companyCount={320}
            yearOverYear={0.00}
          />
          <MetricCard
            title="売上総利益"
            value={metrics.売上総利益}
            subtitle="着地見込 - 仮テキスト"
            unit="千円"
            companyCount={320}
            yearOverYear={0.00}
          />
          <MetricCard
            title="営業利益"
            value={metrics.営業利益}
            subtitle="着地見込 - 仮テキスト"
            unit="千円"
            companyCount={320}
            yearOverYear={0.00}
          />
          <MetricCard
            title="経常利益"
            value={metrics.経常利益}
            subtitle="着地見込 - 仮テキスト"
            unit="千円"
            companyCount={320}
            yearOverYear={0.00}
          />
          <MetricCard
            title="当期純利益"
            value={metrics.当期純利益}
            subtitle="着地見込 - 仮テキスト"
            unit="千円"
            companyCount={320}
            yearOverYear={0.00}
          />
        </div>

        {/* グラフ */}
        <div className="lg:w-2/3 h-[600px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis
                label={{ value: '金額（百万円）', angle: -90, position: 'insideLeft' }}
                tickFormatter={(value) => `${(value / 1000).toLocaleString()}`}
              />
              <Tooltip formatter={(value) => `${(Number(value) / 1000).toLocaleString()}百万円`} />
              <Legend />
              <Bar dataKey="売上高" fill="#0066BE" />
              <Bar dataKey="売上総利益" fill="#00428C" />
              <Bar dataKey="売上原価" fill="#00234B" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

type MetricCardProps = {
  title: string;
  value: number;
  subtitle: string;
  unit: string;
  companyCount: number;
  yearOverYear: number;
};

function MetricCard({ title, value, subtitle, unit, companyCount, yearOverYear }: MetricCardProps) {
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <div className="flex items-start justify-between mb-2">
        <div>
          <h3 className="text-lg font-semibold flex items-center">
            <span className="w-1 h-4 bg-blue-600 mr-2"></span>
            {title}
          </h3>
          <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
        </div>
        <span className="text-sm text-gray-500">合計 {companyCount} 社</span>
      </div>
      <div className="text-2xl font-bold mb-2">
        {value.toLocaleString()} {unit}
      </div>
      <div className="flex justify-between text-sm text-gray-600">
        <span className="flex items-center">
          前年比 <span className="text-green-500 ml-1">↑</span> {yearOverYear}%
        </span>
        <span>1社あたり {(value / companyCount).toLocaleString()} {unit}</span>
      </div>
    </div>
  );
}
