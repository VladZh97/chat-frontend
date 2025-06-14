import { Card, CardContent, CardDescription, CardFooter, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/assets/icon.svg';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

const WebsiteCard = () => {
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
        <Input placeholder="https://" className="mb-6" />
        <div className="mb-8 flex items-center space-x-2">
          <Switch id="crawl-links" className="cursor-pointer" />
          <Label htmlFor="crawl-link">Crawl link</Label>
        </div>
      </CardContent>
      <CardFooter className="border-t border-neutral-200 bg-neutral-50">
        <Button className="w-full cursor-pointer">Next step</Button>
      </CardFooter>
    </Card>
  );
};

export default WebsiteCard;
