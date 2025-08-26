import React from 'react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';

interface SparklineProps {
  data: { value: number; time: Date }[];
  color?: string;
  height?: number;
}

const Sparkline: React.FC<SparklineProps> = ({ 
  data, 
  color = '#06b6d4', 
  height = 40 
}) => {
  if (!data || data.length === 0) return null;

  return (
    <div className="w-full" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 2, right: 2, left: 2, bottom: 2 }}>
          <Line
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={2}
            dot={false}
            activeDot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Sparkline;