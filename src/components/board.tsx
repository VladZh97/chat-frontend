const Board = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="grow p-2">
      <div className="h-full overflow-hidden rounded-xl bg-neutral-50 shadow-md">{children}</div>
    </div>
  );
};

export default Board;
