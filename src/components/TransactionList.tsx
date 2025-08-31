import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Transaction } from "@/types/finance";
import { Calendar, FileText, TrendingDown, TrendingUp, Clock, Sparkles } from "lucide-react";
import { Pencil, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";

interface TransactionListProps {
  transactions: Transaction[];
  title?: string;
  limit?: number;
  onEditTransaction?: (transaction: Transaction) => void;
  onDeleteTransaction?: (id: string) => void;
}

export function TransactionList({ transactions, title = "Transações Recentes", limit, onEditTransaction, onDeleteTransaction }: TransactionListProps) {
  const displayTransactions = limit ? transactions.slice(0, limit) : transactions;
  const sortedTransactions = [...displayTransactions].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  if (sortedTransactions.length === 0) {
    return (
      <Card className="shadow-elevated border-0 bg-gradient-card dark:bg-gradient-to-br dark:from-background dark:to-secondary/40 backdrop-blur-xl animate-fade-in">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-xl font-playfair">
            <div className="p-2 rounded-xl bg-gradient-primary text-primary-foreground animate-pulse-glow">
              <Clock className="h-5 w-5" />
            </div>
            <span className="gradient-text">{title}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 space-y-4">
            <div className="relative">
              <FileText className="h-16 w-16 mx-auto text-muted-foreground/50 animate-float" />
              <Sparkles className="h-6 w-6 absolute -top-2 -right-2 text-primary animate-pulse" />
            </div>
            <div className="space-y-2">
              <p className="text-lg font-medium text-muted-foreground">Nenhuma transação registrada ainda</p>
              <p className="text-sm text-muted-foreground/70">
                Comece adicionando sua primeira transação e acompanhe suas finanças! ✨
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
  <Card className="shadow-elevated border-0 bg-gradient-card dark:bg-gradient-to-br dark:from-background dark:to-secondary/40 backdrop-blur-xl animate-fade-in">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-xl font-playfair">
          <div className="p-2 rounded-xl bg-gradient-primary text-primary-foreground animate-pulse-glow">
            <Clock className="h-5 w-5" />
          </div>
          <span className="gradient-text">{title}</span>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="space-y-3">
          {sortedTransactions.map((transaction, index) => (
            <div
              key={transaction.id}
              className={cn(
                // Layout responsivo: coluna no mobile, linha no desktop
                "group flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0 p-3 sm:p-4 rounded-xl border transition-all duration-300",
                "bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm hover:shadow-card hover:scale-[1.01] cursor-pointer",
                "animate-fade-in-up border-border/50 hover:border-primary/30"
              )}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-center gap-3 sm:gap-4">
                <div className={cn(
                  "p-2 sm:p-3 rounded-xl transition-all duration-300 group-hover:scale-110",
                  transaction.type === 'income' 
                    ? 'bg-gradient-income text-income-foreground shadow-income/30' 
                    : 'bg-gradient-expense text-expense-foreground shadow-expense/30'
                )}>
                  {transaction.type === 'income' ? (
                    <TrendingUp className="h-5 w-5" />
                  ) : (
                    <TrendingDown className="h-5 w-5" />
                  )}
                </div>
                <div className="flex-1 space-y-1 sm:space-y-2">
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-1">
                    <h4 className="font-semibold text-sm sm:text-base group-hover:text-primary transition-colors">
                      {transaction.description}
                    </h4>
                    <Badge 
                      variant="secondary" 
                      className="text-xs px-2 sm:px-3 py-1 bg-white/60 backdrop-blur-sm border border-white/40 hover:bg-primary/10 transition-colors"
                    >
                      {transaction.category}
                    </Badge>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>{format(new Date(transaction.date), "dd 'de' MMM, yyyy", { locale: ptBR })}</span>
                    </div>
                  </div>
                  {transaction.notes && (
                    <p className="text-xs text-muted-foreground/80 bg-white/30 backdrop-blur-sm px-2 sm:px-3 py-1 rounded-lg max-w-full sm:max-w-xs truncate">
                      💭 {transaction.notes}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex flex-row sm:flex-col items-end sm:items-end justify-between sm:justify-end gap-2 sm:gap-1 mt-2 sm:mt-0">
                <span className={cn(
                  "text-base sm:text-xl font-bold transition-all duration-300",
                  transaction.type === 'income' 
                    ? 'text-income group-hover:text-income' 
                    : 'text-expense group-hover:text-expense'
                )}>
                  {transaction.type === 'income' ? '+' : '-'}R$ {transaction.amount.toFixed(2)}
                </span>
                <div className="flex gap-1">
                  <button
                    className="p-1 rounded hover:bg-primary/10 transition-colors"
                    title="Editar transação"
                    onClick={() => onEditTransaction && onEditTransaction(transaction)}
                  >
                    <Pencil className="h-4 w-4 text-primary" />
                  </button>
                  <button
                    className="p-1 rounded hover:bg-expense/10 transition-colors"
                    title="Deletar transação"
                    onClick={() => onDeleteTransaction && onDeleteTransaction(transaction.id)}
                  >
                    <Trash2 className="h-4 w-4 text-expense" />
                  </button>
                </div>
                <div className="text-xs text-muted-foreground text-right sm:text-left">
                  {transaction.type === 'income' ? '💰 Receita' : '💸 Despesa'}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {limit && transactions.length > limit && (
          <div className="text-center pt-6 border-t border-border/30">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-primary/10 backdrop-blur-sm border border-primary/20">
              <Sparkles className="h-4 w-4 text-primary animate-pulse" />
              <p className="text-sm font-medium text-primary">
                Mostrando {limit} de {transactions.length} transações
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}