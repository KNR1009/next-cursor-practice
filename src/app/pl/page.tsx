'use client';

import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// 目のアイコンコンポーネント（インライン定義）
const EyeIcon = ({ visible, onClick }: { visible: boolean; onClick: () => void }) => (
  <button onClick={onClick} className="p-1 hover:bg-gray-100 rounded">
    {visible ? (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
      </svg>
    ) : (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
      </svg>
    )}
  </button>
);

type FinancialMetrics = {
  売上高: number;
  売上総利益: number;
  営業利益: number;
  経常利益: number;
  当期純利益: number;
};

export default function FinancialStatementsPage() {
  const [startYear, setStartYear] = useState(2019);
  const [endYear, setEndYear] = useState(2028);
  const [showPercentages, setShowPercentages] = useState({
    売上高: true,
    売上原価: true,
    販管費: true
  });
  const [percentageValues, setPercentageValues] = useState({
    売上高: Array(10).fill(100),
    売上原価: Array(10).fill(70),
    販管費: Array(10).fill(20)
  });

  // 売上高のベース値
  const baseRevenue = 840432;

  // 各年度の売上高を計算（2019-2023は実績値、2024-2028は計画値）
  const calculateRevenue = (year: number, index: number) => {
    if (year <= 2023) {
      return baseRevenue * (0.7 + (index * 0.1)); // 実績値は徐々に増加
    } else {
      return baseRevenue * (percentageValues.売上高[index] / 100); // 計画値は入力された割合で計算
    }
  };

  const metrics: FinancialMetrics = {
    売上高: 840432,
    売上総利益: 252130,
    営業利益: 168086,
    経常利益: 168086,
    当期純利益: 115980,
  };

  const chartData = Array.from({ length: 10 }, (_, i) => {
    const year = 2019 + i;
    const revenue = calculateRevenue(year, i);
    const costRatio = year <= 2023 ? 0.7 : percentageValues.売上原価[i] / 100;
    const cost = revenue * costRatio;
    const grossProfit = revenue - cost;

    return {
      year: `${year}年度`,
      売上高: revenue,
      売上総利益: grossProfit,
      売上原価: cost
    };
  });

  // 計画値の変更行コンポーネント
  const PlanValueRow = ({
    title,
    showPercentage,
    onToggle,
    values,
    onValueChange
  }: {
    title: string;
    showPercentage: boolean;
    onToggle: () => void;
    values: number[];
    onValueChange: (index: number, value: number) => void;
  }) => (
    <tr className="bg-[#F4FAF7]">
      <td className="border p-2 flex items-center gap-2">
        <span className="flex items-center gap-2">
          計画値の変更
          <EyeIcon visible={showPercentage} onClick={onToggle} />
        </span>
      </td>
      {Array.from({ length: 10 }, (_, i) => 2019 + i).map((year, index) => (
        <td key={year} className="border p-2 text-right">
          {index > 4 && showPercentage && (
            <div className="flex items-center justify-end">
              <div className="inline-flex items-center bg-white rounded px-2 py-1">
                <input
                  type="number"
                  className="w-16 text-right focus:outline-none"
                  value={values[index]}
                  onChange={(e) => {
                    const newValue = Number(e.target.value);
                    if (!isNaN(newValue)) {
                      onValueChange(index, newValue);
                    }
                  }}
                  min={0}
                  max={999.9}
                  step={0.1}
                />
                <span className="ml-1">%</span>
              </div>
            </div>
          )}
        </td>
      ))}
    </tr>
  );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">損益計算書</h1>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* メトリクスカード */}
        <div className="lg:w-1/2 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="col-span-1 md:col-span-2">
            <MetricCard
              title="売上高"
              value={metrics.売上高}
              subtitle="着地見込 - 仮テキスト"
              unit="千円"
              companyCount={320}
              yearOverYear={15.2}
            />
          </div>
          <MetricCard
            title="売上総利益"
            value={metrics.売上総利益}
            subtitle="着地見込 - 仮テキスト"
            unit="千円"
            companyCount={320}
            yearOverYear={12.5}
          />
          <MetricCard
            title="営業利益"
            value={metrics.営業利益}
            subtitle="着地見込 - 仮テキスト"
            unit="千円"
            companyCount={320}
            yearOverYear={10.8}
          />
          <MetricCard
            title="経常利益"
            value={metrics.経常利益}
            subtitle="着地見込 - 仮テキスト"
            unit="千円"
            companyCount={320}
            yearOverYear={10.8}
          />
          <MetricCard
            title="当期純利益"
            value={metrics.当期純利益}
            subtitle="着地見込 - 仮テキスト"
            unit="千円"
            companyCount={320}
            yearOverYear={9.5}
          />
        </div>

        {/* グラフ */}
        <div className="lg:w-1/2 h-[600px]">
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

      {/* 期間選択 */}
      <div className="mb-4 flex items-center gap-2">
        <select
          value={startYear}
          onChange={(e) => setStartYear(Number(e.target.value))}
          className="border p-2 rounded"
        >
          {Array.from({ length: 10 }, (_, i) => 2019 + i).map(year => (
            <option key={year} value={year}>{year}年</option>
          ))}
        </select>
        <span>〜</span>
        <select
          value={endYear}
          onChange={(e) => setEndYear(Number(e.target.value))}
          className="border p-2 rounded"
        >
          {Array.from({ length: 10 }, (_, i) => 2019 + i).map(year => (
            <option key={year} value={year}>{year}年</option>
          ))}
        </select>
        <button className="border p-2 rounded bg-white hover:bg-gray-50">
          決済期末の変更
        </button>
      </div>

      {/* PLテーブル */}
      <div className="mt-8 overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="border p-2 text-left bg-[#1A1A1A] text-white">会計年度</th>
              {Array.from({ length: 10 }, (_, i) => 2019 + i).map((year) => (
                <th key={year} className="border p-2 text-right min-w-[120px] bg-[#1A1A1A] text-white">
                  {year}年
                </th>
              ))}
            </tr>
            <tr>
              <th className="border p-2 text-left bg-[#F2F2F2]">期</th>
              {Array.from({ length: 10 }, (_, i) => (
                <th key={i} className="border p-2 text-right bg-[#F2F2F2]">
                  {i + 1}期
                </th>
              ))}
            </tr>
            <tr>
              <th className="border p-2 text-left bg-[#F2F2F2]">実績・計画</th>
              {Array.from({ length: 10 }, (_, i) => (
                <th key={i} className="border p-2 text-right bg-[#F2F2F2]">
                  {i <= 4 ? '実績' : '計画'} ▼
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {/* 売上高セクション */}
            <tr>
              <td className="border p-2 bg-gray-50 font-semibold">売上高</td>
              {Array.from({ length: 10 }).map((_, i) => {
                const year = 2019 + i;
                const revenue = calculateRevenue(year, i);
                return (
                  <td key={i} className="border p-2 text-right">
                    <div className="text-blue-600">{revenue.toLocaleString()}</div>
                    {i > 4 && <div className="text-sm text-gray-500">{percentageValues.売上高[i].toFixed(1)}%</div>}
                  </td>
                );
              })}
            </tr>
            <PlanValueRow
              title="売上高"
              showPercentage={showPercentages.売上高}
              onToggle={() => setShowPercentages(prev => ({ ...prev, 売上高: !prev.売上高 }))}
              values={percentageValues.売上高}
              onValueChange={(index, value) => {
                const newValues = [...percentageValues.売上高];
                newValues[index] = value;
                setPercentageValues(prev => ({ ...prev, 売上高: newValues }));
              }}
            />
            <tr>
              <td className="border p-2 pl-6">店舗売上高</td>
              {Array.from({ length: 10 }).map((_, i) => (
                <td key={i} className="border p-2 text-right">{(calculateRevenue(2019 + i, i) * 0.3).toLocaleString()}</td>
              ))}
            </tr>
            <tr>
              <td className="border p-2 pl-6">通販売上高</td>
              {Array.from({ length: 10 }).map((_, i) => (
                <td key={i} className="border p-2 text-right">{(calculateRevenue(2019 + i, i) * 0.2).toLocaleString()}</td>
              ))}
            </tr>
            <tr>
              <td className="border p-2 pl-6">クラウドサービス売上高</td>
              {Array.from({ length: 10 }).map((_, i) => (
                <td key={i} className="border p-2 text-right">{(calculateRevenue(2019 + i, i) * 0.15).toLocaleString()}</td>
              ))}
            </tr>
            <tr>
              <td className="border p-2 pl-6">代行サービス売上高</td>
              {Array.from({ length: 10 }).map((_, i) => (
                <td key={i} className="border p-2 text-right">{(calculateRevenue(2019 + i, i) * 0.12).toLocaleString()}</td>
              ))}
            </tr>
            <tr>
              <td className="border p-2 pl-6">製造委託サービス売上高</td>
              {Array.from({ length: 10 }).map((_, i) => (
                <td key={i} className="border p-2 text-right">{(calculateRevenue(2019 + i, i) * 0.1).toLocaleString()}</td>
              ))}
            </tr>
            <tr>
              <td className="border p-2 pl-6">コンサルティング売上高</td>
              {Array.from({ length: 10 }).map((_, i) => (
                <td key={i} className="border p-2 text-right">{(calculateRevenue(2019 + i, i) * 0.08).toLocaleString()}</td>
              ))}
            </tr>
            <tr>
              <td className="border p-2 pl-6">その他売上高</td>
              {Array.from({ length: 10 }).map((_, i) => (
                <td key={i} className="border p-2 text-right">{(calculateRevenue(2019 + i, i) * 0.05).toLocaleString()}</td>
              ))}
            </tr>

            {/* 売上原価セクション */}
            <tr>
              <td className="border p-2 bg-gray-50 font-semibold">売上原価</td>
              {Array.from({ length: 10 }).map((_, i) => {
                const year = 2019 + i;
                const revenue = calculateRevenue(year, i);
                const costRatio = year <= 2023 ? 0.7 : percentageValues.売上原価[i] / 100;
                const cost = revenue * costRatio;
                return (
                  <td key={i} className="border p-2 text-right">
                    <div className="text-blue-600">{cost.toLocaleString()}</div>
                    {i > 4 && <div className="text-sm text-gray-500">{percentageValues.売上原価[i].toFixed(1)}%</div>}
                  </td>
                );
              })}
            </tr>
            <PlanValueRow
              title="売上原価"
              showPercentage={showPercentages.売上原価}
              onToggle={() => setShowPercentages(prev => ({ ...prev, 売上原価: !prev.売上原価 }))}
              values={percentageValues.売上原価}
              onValueChange={(index, value) => {
                const newValues = [...percentageValues.売上原価];
                newValues[index] = value;
                setPercentageValues(prev => ({ ...prev, 売上原価: newValues }));
              }}
            />
            {['労務費', '材料費', '租税公課', '外注加工費', '仕入高', '荷造運賃', 'その他原価'].map((item) => (
              <tr key={item}>
                <td className="border p-2 pl-6">{item}</td>
                {Array.from({ length: 10 }).map((_, i) => (
                  <td key={i} className="border p-2 text-right">
                    {(calculateRevenue(2019 + i, i) * 0.7 / 7).toLocaleString()}
                  </td>
                ))}
              </tr>
            ))}

            {/* 売上総利益セクション */}
            <tr>
              <td className="border p-2 bg-gray-50 font-semibold">売上総利益</td>
              {Array.from({ length: 10 }).map((_, i) => {
                const year = 2019 + i;
                const revenue = calculateRevenue(year, i);
                const costRatio = year <= 2023 ? 0.7 : percentageValues.売上原価[i] / 100;
                const grossProfit = revenue * (1 - costRatio);
                return (
                  <td key={i} className="border p-2 text-right">
                    <div className="text-blue-600">{grossProfit.toLocaleString()}</div>
                    {i > 4 && <div className="text-sm text-gray-500">{(100 - percentageValues.売上原価[i]).toFixed(1)}%</div>}
                  </td>
                );
              })}
            </tr>

            {/* 販管費セクション */}
            <tr>
              <td className="border p-2">販売費および一般管理費</td>
              {Array.from({ length: 10 }).map((_, i) => {
                const year = 2019 + i;
                const revenue = calculateRevenue(year, i);
                const sgaRatio = year <= 2023 ? 0.2 : percentageValues.販管費[i] / 100;
                return (
                  <td key={i} className="border p-2 text-right text-red-500">
                    △ {(revenue * sgaRatio).toLocaleString()}
                  </td>
                );
              })}
            </tr>
            <PlanValueRow
              title="販管費"
              showPercentage={showPercentages.販管費}
              onToggle={() => setShowPercentages(prev => ({ ...prev, 販管費: !prev.販管費 }))}
              values={percentageValues.販管費}
              onValueChange={(index, value) => {
                const newValues = [...percentageValues.販管費];
                newValues[index] = value;
                setPercentageValues(prev => ({ ...prev, 販管費: newValues }));
              }}
            />
          </tbody>
        </table>
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
