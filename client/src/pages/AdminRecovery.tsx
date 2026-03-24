import { useState } from 'react';
import { trpc } from '@/lib/trpc';
import { toast } from 'sonner';
import { useLocation } from 'wouter';
import { Mail, MessageCircle, ArrowLeft, Copy, Check } from 'lucide-react';

type RecoveryStep = 'method' | 'code' | 'reset';

export default function AdminRecovery() {
  const [step, setStep] = useState<RecoveryStep>('method');
  const [method, setMethod] = useState<'email' | 'whatsapp'>('email');
  const [recoveryCode, setRecoveryCode] = useState('');
  const [displayCode, setDisplayCode] = useState('');
  const [recoveryToken, setRecoveryToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [copied, setCopied] = useState(false);
  const [, setLocation] = useLocation();

  const requestRecoveryMutation = trpc.admin.requestRecovery.useMutation();
  const resetPasswordMutation = trpc.admin.resetPassword.useMutation();

  const handleRequestRecovery = async (selectedMethod: 'email' | 'whatsapp') => {
    try {
      const result = await requestRecoveryMutation.mutateAsync({ method: selectedMethod });
      setMethod(selectedMethod);
      setDisplayCode(result.code);
      setRecoveryToken(result.token);
      toast.success(`Código de recuperación generado`);
      setStep('code');
    } catch (error) {
      toast.error('Error al solicitar recuperación');
    }
  };

  const handleVerifyCode = () => {
    if (!recoveryCode) {
      toast.error('Por favor ingresa el código');
      return;
    }
    if (recoveryCode !== displayCode) {
      toast.error('Código incorrecto');
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
      await resetPasswordMutation.mutateAsync({ token: recoveryToken, newPassword });
      toast.success('¡Contraseña actualizada! Inicia sesión con tu nueva contraseña');
      setLocation('/admin/login');
    } catch (error) {
      toast.error('Error al actualizar contraseña');
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(displayCode);
    setCopied(true);
    toast.success('Código copiado al portapapeles');
    setTimeout(() => setCopied(false), 2000);
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
                onClick={() => handleRequestRecovery('email')}
                disabled={requestRecoveryMutation.isPending}
                className="w-full flex items-center gap-4 p-4 border-2 border-border rounded-lg hover:border-primary hover:bg-primary/5 transition-all disabled:opacity-50"
              >
                <Mail size={24} className="text-primary" />
                <div className="text-left">
                  <p className="font-semibold text-foreground">Por Email</p>
                  <p className="text-sm text-muted-foreground">Recibirás un código en pantalla</p>
                </div>
              </button>

              <button
                onClick={() => handleRequestRecovery('whatsapp')}
                disabled={requestRecoveryMutation.isPending}
                className="w-full flex items-center gap-4 p-4 border-2 border-border rounded-lg hover:border-primary hover:bg-primary/5 transition-all disabled:opacity-50"
              >
                <MessageCircle size={24} className="text-green-500" />
                <div className="text-left">
                  <p className="font-semibold text-foreground">Por WhatsApp</p>
                  <p className="text-sm text-muted-foreground">Recibirás un código en pantalla</p>
                </div>
              </button>
            </div>
          )}

          {step === 'code' && (
            <div className="space-y-6">
              <div>
                <p className="text-sm text-muted-foreground mb-4">
                  Tu código de recuperación es:
                </p>
                <div className="bg-primary/10 border-2 border-primary rounded-lg p-6 text-center">
                  <p className="text-4xl font-bold text-primary tracking-widest mb-4">
                    {displayCode}
                  </p>
                  <button
                    onClick={copyToClipboard}
                    className="flex items-center justify-center gap-2 w-full bg-primary text-white font-semibold py-2 rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    {copied ? (
                      <>
                        <Check size={20} />
                        Copiado
                      </>
                    ) : (
                      <>
                        <Copy size={20} />
                        Copiar Código
                      </>
                    )}
                  </button>
                </div>
                <p className="text-xs text-muted-foreground text-center mt-4">
                  Este código expira en 30 minutos
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Ingresa el código
                </label>
                <input
                  type="text"
                  value={recoveryCode}
                  onChange={(e) => setRecoveryCode(e.target.value.toUpperCase())}
                  placeholder="000000"
                  maxLength={6}
                  className="w-full px-4 py-3 border-2 border-border rounded-lg focus:outline-none focus:border-primary transition-colors text-center text-2xl tracking-widest"
                />
              </div>

              <button
                onClick={handleVerifyCode}
                className="w-full bg-primary text-white font-bold py-3 rounded-lg hover:bg-primary/90 transition-colors"
              >
                Verificar Código
              </button>
            </div>
          )}

          {step === 'reset' && (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
                <p className="text-green-800 font-semibold">✓ Código verificado correctamente</p>
              </div>

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
