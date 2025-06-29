import ColorPicker from '@/components/ui/color-picker';
import { Label } from '@/components/ui/label';
import { useChatbotStoreShallow } from '@/store/chatbot.store';

const Colors = () => {
  const { accentColor, backgroundColor, setChatbot } = useChatbotStoreShallow(s => ({
    accentColor: s.accentColor,
    backgroundColor: s.backgroundColor,
    setChatbot: s.setChatbot,
  }));
  return (
    <div className="mb-6 space-y-6">
      <div className="flex items-center justify-between">
        <Label>Accent color</Label>
        <ColorPicker value={accentColor} onChange={value => setChatbot({ accentColor: value })} />
      </div>
      <div className="flex items-center justify-between">
        <Label>Icon background</Label>
        <ColorPicker
          value={backgroundColor}
          onChange={value => setChatbot({ backgroundColor: value })}
        />
      </div>
    </div>
  );
};

export default Colors;
