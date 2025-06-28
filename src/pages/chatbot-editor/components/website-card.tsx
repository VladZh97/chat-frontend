import { Card, CardContent, CardDescription, CardFooter, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/assets/icon.svg';
import { Input } from '@/components/ui/input';
import { useMemo, useState } from 'preact/hooks';
import { useMutation } from '@tanstack/react-query';
import { knowledge } from '@/api/knowledge';
import { useParams } from 'react-router-dom';

const WebsiteCard = () => {
  const { id } = useParams();
  const [website, setWebsite] = useState('');
  const { mutate: createKnowledge } = useMutation({
    mutationFn: knowledge.website,
  });

  const isValid = useMemo(() => {
    if (!website) return true; // Empty is valid since it's optional
    const urlPattern =
      /^https:\/\/(?:www\.)?[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}(?:\/[a-zA-Z0-9-._~:/?#[\]@!$&'()*+,;=]*)?$/;
    return urlPattern.test(website);
  }, [website]);

  return (
    <Card className="w-full max-w-[448px] gap-0">
      <CardContent>
        <img src={Icon} alt="icon" className="mb-4 size-8" width="32" height="32" />
        <CardTitle className="mb-[6px] text-base font-semibold text-neutral-950">
          Let’s start with your website
        </CardTitle>
        <CardDescription className="mb-10 text-sm text-neutral-500">
          We’ll use it to personalize your chatbot content and tone. <br /> You can skip this if you
          don’t have one yet.
        </CardDescription>
        <span className="mb-2 text-sm font-normal text-neutral-950">Your website (optional)</span>
        <Input
          placeholder="https://"
          className="mb-6"
          value={website}
          onFocus={e => {
            const value = (e.target as HTMLInputElement).value;
            if (!value) setWebsite('https://');
          }}
          onChange={e => setWebsite((e.target as HTMLInputElement).value)}
        />
      </CardContent>
      <CardFooter className="border-t border-neutral-200 bg-neutral-50">
        <Button
          className="w-full cursor-pointer"
          disabled={!isValid}
          onClick={() =>
            createKnowledge({
              chatbotId: id as string,
              url: website,
              metadata: {},
            })
          }
        >
          Next step
        </Button>
      </CardFooter>
    </Card>
  );
};

export default WebsiteCard;
