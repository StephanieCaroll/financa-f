// ...existing code...
import { useAiAdvice } from "@/hooks/useAiAdvice";

interface SmartAlertsProps {
  alerts: string[];
  budgets: { category: string; limit: number }[];
  budgetProgress: Record<string, number>;
  transactions: any[];
}

export function SmartAlerts({ alerts, budgets, budgetProgress, transactions }: SmartAlertsProps) {
  const { advice, loading, error } = useAiAdvice({ budgets, budgetProgress, transactions });
  return (
    <>
      <p className="text-sm text-muted-foreground mb-2">
        Notificações automáticas quando você se aproxima dos limites de orçamento.
      </p>
      <hr className="my-4 border-muted-foreground/20" />
      {advice && (
        <div className="mb-4 p-3 rounded-lg bg-primary/10 text-primary font-medium whitespace-pre-line border border-primary/20">
          💡 {advice}
        </div>
      )}
      {loading && <div className="mb-2 text-xs text-muted-foreground">Consultando IA...</div>}
      {error && <div className="mb-2 text-xs text-red-500">Erro IA: {error}</div>}
      {alerts.length === 0 && !advice && !loading ? (
        <div className="text-muted-foreground">Nenhum alerta no momento.</div>
      ) : alerts.length > 0 ? (
        <ul className="list-disc pl-6 space-y-1">
          {alerts.map((alert, i) => (
            <li key={i} className="text-expense font-medium">{alert}</li>
          ))}
        </ul>
      ) : null}
    </>
  );
}
