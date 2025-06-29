import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useState } from 'preact/hooks';

const Branding = () => {
  const [removeBranding, setRemoveBranding] = useState(false);
  return (
    <div className="mb-6 flex items-center justify-between border-b border-neutral-200 pb-6">
      <Label>Remove Czat.io branding</Label>
      <Switch checked={removeBranding} onCheckedChange={setRemoveBranding} />
    </div>
  );
};

export default Branding;
