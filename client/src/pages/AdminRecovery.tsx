import { useState } from 'react';
import { trpc } from '@/lib/trpc';
import { toast } from 'sonner';
import { useLocation } from 'wouter';
import { Mail, MessageCircle, ArrowLeft } from 'lucide-react';

type RecoveryStep = 'method' | 'token' | 'reset';

export default function AdminRecovery() {
  const [step, setStep] = useState<RecoveryStep>('method');
  const [method, setMethod] = useState<'email' | 'whatsapp'>('email');
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [, setLocation] = useLocation();

  const requestRecoveryMutation = trpc.admin.requestRecovery.useMutation();
  const resetPasswordMutation = trpc.admin.resetPassword.useMutation();

  const handleRequestRecovery = async () => {
    try {
      const result = await requestRecoveryMutation.mutateAsync({ method });
      toast.success(`Código enviado a ${result.contact}`);
      setStep('token');
    } catch (error) {
      toast.error('Error al solicitar recuperación');
    }
  };

  const handleVerifyToken = () => {
    if (!token) {
      toast.error('Por favor ingresa el código');
      return;
    }
    setStep('reset');
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || !confirmPassword) {
      toast.error('Por favor completa todos los campos');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('Las contraseñas no coinciden');
      return;
    }
    if (newPassword.length < 6) {
      toast.error('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    try {
      await resetPasswordMutation.mutateAsync({ token, newPassword });
      toast.success('¡Contraseña actualizada! Inicia sesión con tu nueva contraseña');
      setLocation('/admin/login');
    } catch (error) {
      toast.error('Error al actualizar contraseña');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Recuperar Acceso</h1>
          <p className="text-accent/80">Fichi's BBQ - Panel de Admin</p>
        </div>

        {/* Recovery Form */}
        <div className="bg-white rounded-lg shadow-2xl p-8">
          {step === 'method' && (
            <div className="space-y-4">
              <p className="text-foreground font-semibold mb-6">
                ¿Cómo deseas recuperar tu acceso?
              </p>

              <button
                onClick={() => {
                  setMethod('email');
                  handleRequestRecovery();
                }}
                disabled={requestRecoveryMutation.isPending}
                className="w-full flex items-center gap-4 p-4 border-2 border-border rounded-lg hover:border-primary hover:bg-primary/5 transition-all disabled:opacity-50"
              >
                <Mail size={24} className="text-primary" />
                <div className="text-left">
                  <p className="font-semibold text-foreground">Por Email</p>
                  <p className="text-sm text-muted-foreground">Recibirás un código en tu email</p>
                </div>
              </button>

              <button
                onClick={() => {
                  setMethod('whatsapp');
                  handleRequestRecovery();
                }}
                disabled={requestRecoveryMutation.isPending}
                className="w-full flex items-center gap-4 p-4 border-2 border-border rounded-lg hover:border-primary hover:bg-primary/5 transition-all disabled:opacity-50"
              >
                <MessageCircle size={24} className="text-green-500" />
                <div className="text-left">
                  <p className="font-semibold text-foreground">Por WhatsApp</p>
                  <p className="text-sm text-muted-foreground">Recibirás un código por WhatsApp</p>
                </div>
              </button>
            </div>
          )}

          {step === 'token' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Código de Recuperación
                </label>
                <input
                  type="text"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  placeholder="Ingresa el código que recibiste"
                  className="w-full px-4 py-3 border-2 border-border rounded-lg focus:outline-none focus:border-primary transition-colors"
                />
              </div>

              <button
                onClick={handleVerifyToken}
                className="w-full bg-primary text-white font-bold py-3 rounded-lg hover:bg-primary/90 transition-colors"
              >
                Verificar Código
              </button>
            </div>
          )}

          {step === 'reset' && (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Nueva Contraseña
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Ingresa tu nueva contraseña"
                  className="w-full px-4 py-3 border-2 border-border rounded-lg focus:outline-none focus:border-primary transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Confirmar Contraseña
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirma tu nueva contraseña"
                  className="w-full px-4 py-3 border-2 border-border rounded-lg focus:outline-none focus:border-primary transition-colors"
                />
              </div>

              <button
                type="submit"
                disabled={resetPasswordMutation.isPending}
                className="w-full bg-primary text-white font-bold py-3 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                {resetPasswordMutation.isPending ? 'Actualizando...' : 'Actualizar Contraseña'}
              </button>
            </form>
          )}

          {/* Back Button */}
          <button
            onClick={() => {
              if (step === 'method') {
                setLocation('/admin/login');
              } else {
                setStep('method');
              }
            }}
            className="w-full flex items-center justify-center gap-2 mt-6 text-primary hover:text-primary/80 transition-colors font-semibold"
          >
            <ArrowLeft size={20} />
            Volver
          </button>
        </div>
      </div>
    </div>
  );
}
