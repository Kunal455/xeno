import { Card } from './Card';
import { cn } from '../../utils/cn';

export function StatCard({ title, value, icon: Icon, trend, trendValue, color = "primary" }) {
  const isPositive = trend === 'up';
  
  const colorStyles = {
    primary: "bg-indigo-50 text-primary",
    secondary: "bg-purple-50 text-secondary",
    success: "bg-green-50 text-success",
    warning: "bg-orange-50 text-warning"
  };
  
  return (
    <Card className="p-6">
      <div className="flex justify-between items-start mb-4">
        <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", colorStyles[color])}>
          <Icon size={20} />
        </div>
        {trendValue && (
          <div className={cn("flex items-center text-xs font-semibold", isPositive ? "text-success" : "text-danger")}>
            {isPositive ? '↗' : '↘'} {trendValue}
          </div>
        )}
      </div>
      <div>
        <h3 className="text-3xl font-bold text-slate-900 mb-1">{value}</h3>
        <p className="text-sm font-medium text-slate-500">{title}</p>
      </div>
    </Card>
  );
}
