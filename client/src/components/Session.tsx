interface SessionProps {
  title: string;
  desc?: string;
  label?: React.ReactNode;
  children: React.ReactNode;
}

const Session = ({ title, children, label, desc }: SessionProps) => {
  return (
    <div className="relative border-l-2 px-10">
      <div className="flex items-center gap-2">
        <h3 className="text-lg font-bold">{title}</h3>
        {label}
      </div>
      <p className="text-sm text-muted-foreground">{desc}</p>
      <div className="flex py-4">
        <div className="absolute -left-[9px] top-[6px] h-4 w-4 rounded-full border-2 border-primary bg-background" />
        <div className="">{children}</div>
      </div>
    </div>
  );
};

export default Session;
