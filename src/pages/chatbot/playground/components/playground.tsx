import { Label } from '@/components/ui/label';
import Header from './header';
import SettingsSide from './settings-side';
import LayoutWrapper from '@/components/animation-wrapper';
import Wrapper from '../../components/wrapper';
import Widget from './widget';
import { ScrollArea } from '@/components/ui/scroll-area';

const Playground = () => {
  return (
    <Wrapper>
      <LayoutWrapper className="flex h-full flex-col">
        <Header />
        <div className="grid grid-cols-2 overflow-hidden">
          <SettingsSide />
          <ScrollArea className="h-[calc(100vh-101px)]">
            <div className="flex h-[calc(100vh-101px)] flex-col border-l border-stone-200 bg-stone-100 p-8">
              <Label className="mb-5">Preview</Label>
              <div className="mx-auto flex w-full max-w-[416px] grow items-center justify-center">
                <Widget />
              </div>
            </div>
          </ScrollArea>
        </div>
      </LayoutWrapper>
    </Wrapper>
  );
};

export default Playground;
