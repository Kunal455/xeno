import { cn } from '../../utils/cn';

export function Button({ children, variant = 'primary', className, ...props }) {
  const baseStyle = "inline-flex items-center justify-center px-4 py-2 rounded-xl text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2";
  
  const variants = {
    primary: "bg-primary text-white hover:bg-indigo-600 focus:ring-primary shadow-sm",
    secondary: "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 focus:ring-slate-200",
    ghost: "bg-transparent text-slate-600 hover:bg-slate-100 focus:ring-slate-200",
    danger: "bg-danger text-white hover:bg-red-600 focus:ring-danger shadow-sm"
  };

  return (
    <button className={cn(baseStyle, variants[variant], className)} {...props}>
      {children}
    </button>
  );
}
