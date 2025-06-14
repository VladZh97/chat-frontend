import { Card, CardDescription, CardTitle } from '@/components/ui/card';
import Icon from '@/assets/icon.svg';
import { Button } from '@/components/ui/button';
import { Bot } from 'lucide-react';

const WelcomeMessage = () => {
  return (
    <Card className="w-full max-w-[448px] gap-0 p-6">
      <img src={Icon} alt="icon" className="mb-4 size-8" width="32" height="32" />
      <CardTitle className="mb-[6px] text-base font-semibold text-neutral-950">
        Welcome, John. Let’s build your chatbot
      </CardTitle>
      <CardDescription className="mb-9 text-sm text-neutral-500">
        We’ll ask a few quick questions to tailor it for your needs.
      </CardDescription>
      <Button className="cursor-pointer">
        <Bot />
        Let’s build
      </Button>
    </Card>
  );
};

export default WelcomeMessage;
