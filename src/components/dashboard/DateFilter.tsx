import React from 'react';
import { Calendar } from 'lucide-react';

interface DateRange {
  startDate: Date;
  endDate: Date;
}

interface DateFilterProps {
  dateRange: DateRange;
  onChange: (dateRange: DateRange) => void;
  className?: string;
}

const DateFilter: React.FC<DateFilterProps> = ({ 
  dateRange, 
  onChange, 
  className = "" 
}) => {
  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({
      ...dateRange,
      startDate: new Date(e.target.value)
    });
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({
      ...dateRange,
      endDate: new Date(e.target.value)
    });
  };

  return (
    <div className={`flex items-center gap-2 bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 px-3 py-2 ${className}`}>
      <Calendar className="w-4 h-4 text-cyan-500" />
      <div className="flex items-center gap-2 text-sm">
        <input
          type="date"
          value={dateRange.startDate.toISOString().split('T')[0]}
          onChange={handleStartDateChange}
          className="bg-transparent border-none text-gray-700 dark:text-slate-300 text-xs focus:outline-none"
        />
        <span className="text-gray-400">-</span>
        <input
          type="date"
          value={dateRange.endDate.toISOString().split('T')[0]}
          onChange={handleEndDateChange}
          className="bg-transparent border-none text-gray-700 dark:text-slate-300 text-xs focus:outline-none"
        />
      </div>
    </div>
  );
};

export default DateFilter;
