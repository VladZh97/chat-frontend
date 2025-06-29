import ColorPicker from '@/components/ui/color-picker';
import { Label } from '@/components/ui/label';
import { useState } from 'preact/hooks';

const Colors = () => {
  const [accentColor, setAccentColor] = useState('#FFFFFF');
  const [iconBackgroundColor, setIconBackgroundColor] = useState('#FFFFFF');
  return (
    <div className="mb-6 space-y-6">
      <div className="flex items-center justify-between">
        <Label>Accent color</Label>
        <ColorPicker value={accentColor} onChange={setAccentColor} />
      </div>
      <div className="flex items-center justify-between">
        <Label>Icon background</Label>
        <ColorPicker value={iconBackgroundColor} onChange={setIconBackgroundColor} />
      </div>
    </div>
  );
};

export default Colors;
