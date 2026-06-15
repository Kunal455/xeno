import { cn } from '../../utils/cn';

export function Badge({ children, variant = 'default', className }) {
  const variants = {
    default: "bg-slate-100 text-slate-700",
    success: "bg-success/10 text-success",
    warning: "bg-warning/10 text-warning",
    danger: "bg-danger/10 text-danger",
    primary: "bg-primary/10 text-primary",
  };

  return (
    <span className={cn("px-2.5 py-0.5 rounded-full text-xs font-semibold flex items-center w-fit", variants[variant], className)}>
      {variant !== 'default' && variant !== 'primary' && (
        <span className={cn("w-1.5 h-1.5 rounded-full mr-1.5", 
          variant === 'success' ? 'bg-success' : 
          variant === 'warning' ? 'bg-warning' : 'bg-danger'
        )} />
      )}
      {children}
    </span>
  );
}
