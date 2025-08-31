import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { Transaction } from "@/types/finance";
import { PieChart as PieChartIcon } from "lucide-react";

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
  // Filter only expenses for the chart
  const expenses = transactions.filter(t => t.type === 'expense');
  
  if (expenses.length === 0) {
    return (
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PieChartIcon className="h-5 w-5" />
            Distribuição de Gastos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <PieChartIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Nenhuma despesa registrada ainda.</p>
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
        <div className="bg-card border rounded-lg p-3 shadow-lg">
          <p className="font-medium">{data.name}</p>
          <p className="text-expense font-semibold">
            R$ {data.value.toFixed(2)}
          </p>
          <p className="text-sm text-muted-foreground">
            {data.percentage}% do total
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PieChartIcon className="h-5 w-5" />
          Distribuição de Gastos
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={120}
                paddingAngle={2}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={COLORS[index % COLORS.length]}
                    stroke="white"
                    strokeWidth={2}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                verticalAlign="bottom" 
                height={36}
                formatter={(value: string, entry: any) => 
                  `${value} (${entry.payload.percentage}%)`
                }
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        <div className="mt-4 space-y-2">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Total de Gastos</p>
            <p className="text-2xl font-bold text-expense">
              R$ {total.toFixed(2)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}