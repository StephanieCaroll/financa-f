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
        return 'border-income/20 bg-gradient-income text-income-foreground shadow-income';
      case 'expense':
        return 'border-expense/20 bg-gradient-expense text-expense-foreground shadow-expense';
      case 'balance':
        return 'border-primary/20 bg-gradient-primary text-primary-foreground shadow-elevated';
      default:
        return 'border-neutral/20 bg-gradient-card shadow-card';
    }
  };

  const getTrendColor = () => {
    if (!trend) return '';
    return trend.isPositive ? 'text-income' : 'text-expense';
  };

  return (
    <Card className={cn("relative overflow-hidden transition-all duration-300 hover:scale-105", getCardStyles())}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium opacity-90">
          {title}
        </CardTitle>
        <Icon className="h-4 w-4 opacity-80" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold mb-1">
          {value}
        </div>
        {trend && (
          <p className={cn("text-xs opacity-80", getTrendColor())}>
            {trend.isPositive ? '+' : ''}{trend.value}% do mês anterior
          </p>
        )}
      </CardContent>
    </Card>
  );
}