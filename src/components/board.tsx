const Board = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="grow p-2">
      <div className="h-full rounded-xl bg-neutral-50 shadow-md">{children}</div>
    </div>
  );
};

export default Board;
