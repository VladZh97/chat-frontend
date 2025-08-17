import { useEffect, useRef } from 'preact/hooks';
import moment from 'moment';
import { ArrowLeft } from 'lucide-react';
import { useHistoryStoreShallow } from '../store';
import { useWidgetStoreShallow } from '../store/widget.store';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AssistantMessage } from './assistant-message';
import { UserMessage } from './user-message';

export const ConversationDetail = () => {
  const { selectedConversation } = useHistoryStoreShallow(s => ({
    selectedConversation: s.selectedConversation,
  }));

  const { setView } = useWidgetStoreShallow(s => ({
    setView: s.setView,
  }));

  const scrollRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when conversation loads
  useEffect(() => {
    if (scrollRef.current) {
      const container = scrollRef.current.closest(
        '[data-slot="scroll-area-viewport"]'
      ) as HTMLDivElement;
      if (container) {
        container.scrollTo({
          top: container.scrollHeight,
          behavior: 'smooth',
        });
      }
    }
  }, [selectedConversation]);

  if (!selectedConversation) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <p className="text-sm text-gray-600">No conversation selected</p>
          <button
            onClick={() => setView('history')}
            className="mt-2 text-sm text-blue-600 hover:underline"
          >
            Back to history
          </button>
        </div>
      </div>
    );
  }

  const formatDate = (timestamp: number) => {
    const date = moment(timestamp);
    const today = moment().startOf('day');
    const targetDay = date.startOf('day');
    const diffInDays = today.diff(targetDay, 'days');

    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays === 2) return '2 days ago';
    return date.format('MMM D, YYYY');
  };

  // Group consecutive messages by role
  const groupedMessages = selectedConversation.messages.reduce(
    (groups, message) => {
      const lastGroup = groups[groups.length - 1];
      if (lastGroup && lastGroup.role === message.role) {
        lastGroup.messages.push(message);
      } else {
        groups.push({
          role: message.role,
          messages: [message],
        });
      }
      return groups;
    },
    [] as Array<{ role: 'user' | 'assistant'; messages: typeof selectedConversation.messages }>
  );

  return (
    <div className="h-full">
      {/* Header */}
      <div className="border-b border-gray-100 p-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setView('history')}
            className="flex h-8 w-8 items-center justify-center rounded-md transition-colors hover:bg-gray-100"
          >
            <ArrowLeft className="h-4 w-4 text-gray-600" />
          </button>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Conversation</h2>
            <p className="text-xs text-gray-500">
              {selectedConversation.messages.length} message
              {selectedConversation.messages.length === 1 ? '' : 's'} •{' '}
              {formatDate(selectedConversation.lastActivity)}
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="h-[calc(100%-80px)]">
        <div className="flex flex-1 flex-col" ref={scrollRef}>
          <div className="space-y-4 p-6">
            {groupedMessages.map((group, groupIndex) => (
              <div key={groupIndex} className="space-y-1">
                {group.role === 'assistant'
                  ? group.messages.map((msg, idx) => (
                      <AssistantMessage key={idx} message={msg.content} />
                    ))
                  : group.messages.map((msg, idx) => (
                      <UserMessage key={idx} message={msg.content} />
                    ))}
              </div>
            ))}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};
