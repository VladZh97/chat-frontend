import { CalendarDays, Calendar as CalendarIcon, LoaderCircle } from 'lucide-react';
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
import { cn } from '@/lib/utils';
import { stats } from '@/api/stats';

const CHART_CONFIG = {
  messages: {
    label: 'Messages',
  },
} satisfies ChartConfig;

// Helper function to generate date range data
const generateDateRangeData = (
  start: moment.Moment,
  end: moment.Moment,
  messagesMap?: Map<string, number>
) => {
  const days = end.diff(start, 'days') + 1;
  const result = [];

  for (let i = 0; i < days; i++) {
    const date = start.clone().add(i, 'days').format('YYYY-MM-DD');
    const messages = messagesMap
      ? (messagesMap.get(date) ?? 0)
      : Math.floor(Math.random() * 301) + 100;
    result.push({ date, messages });
  }

  return result;
};

// Helper function to create messages map
const createMessagesMap = (messagesOverTime: any[]): Map<string, number> => {
  const messagesMap = new Map<string, number>();
  if (Array.isArray(messagesOverTime)) {
    for (const entry of messagesOverTime) {
      if (entry.date) {
        messagesMap.set(entry.date, entry.messages ?? 0);
      }
    }
  }
  return messagesMap;
};

const MessagesOverTimeChart = () => {
  const [selectedChatbot, setSelectedChatbot] = useState<string>('all');
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: moment().subtract(6, 'days').toDate(),
    to: moment().toDate(),
  });

  const {
    data: messagesOverTime,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: stats.messagesOverTime.key(
      moment(dateRange?.from).format('YYYY-MM-DD'),
      moment(dateRange?.to).format('YYYY-MM-DD'),
      selectedChatbot === 'all' ? undefined : selectedChatbot
    ),
    queryFn: () =>
      stats.messagesOverTime.query(
        moment(dateRange?.from).format('YYYY-MM-DD'),
        moment(dateRange?.to).format('YYYY-MM-DD'),
        selectedChatbot === 'all' ? undefined : selectedChatbot
      ),
    enabled: !!dateRange?.from && !!dateRange?.to,
  });

  // Memoize the messages map to avoid recreating it on every render
  const messagesMap = useMemo(() => createMessagesMap(messagesOverTime), [messagesOverTime]);

  // Check if there's data to display
  const hasData = messagesOverTime?.length > 0 || isLoading || isFetching;

  const data = useMemo(() => {
    if (isLoading || isFetching) return [];

    if (!dateRange?.from || !dateRange?.to) return [];

    const start = moment(dateRange.from).startOf('day');
    const end = moment(dateRange.to).startOf('day');

    // Generate placeholder data if no real data is available
    if (!hasData) {
      return generateDateRangeData(start, end);
    }

    // Generate data with real messages
    return generateDateRangeData(start, end, messagesMap);
  }, [hasData, messagesMap, dateRange, isLoading, isFetching]);

  return (
    <div className="mb-4 rounded-xl border border-stone-200 bg-white p-6 shadow">
      <div className="flex items-center justify-between pb-6">
        <div>
          <div className="mb-1 flex items-center gap-2 text-base font-semibold text-stone-900">
            {isLoading || isFetching ? (
              <LoaderCircle className="size-4 animate-spin" />
            ) : (
              <CalendarIcon className="size-4 text-stone-500" />
            )}
            Messages over time
          </div>
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
          <BarChart
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
            <ChartTooltip
              content={<ChartTooltipContent className="w-[150px]" nameKey="messages" />}
            />
            <Bar
              dataKey="messages"
              fill={!hasData ? 'var(--color-stone-200)' : 'var(--color-stone-900)'}
              radius={4}
            />
          </BarChart>
        </ChartContainer>
        {!hasData && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-sm text-stone-500">
                <p className="font-medium text-stone-700">No message data available</p>
                <p className="mt-1">
                  Messages will appear here once your chatbots start receiving conversations
                </p>
              </div>
            </div>
          </div>
        )}
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
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger>
        <div className="flex h-9 w-64 cursor-pointer items-center gap-2 rounded-md border border-stone-200 bg-white px-4 py-2 text-sm text-stone-900">
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
        <span className="block max-w-52 truncate">
          {selectedChatbot === 'all' ? 'All agents' : chatbotName}
        </span>
      </Select.Trigger>
      <Select.Content className="p-0">
        <ScrollArea>
          <div className="max-h-60 space-y-1 p-2">
            <Select.Option value="all">All agents</Select.Option>
            {data?.map(chatbot => (
              <Select.Option key={chatbot.value} value={chatbot.value}>
                <span className="block max-w-48 truncate">{chatbot.label}</span>
              </Select.Option>
            ))}
          </div>
        </ScrollArea>
      </Select.Content>
    </Select>
  );
};
