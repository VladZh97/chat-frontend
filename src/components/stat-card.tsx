const StatCard = ({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) => {
  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow">
      <div className="mb-2 flex items-center gap-2 text-sm font-medium text-neutral-900">
        {icon}
        {title}
      </div>
      <span className="text-2xl font-bold text-neutral-900">{children}</span>
    </div>
  );
};

export default StatCard;
