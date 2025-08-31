import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Home, AlertCircle, Sparkles } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/30 relative overflow-hidden flex items-center justify-center p-6">
      {/* Animated background mesh */}
      <div className="fixed inset-0 pointer-events-none">
        <div 
          className="absolute inset-0 opacity-20"
          style={{ 
            background: 'var(--gradient-mesh)'
          }}
        />
      </div>

      <Card className="relative z-10 shadow-elevated border-0 bg-gradient-card backdrop-blur-xl animate-scale-in max-w-md w-full">
        <CardContent className="p-8 text-center space-y-6">
          {/* Animated Icon */}
          <div className="relative">
            <div className="w-24 h-24 mx-auto rounded-full bg-gradient-primary/10 backdrop-blur-sm border border-primary/20 flex items-center justify-center animate-pulse-glow">
              <AlertCircle className="h-12 w-12 text-primary animate-float" />
            </div>
            <Sparkles className="h-6 w-6 absolute -top-2 -right-2 text-primary animate-pulse" />
          </div>

          {/* Error Content */}
          <div className="space-y-4">
            <h1 className="text-6xl font-bold font-playfair gradient-text">
              404
            </h1>
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold font-playfair text-foreground">
                Página não encontrada
              </h2>
              <p className="text-muted-foreground font-inter leading-relaxed">
                Oops! A página que você está procurando não existe ou foi movida. 
                Que tal voltar para o controle financeiro?
              </p>
            </div>
          </div>

          {/* Action Button */}
          <Button 
            asChild
            className="w-full h-12 bg-gradient-primary hover:shadow-glow text-lg font-medium transition-all duration-500 relative overflow-hidden group"
          >
            <a href="/">
              <div className="flex items-center justify-center gap-3 relative z-10">
                <Home className="h-5 w-5" />
                <span>Voltar ao Dashboard</span>
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
            </a>
          </Button>

          {/* Additional Info */}
          <div className="pt-4 border-t border-border/30">
            <p className="text-xs text-muted-foreground">
              Rota solicitada: <code className="px-2 py-1 rounded bg-muted/50 font-mono">{location.pathname}</code>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotFound;