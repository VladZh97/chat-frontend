import { Check, ChevronsUpDown } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from './popover';
import { cn } from '@/lib/utils';
import { useState, useContext } from 'preact/hooks';
import { createContext } from 'preact';
import type { Dispatch, ReactNode, SetStateAction } from 'preact/compat';
import { InputStyles } from './input';

// Generic context for Select state
interface SelectContextProps<T = string> {
  open: boolean;
  setOpen: (open: boolean) => void;
  value: T | undefined;
  setValue: Dispatch<SetStateAction<T>>;
}

const SelectContext = createContext<SelectContextProps<any> | undefined>(undefined);

function useSelectContext<T>() {
  const ctx = useContext(SelectContext);
  if (!ctx) throw new Error('Select compound components must be used within <Select>');
  return ctx as SelectContextProps<T>;
}

interface SelectProps<T = string> {
  value: T | undefined;
  onValueChange: Dispatch<SetStateAction<T>>;
  children: ReactNode;
}

function Select<T = string>({ value, onValueChange, children }: SelectProps<T>) {
  const [open, setOpen] = useState(false);
  return (
    <SelectContext.Provider value={{ open, setOpen, value, setValue: onValueChange }}>
      <Popover open={open} onOpenChange={setOpen}>
        {children}
      </Popover>
    </SelectContext.Provider>
  );
}

// Trigger
function Trigger<T = string>({
  children,
  className,
}: {
  children?: ReactNode;
  className?: string;
}) {
  const { open, setOpen, value } = useSelectContext<T>();
  return (
    <PopoverTrigger
      className={cn(
        InputStyles,
        'flex h-11 cursor-pointer items-center justify-between',
        className
      )}
      onClick={() => setOpen(!open)}
    >
      <span>{children ?? String(value) ?? 'Select...'}</span>
      <ChevronsUpDown className="size-4 text-stone-500" />
    </PopoverTrigger>
  );
}

// Content
function Content({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <PopoverContent
      className={cn('w-[var(--radix-popover-trigger-width)] space-y-1 p-2', className)}
    >
      {children}
    </PopoverContent>
  );
}

// Option
interface OptionProps<T = string> {
  value: T;
  children: ReactNode;
}
function Option<T = string>({ value: optionValue, children }: OptionProps<T>) {
  const { value, setValue, setOpen } = useSelectContext<T>();
  const isSelected = value === optionValue;
  return (
    <span
      className={cn(
        'flex cursor-pointer items-center justify-between rounded px-2 py-1.5 text-sm text-stone-900 transition-colors duration-200 hover:bg-stone-100',
        isSelected && 'bg-stone-100'
      )}
      onClick={() => {
        setValue(optionValue);
        setOpen(false);
      }}
    >
      {children}
      {isSelected && <Check className="size-4 text-stone-900" />}
    </span>
  );
}

Select.Trigger = Trigger;
Select.Content = Content;
Select.Option = Option;

export default Select;
