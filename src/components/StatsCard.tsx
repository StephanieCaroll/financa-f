import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  type: 'balance' | 'income' | 'expense' | 'neutral';
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export function StatsCard({ title, value, icon: Icon, type, trend }: StatsCardProps) {
  const getCardStyles = () => {
    switch (type) {
      case 'income':
        return 'border-income/20 bg-gradient-income text-income-foreground shadow-income hover:shadow-income/40 hover:scale-105';
      case 'expense':
        return 'border-expense/20 bg-gradient-expense text-expense-foreground shadow-expense hover:shadow-expense/40 hover:scale-105';
      case 'balance':
        return 'border-primary/20 bg-gradient-primary text-primary-foreground shadow-elevated hover:shadow-glow hover:scale-105';
      default:
        return 'border-neutral/20 bg-gradient-card shadow-card hover:shadow-elevated hover:scale-105';
    }
  };

  const getTrendColor = () => {
    if (!trend) return '';
    return trend.isPositive ? 'text-income' : 'text-expense';
  };

  const getIconAnimation = () => {
    switch (type) {
      case 'balance':
        return 'animate-pulse-glow';
      case 'income':
        return 'animate-float';
      default:
        return '';
    }
  };

  return (
    <Card className={cn(
      "relative overflow-hidden transition-all duration-500 cursor-pointer group",
      "animate-fade-in-up card-hover",
      getCardStyles()
    )}>
      {/* Animated background effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
      </div>
      
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="text-sm font-medium opacity-90 tracking-wide">
          {title}
        </CardTitle>
        <div className={cn("p-2 rounded-xl backdrop-blur-sm", getIconAnimation())}>
          <Icon className="h-5 w-5 opacity-80" />
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        <div className="space-y-1">
          <div className="text-3xl font-bold tracking-tight">
            {value}
          </div>
          {trend && (
            <div className="flex items-center gap-1">
              <div className={cn(
                "flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium backdrop-blur-sm",
                trend.isPositive 
                  ? 'bg-income/20 text-income border border-income/30' 
                  : 'bg-expense/20 text-expense border border-expense/30'
              )}>
                <span>{trend.isPositive ? '↗' : '↘'}</span>
                <span>{Math.abs(trend.value)}%</span>
              </div>
              <span className="text-xs opacity-60">vs mês anterior</span>
            </div>
          )}
        </div>
      </CardContent>
      
      {/* Subtle gradient overlay */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
    </Card>
  );
}