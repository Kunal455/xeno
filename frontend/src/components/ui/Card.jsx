import { cn } from '../../utils/cn';

export function Card({ className, children, ...props }) {
  return (
    <div className={cn("bg-white rounded-2xl shadow-soft border border-slate-100", className)} {...props}>
      {children}
    </div>
  );
}
