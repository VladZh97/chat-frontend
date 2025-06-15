const ColorPicker = ({ type }: { type: 'accent' | 'background' }) => {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm font-medium text-neutral-950">
        {type === 'accent' ? 'Accent color' : 'Icon background'}
      </span>
      <div className="flex h-8 cursor-pointer items-center gap-2 rounded-lg border border-neutral-200 bg-white px-3 shadow-sm">
        <span className="block size-5 rounded-full border border-[#0a0a0a33] bg-red-600"></span>
        <span className="text-sm text-neutral-950">#DF0000</span>
      </div>
    </div>
  );
};

export default ColorPicker;
