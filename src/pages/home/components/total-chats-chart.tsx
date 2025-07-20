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
import { useState, type Dispatch } from 'preact/hooks';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import moment from 'moment';
import type { SetStateAction } from 'preact/compat';
import { cn } from '@/lib/utils';

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

  // Check if there's data to display
  const hasData = chartData.length > 0;

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
      <div className="relative">
        <ChartContainer
          config={chartConfig}
          className={cn('aspect-auto h-[250px] w-full', !hasData && 'opacity-30')}
        >
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              top: 20,
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
              stroke={!hasData ? 'var(--color-neutral-200)' : 'var(--color-neutral-900)'}
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
        {!hasData && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-sm text-neutral-500">
                <p className="font-medium text-neutral-700">No chat data available</p>
                <p className="mt-1">
                  Chat data will appear here once your chatbots start receiving conversations
                </p>
              </div>
            </div>
          </div>
        )}
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
