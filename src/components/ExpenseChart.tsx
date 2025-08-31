import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { Transaction } from "@/types/finance";
import { PieChart as PieChartIcon, Sparkles, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface ExpenseChartProps {
  transactions: Transaction[];
}

const COLORS = [
  'hsl(142, 76%, 36%)', // income green
  'hsl(0, 84%, 60%)',   // expense red  
  'hsl(217, 91%, 60%)', // neutral blue
  'hsl(262, 83%, 58%)', // primary purple
  'hsl(45, 93%, 47%)',  // warning yellow
  'hsl(173, 80%, 40%)', // teal
  'hsl(43, 74%, 66%)',  // amber
  'hsl(339, 82%, 52%)', // pink
];

export function ExpenseChart({ transactions }: ExpenseChartProps) {
  const expenses = transactions.filter(t => t.type === 'expense');
  
  if (expenses.length === 0) {
    return (
  <Card className="shadow-elevated border-0 bg-white/80 dark:bg-black/80 backdrop-blur-xl animate-scale-in">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-xl font-playfair">
            <div className="p-2 rounded-xl bg-gradient-primary text-primary-foreground animate-pulse-glow">
              <PieChartIcon className="h-5 w-5" />
            </div>
            <span className="gradient-text">Distribuição de Gastos</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 space-y-4">
            <div className="relative">
              <PieChartIcon className="h-16 w-16 mx-auto text-muted-foreground/50 animate-float" />
              <Sparkles className="h-6 w-6 absolute -top-2 -right-2 text-primary animate-pulse" />
            </div>
            <div className="space-y-2">
              <p className="text-lg font-medium text-muted-foreground">Nenhuma despesa registrada ainda</p>
              <p className="text-sm text-muted-foreground/70">
                Adicione algumas despesas para ver a distribuição dos seus gastos! ✨
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Group expenses by category
  const categoryTotals = expenses.reduce((acc, transaction) => {
    acc[transaction.category] = (acc[transaction.category] || 0) + transaction.amount;
    return acc;
  }, {} as Record<string, number>);

  // Convert to chart data format
  const chartData = Object.entries(categoryTotals)
    .map(([category, amount]) => ({
      name: category,
      value: amount,
      percentage: 0 // Will be calculated below
    }))
    .sort((a, b) => b.value - a.value);

  // Calculate percentages
  const total = chartData.reduce((sum, item) => sum + item.value, 0);
  chartData.forEach(item => {
    item.percentage = Math.round((item.value / total) * 100);
  });

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div
          className="bg-card/95 backdrop-blur-xl border border-border/50 rounded-xl p-4 shadow-elevated"
          style={{ maxWidth: 180, minWidth: 120, pointerEvents: 'auto', wordBreak: 'break-word' }}
        >
          <p className="font-semibold text-base mb-2">{data.name}</p>
          <div className="space-y-1">
            <p className="text-expense font-bold text-lg">
              R$ {data.value.toFixed(2)}
            </p>
            <p className="text-sm text-muted-foreground">
              {data.percentage}% do total de gastos
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  const CustomLegend = ({ payload }: any) => {
    return (
      <div className="flex flex-wrap justify-center gap-2 mt-4">
        {payload?.map((entry: any, index: number) => (
          <div
            key={index}
            className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/60 backdrop-blur-sm border border-white/40 text-xs font-medium"
          >
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span>{entry.value} ({entry.payload.percentage}%)</span>
          </div>
        ))}
      </div>
    );
  };

  return (
  <Card className="shadow-elevated border-0 bg-white/80 dark:bg-black/80 backdrop-blur-xl animate-scale-in">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-xl font-playfair">
          <div className="p-2 rounded-xl bg-gradient-primary text-primary-foreground animate-pulse-glow">
            <PieChartIcon className="h-5 w-5" />
          </div>
          <span className="gradient-text">Distribuição de Gastos</span>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="pt-4">
        <div className="h-80 relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={130}
                paddingAngle={3}
                dataKey="value"
                className="animate-fade-in"
              >
                {chartData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={COLORS[index % COLORS.length]}
                    stroke="white"
                    strokeWidth={3}
                    className="hover:opacity-80 transition-opacity duration-300"
                  />
                ))}
              </Pie>
              <Tooltip 
                content={<CustomTooltip />} 
                wrapperStyle={{ zIndex: 50, pointerEvents: 'auto' }}
                cursor={{ fill: 'rgba(0,0,0,0.04)' }}
              />
            </PieChart>
          </ResponsiveContainer>
          
          {/* Center content */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center space-y-1">
              <div className="text-sm text-muted-foreground font-medium">Total</div>
              <div className="text-2xl font-bold text-expense">
                R$ {total.toFixed(2)}
              </div>
            </div>
          </div>
        </div>
        
        <CustomLegend payload={chartData.map((item, index) => ({
          value: item.name,
          color: COLORS[index % COLORS.length],
          payload: item
        }))} />
        
        <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-expense/10 to-primary/10 backdrop-blur-sm border border-expense/20">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-expense/20">
              <TrendingUp className="h-4 w-4 text-expense" />
            </div>
            <div>
              <p className="text-sm font-medium">Análise de Gastos</p>
              <p className="text-xs text-muted-foreground">
                Maior categoria: <span className="font-semibold text-expense">
                  {chartData[0]?.name} (R$ {chartData[0]?.value.toFixed(2)})
                </span>
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}