import { CalendarDays, Calendar as CalendarIcon } from 'lucide-react';
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { CartesianGrid, Bar, BarChart, XAxis } from 'recharts';
import { type DateRange } from 'react-day-picker';

import { Calendar } from '@/components/ui/calendar';
import { useMemo, useState, type Dispatch } from 'preact/hooks';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import moment from 'moment';
import type { SetStateAction } from 'preact/compat';
import Select from '@/components/ui/select';
import { useQuery } from '@tanstack/react-query';
import chatbot from '@/api/chatbot';
import { ScrollArea } from '@/components/ui/scroll-area';

const chartData = [
  { date: '2024-04-01', messages: 150 },
  { date: '2024-04-02', messages: 180 },
  { date: '2024-04-03', messages: 120 },
  { date: '2024-04-04', messages: 260 },
  { date: '2024-04-05', messages: 290 },
  { date: '2024-04-06', messages: 340 },
  { date: '2024-04-07', messages: 180 },
  { date: '2024-04-08', messages: 320 },
  { date: '2024-04-09', messages: 110 },
  { date: '2024-04-10', messages: 190 },
  { date: '2024-04-11', messages: 350 },
  { date: '2024-04-12', messages: 210 },
  { date: '2024-04-13', messages: 380 },
  { date: '2024-04-14', messages: 220 },
  { date: '2024-04-15', messages: 170 },
];

const chartConfig = {
  messages: {
    label: 'Messages',
  },
} satisfies ChartConfig;

const MessagesOverTimeChart = () => {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(2025, 5, 9),
    to: new Date(2025, 5, 26),
  });

  return (
    <div className="mb-4 rounded-xl border border-neutral-200 bg-white p-6 shadow">
      <div className="flex items-center justify-between pb-6">
        <div>
          <div className="mb-1 flex items-center gap-2 text-base font-semibold text-neutral-900">
            <CalendarIcon className="size-4 text-neutral-500" />
            Messages over time
          </div>
        </div>
        <div className="flex items-center gap-2">
          <ChatbotSelect />
          <DatePicker dateRange={dateRange} setDateRange={setDateRange} />
        </div>
      </div>
      <div>
        <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
          <BarChart
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
            <ChartTooltip
              content={<ChartTooltipContent className="w-[150px]" nameKey="messages" />}
            />
            <Bar dataKey="messages" fill="var(--color-neutral-900)" radius={4} />
          </BarChart>
        </ChartContainer>
      </div>
    </div>
  );
};

export default MessagesOverTimeChart;

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

const ChatbotSelect = () => {
  const [selectedChatbot, setSelectedChatbot] = useState<string>('all');
  const { data } = useQuery({
    queryKey: ['chatbots'],
    queryFn: chatbot.get,
    select: data =>
      data.map(chatbot => ({
        label: chatbot.name,
        value: chatbot._id,
      })),
  });

  const chatbotName = useMemo(() => {
    return data?.find(chatbot => chatbot.value === selectedChatbot)?.label;
  }, [data, selectedChatbot]);

  return (
    <Select value={selectedChatbot} onValueChange={setSelectedChatbot}>
      <Select.Trigger className="h-9 w-64">
        {selectedChatbot === 'all' ? 'All agents' : chatbotName}
      </Select.Trigger>
      <Select.Content className="p-0">
        <ScrollArea>
          <div className="max-h-60 space-y-1 p-2">
            <Select.Option value="all">All agents</Select.Option>
            {data?.map(chatbot => (
              <Select.Option key={chatbot.value} value={chatbot.value}>
                {chatbot.label}
              </Select.Option>
            ))}
          </div>
        </ScrollArea>
      </Select.Content>
    </Select>
  );
};
