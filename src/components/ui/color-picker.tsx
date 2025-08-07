import { useState } from 'react';
import { HexColorPicker } from 'react-colorful';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Input } from '@/components/ui/input';

const ColorPicker = ({ value, onChange }: { value: string; onChange: (value: string) => void }) => {
  const [open, setOpen] = useState(false);
  const color = value || '#FFFFFF';

  return (
    <Popover onOpenChange={setOpen} open={open}>
      <PopoverTrigger className="flex w-[132px] cursor-pointer items-center gap-2.5 rounded-lg border border-stone-200 bg-white py-3 pl-2 shadow-sm">
        <span
          className="block size-5 shrink-0 rounded-full border border-[#0a0a0a33]"
          style={{ backgroundColor: color }}
        ></span>
        <span className="text-sm text-stone-900 tabular-nums">{color}</span>
      </PopoverTrigger>
      <PopoverContent className="w-full p-2" side="bottom" align="end">
        <HexColorPicker color={color} onChange={onChange} />
        <Input
          className="mt-2"
          maxLength={7}
          onChange={e => {
            onChange(e?.currentTarget?.value);
          }}
          value={color}
        />
      </PopoverContent>
    </Popover>
  );
};

export default ColorPicker;
