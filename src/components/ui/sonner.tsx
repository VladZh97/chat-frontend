import { CircleAlert, CircleCheckBig, Info, TriangleAlert } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Toaster as Sonner, type ToasterProps } from 'sonner';

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = 'system' } = useTheme();

  return (
    <Sonner
      position="bottom-center"
      duration={3000}
      icons={{
        info: <Info className="size-6 text-stone-500" />,
        success: <CircleCheckBig className="size-6 text-green-600" />,
        warning: <TriangleAlert className="size-6 text-amber-500" />,
        error: <CircleAlert className="size-6 text-red-600" />,
      }}
      theme={theme as ToasterProps['theme']}
      className="toaster group [&_[data-icon]]:!m-0 [&_[data-icon]]:!size-6"
      style={
        {
          '--normal-bg': 'var(--popover)',
          '--normal-text': 'var(--popover-foreground)',
          '--normal-border': 'var(--border)',
        } as React.CSSProperties
      }
      {...props}
    />
  );
};

export { Toaster };
