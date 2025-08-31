import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface AdvancedReportsProps {
  monthlyData: Array<{ month: string; income: number; expenses: number; balance: number }>;
}

export function AdvancedReports({ monthlyData }: AdvancedReportsProps) {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Relatórios Avançados</CardTitle>
      </CardHeader>
      <CardContent>
        <table className="w-full text-sm">
          <thead>
            <tr>
              <th>Mês</th>
              <th>Receitas</th>
              <th>Despesas</th>
              <th>Economia</th>
            </tr>
          </thead>
          <tbody>
            {monthlyData.map((row, i) => (
              <tr key={i} className="text-center">
                <td>{row.month}</td>
                <td className="text-income">R$ {row.income.toFixed(2)}</td>
                <td className="text-expense">R$ {row.expenses.toFixed(2)}</td>
                <td className={row.balance >= 0 ? "text-income" : "text-expense"}>R$ {row.balance.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}
