import { CalendarDays, MessagesSquare } from 'lucide-react';
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { CartesianGrid, Line, LineChart, XAxis } from 'recharts';
import { type DateRange } from 'react-day-picker';

import { Calendar } from '@/components/ui/calendar';
import { useState, useEffect, type Dispatch } from 'preact/hooks';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import moment from 'moment';
import type { SetStateAction } from 'preact/compat';

const chartData = [
  { date: '2024-04-01', chats: 150 },
  { date: '2024-04-02', chats: 180 },
  { date: '2024-04-03', chats: 120 },
  { date: '2024-04-04', chats: 260 },
  { date: '2024-04-05', chats: 290 },
  { date: '2024-04-06', chats: 340 },
  { date: '2024-04-07', chats: 180 },
  { date: '2024-04-08', chats: 320 },
  { date: '2024-04-09', chats: 110 },
  { date: '2024-04-10', chats: 190 },
  { date: '2024-04-11', chats: 350 },
  { date: '2024-04-12', chats: 210 },
  { date: '2024-04-13', chats: 380 },
  { date: '2024-04-14', chats: 220 },
  { date: '2024-04-15', chats: 170 },
  { date: '2024-04-16', chats: 190 },
  { date: '2024-04-17', chats: 360 },
  { date: '2024-04-18', chats: 410 },
  { date: '2024-04-19', chats: 180 },
  { date: '2024-04-20', chats: 150 },
  { date: '2024-04-21', chats: 200 },
  { date: '2024-04-22', chats: 170 },
  { date: '2024-04-23', chats: 230 },
  { date: '2024-04-24', chats: 290 },
  { date: '2024-04-25', chats: 250 },
  { date: '2024-04-26', chats: 130 },
  { date: '2024-04-27', chats: 420 },
  { date: '2024-04-28', chats: 180 },
  { date: '2024-04-29', chats: 240 },
  { date: '2024-04-30', chats: 380 },
  { date: '2024-05-01', chats: 220 },
  { date: '2024-05-02', chats: 310 },
  { date: '2024-05-03', chats: 190 },
  { date: '2024-05-04', chats: 420 },
  { date: '2024-05-05', chats: 390 },
  { date: '2024-05-06', chats: 520 },
  { date: '2024-05-07', chats: 300 },
  { date: '2024-05-08', chats: 210 },
  { date: '2024-05-09', chats: 180 },
  { date: '2024-05-10', chats: 330 },
  { date: '2024-05-11', chats: 270 },
  { date: '2024-05-12', chats: 240 },
  { date: '2024-05-13', chats: 160 },
  { date: '2024-05-14', chats: 490 },
  { date: '2024-05-15', chats: 380 },
  { date: '2024-05-16', chats: 400 },
  { date: '2024-05-17', chats: 420 },
  { date: '2024-05-18', chats: 350 },
  { date: '2024-05-19', chats: 180 },
  { date: '2024-05-20', chats: 230 },
  { date: '2024-05-21', chats: 140 },
  { date: '2024-05-22', chats: 120 },
  { date: '2024-05-23', chats: 290 },
  { date: '2024-05-24', chats: 220 },
  { date: '2024-05-25', chats: 250 },
  { date: '2024-05-26', chats: 170 },
  { date: '2024-05-27', chats: 460 },
  { date: '2024-05-28', chats: 190 },
  { date: '2024-05-29', chats: 130 },
  { date: '2024-05-30', chats: 280 },
  { date: '2024-05-31', chats: 230 },
  { date: '2024-06-01', chats: 200 },
  { date: '2024-06-02', chats: 410 },
  { date: '2024-06-03', chats: 160 },
  { date: '2024-06-04', chats: 380 },
  { date: '2024-06-05', chats: 140 },
  { date: '2024-06-06', chats: 250 },
  { date: '2024-06-07', chats: 370 },
  { date: '2024-06-08', chats: 320 },
  { date: '2024-06-09', chats: 480 },
  { date: '2024-06-10', chats: 200 },
  { date: '2024-06-11', chats: 150 },
  { date: '2024-06-12', chats: 420 },
  { date: '2024-06-13', chats: 130 },
  { date: '2024-06-14', chats: 380 },
  { date: '2024-06-15', chats: 350 },
  { date: '2024-06-16', chats: 310 },
  { date: '2024-06-17', chats: 520 },
  { date: '2024-06-18', chats: 170 },
  { date: '2024-06-19', chats: 290 },
  { date: '2024-06-20', chats: 450 },
  { date: '2024-06-21', chats: 210 },
  { date: '2024-06-22', chats: 270 },
  { date: '2024-06-23', chats: 530 },
  { date: '2024-06-24', chats: 180 },
  { date: '2024-06-25', chats: 190 },
  { date: '2024-06-26', chats: 380 },
  { date: '2024-06-27', chats: 490 },
  { date: '2024-06-28', chats: 200 },
  { date: '2024-06-29', chats: 160 },
  { date: '2024-06-30', chats: 400 },
];

const chartConfig = {
  chats: {
    label: 'Chats',
  },
} satisfies ChartConfig;

const TotalChatsChart = () => {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(2025, 5, 9),
    to: new Date(2025, 5, 26),
  });

  const dateRangeDays = moment(dateRange?.to).diff(moment(dateRange?.from), 'days') + 1;
  return (
    <div className="mb-4 rounded-xl border border-neutral-200 bg-white p-6 shadow">
      <div className="flex items-center justify-between pb-6">
        <div>
          <div className="mb-1 flex items-center gap-2 text-base font-semibold text-neutral-900">
            <MessagesSquare className="size-4 text-neutral-500" />
            Total chats
          </div>
          <span className="text-sm text-neutral-700">
            Showing total chats for the last {dateRangeDays} {dateRangeDays === 1 ? 'day' : 'days'}
          </span>
        </div>
        <DatePicker dateRange={dateRange} setDateRange={setDateRange} />
      </div>
      <div>
        <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value: string) => {
                const date = new Date(value);
                return date.toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                });
              }}
            />
            <ChartTooltip content={<ChartTooltipContent className="w-[150px]" nameKey="chats" />} />
            <Line
              dataKey="chats"
              type="natural"
              stroke="var(--color-neutral-900)"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </div>
    </div>
  );
};

export default TotalChatsChart;

const DatePicker = ({
  dateRange,
  setDateRange,
}: {
  dateRange: DateRange | undefined;
  setDateRange: Dispatch<SetStateAction<DateRange | undefined>>;
}) => {
  return (
    <Popover>
      <PopoverTrigger>
        <div className="flex h-9 w-64 cursor-pointer items-center gap-2 rounded-md border border-neutral-200 bg-white px-4 py-2 text-sm text-neutral-900">
          <CalendarDays className="size-4" />
          {moment(dateRange?.from).format('MMM D, YYYY')} -{' '}
          {moment(dateRange?.to).format('MMM D, YYYY')}
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-0">
        <Calendar
          mode="range"
          defaultMonth={dateRange?.from}
          selected={dateRange}
          onSelect={setDateRange}
          className="w-full"
        />
      </PopoverContent>
    </Popover>
  );
};
