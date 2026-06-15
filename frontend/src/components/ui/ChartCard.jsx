import { Card } from './Card';

export function ChartCard({ title, subtitle, children, rightAction }) {
  return (
    <Card className="p-6 flex flex-col h-full">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="font-bold text-slate-900">{title}</h3>
          {subtitle && <p className="text-sm text-slate-500 mt-1">{subtitle}</p>}
        </div>
        {rightAction && <div>{rightAction}</div>}
      </div>
      <div className="flex-1 w-full relative min-h-[200px]">
        {children}
      </div>
    </Card>
  );
}
