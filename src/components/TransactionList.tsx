import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Transaction } from "@/types/finance";
import { Calendar, FileText, TrendingDown, TrendingUp, Clock } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface TransactionListProps {
  transactions: Transaction[];
  title?: string;
  limit?: number;
}

export function TransactionList({ transactions, title = "Transações Recentes", limit }: TransactionListProps) {
  const displayTransactions = limit ? transactions.slice(0, limit) : transactions;
  const sortedTransactions = [...displayTransactions].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  if (sortedTransactions.length === 0) {
    return (
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Nenhuma transação registrada ainda.</p>
            <p className="text-sm mt-1">Comece adicionando sua primeira transação!</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {sortedTransactions.map((transaction) => (
          <div
            key={transaction.id}
            className="flex items-center justify-between p-4 rounded-lg border bg-gradient-card hover:shadow-md transition-all duration-200"
          >
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-full ${
                transaction.type === 'income' 
                  ? 'bg-income-light text-income' 
                  : 'bg-expense-light text-expense'
              }`}>
                {transaction.type === 'income' ? (
                  <TrendingUp className="h-4 w-4" />
                ) : (
                  <TrendingDown className="h-4 w-4" />
                )}
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-medium">{transaction.description}</h4>
                  <Badge variant="secondary" className="text-xs">
                    {transaction.category}
                  </Badge>
                </div>
                
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  {format(new Date(transaction.date), "dd 'de' MMM, yyyy", { locale: ptBR })}
                </div>
                
                {transaction.notes && (
                  <p className="text-xs text-muted-foreground mt-1 truncate max-w-xs">
                    {transaction.notes}
                  </p>
                )}
              </div>
            </div>
            
            <div className="text-right">
              <div className={`text-lg font-semibold ${
                transaction.type === 'income' ? 'text-income' : 'text-expense'
              }`}>
                {transaction.type === 'income' ? '+' : '-'}R$ {transaction.amount.toFixed(2)}
              </div>
            </div>
          </div>
        ))}
        
        {limit && transactions.length > limit && (
          <div className="text-center pt-4">
            <p className="text-sm text-muted-foreground">
              Mostrando {limit} de {transactions.length} transações
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}