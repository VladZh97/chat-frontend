import { useState } from 'react';
import { HexColorPicker } from 'react-colorful';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Input } from '@/components/ui/input';

const ColorPicker = ({ value, onChange }: { value: string; onChange: (value: string) => void }) => {
  const [open, setOpen] = useState(false);

  return (
    <Popover onOpenChange={setOpen} open={open}>
      <PopoverTrigger className="flex w-[132px] cursor-pointer items-center gap-2.5 rounded-lg border border-neutral-200 bg-white py-3 pl-2 shadow-sm">
        <span
          className="block size-5 shrink-0 rounded-full border border-[#0a0a0a33]"
          style={{ backgroundColor: value }}
        ></span>
        <span className="text-sm text-neutral-900 tabular-nums">{value}</span>
      </PopoverTrigger>
      <PopoverContent className="w-full p-2" side="bottom" align="end">
        <HexColorPicker color={value} onChange={onChange} />
        <Input
          className="mt-2"
          maxLength={7}
          onChange={e => {
            onChange(e?.currentTarget?.value);
          }}
          value={value}
        />
      </PopoverContent>
    </Popover>
  );
};

export default ColorPicker;
