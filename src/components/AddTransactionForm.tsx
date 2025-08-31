import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Plus, TrendingUp, TrendingDown, Sparkles } from "lucide-react";
import { Transaction } from "@/types/finance";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface AddTransactionFormProps {
  onAddTransaction: (transaction: Omit<Transaction, 'id'>) => void;
}

const EXPENSE_CATEGORIES = [
  'Alimentação', 'Transporte', 'Casa', 'Saúde', 'Educação', 'Lazer', 'Compras', 'Outros'
];

const INCOME_CATEGORIES = [
  'Salário', 'Freelance', 'Investimentos', 'Vendas', 'Bônus', 'Outros'
];

export function AddTransactionForm({ onAddTransaction }: AddTransactionFormProps) {
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [notes, setNotes] = useState('');
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || !category || !description) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha valor, categoria e descrição.",
        variant: "destructive"
      });
      return;
    }

    const transaction: Omit<Transaction, 'id'> = {
      amount: parseFloat(amount),
      type,
      category,
      description,
      date: new Date(),
      notes: notes || undefined
    };

    onAddTransaction(transaction);
    
    // Reset form
    setAmount('');
    setCategory('');
    setDescription('');
    setNotes('');
    
    toast({
      title: "✨ Transação adicionada!",
      description: `${type === 'income' ? 'Receita' : 'Despesa'} de R$ ${amount} registrada com sucesso.`,
    });
  };

  const categories = type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  return (
    <Card className="shadow-elevated border-0 bg-gradient-card backdrop-blur-xl animate-scale-in card-hover group">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3 text-xl font-playfair">
          <div className="p-2 rounded-xl bg-gradient-primary text-primary-foreground animate-pulse-glow">
            <Plus className="h-5 w-5" />
          </div>
          <span className="gradient-text">Nova Transação</span>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Type Selection */}
          <div className="grid grid-cols-2 gap-4">
            <Button
              type="button"
              variant={type === 'income' ? 'default' : 'outline'}
              onClick={() => setType('income')}
              className={cn(
                "h-14 transition-all duration-300 relative overflow-hidden group/btn",
                type === 'income' 
                  ? 'bg-gradient-income hover:shadow-income shadow-income border-0 text-income-foreground' 
                  : 'hover:border-income/50 hover:bg-income-light/20'
              )}
            >
              <div className="flex items-center gap-3">
                <TrendingUp className="h-5 w-5" />
                <span className="font-medium">Receita</span>
              </div>
              {type === 'income' && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
              )}
            </Button>
            
            <Button
              type="button"
              variant={type === 'expense' ? 'default' : 'outline'}
              onClick={() => setType('expense')}
              className={cn(
                "h-14 transition-all duration-300 relative overflow-hidden group/btn",
                type === 'expense' 
                  ? 'bg-gradient-expense hover:shadow-expense shadow-expense border-0 text-expense-foreground' 
                  : 'hover:border-expense/50 hover:bg-expense-light/20'
              )}
            >
              <div className="flex items-center gap-3">
                <TrendingDown className="h-5 w-5" />
                <span className="font-medium">Despesa</span>
              </div>
              {type === 'expense' && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
              )}
            </Button>
          </div>

          {/* Amount Input */}
          <div className="space-y-3">
            <Label htmlFor="amount" className="text-sm font-medium tracking-wide">Valor (R$)</Label>
            <div className="relative">
              <Input
                id="amount"
                type="number"
                step="0.01"
                placeholder="0,00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="h-12 text-lg pl-4 bg-white/50 backdrop-blur-sm border-2 focus:border-primary/50 transition-all duration-300"
                required
              />
              <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                <span className="text-muted-foreground font-medium">R$</span>
              </div>
            </div>
          </div>

          {/* Category Selection */}
          <div className="space-y-3">
            <Label htmlFor="category" className="text-sm font-medium tracking-wide">Categoria</Label>
            <Select value={category} onValueChange={setCategory} required>
              <SelectTrigger className="h-12 bg-white/50 backdrop-blur-sm border-2 focus:border-primary/50">
                <SelectValue placeholder="✨ Selecione uma categoria" />
              </SelectTrigger>
              <SelectContent className="backdrop-blur-xl bg-white/95">
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat} className="hover:bg-primary/10">
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Description Input */}
          <div className="space-y-3">
            <Label htmlFor="description" className="text-sm font-medium tracking-wide">Descrição</Label>
            <Input
              id="description"
              placeholder="Ex: Almoço no restaurante favorito"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="h-12 bg-white/50 backdrop-blur-sm border-2 focus:border-primary/50 transition-all duration-300"
              required
            />
          </div>

          {/* Notes Input */}
          <div className="space-y-3">
            <Label htmlFor="notes" className="text-sm font-medium tracking-wide">Observações (opcional)</Label>
            <Textarea
              id="notes"
              placeholder="Informações adicionais..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="bg-white/50 backdrop-blur-sm border-2 focus:border-primary/50 transition-all duration-300 resize-none"
            />
          </div>

          {/* Submit Button */}
          <Button 
            type="submit" 
            className="w-full h-14 bg-gradient-primary hover:shadow-glow text-lg font-medium transition-all duration-500 relative overflow-hidden group"
          >
            <div className="flex items-center gap-3 relative z-10">
              <Sparkles className="h-5 w-5 animate-pulse" />
              <span>Adicionar Transação</span>
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}