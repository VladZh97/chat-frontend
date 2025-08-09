import { useEffect, useState } from 'preact/hooks';
import { useMutation } from '@tanstack/react-query';
import chatbot from '@/api/chatbot';
import { useParams } from 'react-router-dom';
import { useChatbotStoreShallow } from '@/store/chatbot.store';

export const usePlayground = () => {
  const [messages, setMessages] = useState<{ role: 'user' | 'bot'; content: string }[]>([]);
  const [inputValue, setInputValue] = useState('');
  const { id: chatbotId } = useParams();
  const { promptValue } = useChatbotStoreShallow(s => ({
    promptValue: s.promptValue,
  }));
  const { mutateAsync: sendMessage, isPending } = useMutation({
    mutationFn: (payload: { messages: { role: 'user' | 'bot'; content: string }[] }) =>
      chatbot.playground.sendMessage(chatbotId!, payload.messages, promptValue),
  });

  useEffect(() => {
    setMessages([]);
  }, [promptValue]);

  const handleSendMessage = async ({
    role,
    content,
  }: {
    role: 'user' | 'bot';
    content: string;
  }) => {
    if (isPending || !content.trim()) return;
    const updatedMessages = [...messages, { role, content }];
    setMessages(updatedMessages);
    setInputValue('');
    const { response } = await sendMessage({ messages: updatedMessages });
    setMessages(prev => [...prev, { role: 'bot', content: response }]);
  };

  return { messages, inputValue, setInputValue, handleSendMessage, isPending };
};
