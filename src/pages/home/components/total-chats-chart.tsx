import { CalendarDays, MessagesSquare, LoaderCircle } from 'lucide-react';
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { CartesianGrid, Line, LineChart, XAxis } from 'recharts';
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
import { cn } from '@/lib/utils';
import { stats } from '@/api/stats';

const CHART_CONFIG = {
  chats: {
    label: 'Chats',
  },
} satisfies ChartConfig;

// Helper function to generate date range data
const generateDateRangeData = (
  start: moment.Moment,
  end: moment.Moment,
  chatsMap?: Map<string, number>
) => {
  const days = end.diff(start, 'days') + 1;
  const result = [];

  for (let i = 0; i < days; i++) {
    const date = start.clone().add(i, 'days').format('YYYY-MM-DD');
    const chats = chatsMap ? (chatsMap.get(date) ?? 0) : Math.floor(Math.random() * 301) + 100;
    result.push({ date, chats });
  }

  return result;
};

// Helper function to create chats map
const createChatsMap = (chatsOverTime: any[]): Map<string, number> => {
  const chatsMap = new Map<string, number>();
  if (Array.isArray(chatsOverTime)) {
    for (const entry of chatsOverTime) {
      if (entry.date) {
        chatsMap.set(entry.date, entry.chats ?? 0);
      }
    }
  }
  return chatsMap;
};

const TotalChatsChart = () => {
  const [selectedChatbot, setSelectedChatbot] = useState<string>('all');
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: moment().subtract(6, 'days').toDate(),
    to: moment().toDate(),
  });

  const {
    data: chatsOverTime,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: stats.chatsOverTime.key(
      moment(dateRange?.from).format('YYYY-MM-DD'),
      moment(dateRange?.to).format('YYYY-MM-DD'),
      selectedChatbot === 'all' ? undefined : selectedChatbot
    ),
    queryFn: () =>
      stats.chatsOverTime.query(
        moment(dateRange?.from).format('YYYY-MM-DD'),
        moment(dateRange?.to).format('YYYY-MM-DD'),
        selectedChatbot === 'all' ? undefined : selectedChatbot
      ),
    enabled: !!dateRange?.from && !!dateRange?.to,
  });

  // Memoize the chats map to avoid recreating it on every render
  const chatsMap = useMemo(() => createChatsMap(chatsOverTime), [chatsOverTime]);

  // Check if there's data to display
  const hasData = chatsOverTime?.length > 0 || isLoading || isFetching;

  const data = useMemo(() => {
    if (isLoading || isFetching) return [];

    if (!dateRange?.from || !dateRange?.to) return [];

    const start = moment(dateRange.from).startOf('day');
    const end = moment(dateRange.to).startOf('day');

    // Generate placeholder data if no real data is available
    if (!hasData) {
      return generateDateRangeData(start, end);
    }

    // Generate data with real chats
    return generateDateRangeData(start, end, chatsMap);
  }, [hasData, chatsMap, dateRange, isLoading, isFetching]);

  const dateRangeDays = moment(dateRange?.to).diff(moment(dateRange?.from), 'days') + 1;

  return (
    <div className="mb-4 rounded-xl border border-neutral-200 bg-white p-6 shadow">
      <div className="flex items-center justify-between pb-6">
        <div>
          <div className="mb-1 flex items-center gap-2 text-base font-semibold text-neutral-900">
            {isLoading || isFetching ? (
              <LoaderCircle className="size-4 animate-spin" />
            ) : (
              <MessagesSquare className="size-4 text-neutral-500" />
            )}
            Total chats
          </div>
          <span className="text-sm text-neutral-700">
            Showing total chats for the last {dateRangeDays} {dateRangeDays === 1 ? 'day' : 'days'}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <ChatbotSelect
            selectedChatbot={selectedChatbot}
            setSelectedChatbot={setSelectedChatbot}
          />
          <DatePicker dateRange={dateRange} setDateRange={setDateRange} />
        </div>
      </div>
      <div className="relative">
        <ChartContainer
          config={CHART_CONFIG}
          className={cn('aspect-auto h-[250px] w-full', !hasData && 'opacity-30')}
        >
          <LineChart
            accessibilityLayer
            data={data}
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
              type="monotone"
              stroke={!hasData ? 'var(--color-neutral-200)' : 'var(--color-neutral-900)'}
              strokeWidth={2}
              dot={false}
              connectNulls={true}
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
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
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
          onSelect={d => {
            setDateRange(d);
            setIsOpen(false);
          }}
          className="w-full"
        />
      </PopoverContent>
    </Popover>
  );
};

const ChatbotSelect = ({
  selectedChatbot,
  setSelectedChatbot,
}: {
  selectedChatbot: string;
  setSelectedChatbot: Dispatch<SetStateAction<string>>;
}) => {
  const { data } = useQuery({
    queryKey: chatbot.get.key,
    queryFn: chatbot.get.query,
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
