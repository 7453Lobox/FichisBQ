import { useState } from 'react';
import { trpc } from '@/lib/trpc';
import { toast } from 'sonner';
import { useLocation } from 'wouter';
import { Lock, Eye, EyeOff } from 'lucide-react';

export default function AdminLogin() {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [, setLocation] = useLocation();
  const loginMutation = trpc.admin.login.useMutation();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) {
      toast.error('Por favor ingresa la contraseña');
      return;
    }

    try {
      await loginMutation.mutateAsync({ password });
      toast.success('¡Acceso concedido!');
      // Redirect to orders panel after successful login
      setLocation('/admin/pedidos-fichi-bbq');
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Contraseña incorrecta');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-accent rounded-full mb-4">
            <Lock size={32} className="text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Panel de Admin</h1>
          <p className="text-accent/80">Fichi's BBQ - Gestión de Pedidos</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="bg-white rounded-lg shadow-2xl p-8 space-y-6">
          <div>
            <label htmlFor="password" className="block text-sm font-semibold text-foreground mb-2">
              Contraseña
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Ingresa tu contraseña"
                className="w-full px-4 py-3 border-2 border-border rounded-lg focus:outline-none focus:border-primary transition-colors"
                disabled={loginMutation.isPending}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loginMutation.isPending}
            className="w-full bg-primary text-white font-bold py-3 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loginMutation.isPending ? 'Verificando...' : 'Acceder'}
          </button>

          <div className="border-t border-border pt-6">
            <p className="text-sm text-muted-foreground text-center mb-4">
              ¿Olvidaste tu contraseña?
            </p>
            <a
              href="/admin/recuperar"
              className="block w-full text-center px-4 py-2 border-2 border-accent text-accent font-semibold rounded-lg hover:bg-accent/10 transition-colors"
            >
              Recuperar Acceso
            </a>
          </div>
        </form>

        {/* Footer */}
        <p className="text-center text-white/60 text-sm mt-8">
          Esta es una zona privada. Solo personal autorizado.
        </p>
      </div>
    </div>
  );
}
