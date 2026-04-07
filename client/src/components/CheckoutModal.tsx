import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CheckoutData) => void;
  totalPrice: number;
}

export interface CheckoutData {
  nombre: string;
  telefono: string;
  direccion: string;
  formaPago: 'efectivo' | 'tarjeta' | 'transferencia' | 'nequi';
  hora: string;
}

const paymentMethods = [
  { id: 'efectivo', label: 'Efectivo', icon: '💵' },
  { id: 'tarjeta', label: 'Tarjeta', icon: '💳' },
  { id: 'transferencia', label: 'Transferencia', icon: '🏦' },
  { id: 'nequi', label: 'Nequi', icon: '💎' },
];

export default function CheckoutModal({ isOpen, onClose, onSubmit, totalPrice }: CheckoutModalProps) {
  const [formData, setFormData] = useState<CheckoutData>({
    nombre: '',
    telefono: '',
    direccion: '',
    formaPago: 'efectivo',
    hora: '',
  });

  const [errors, setErrors] = useState<Partial<CheckoutData>>({});

  // Cerrar con Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, onClose]);

  const validateForm = () => {
    const newErrors: Partial<CheckoutData> = {};

    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es requerido';
    }
    if (!formData.telefono.trim()) {
      newErrors.telefono = 'El teléfono es requerido';
    }
    if (!formData.direccion.trim()) {
      newErrors.direccion = 'La dirección es requerida';
    }
    if (!formData.hora) {
      newErrors.hora = 'La hora es requerida';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      let submitted = false;
      
      // Play alert sound before submitting
      const audio = new Audio('https://d2xsxph8kpxj0f.cloudfront.net/310519663461231402/ZAf6EHxtQifi3Kavc8aaUS/Excelente-gracias_9486508b.mp3');
      
      const submitOrder = () => {
        if (!submitted) {
          submitted = true;
          onSubmit(formData);
          setFormData({
            nombre: '',
            telefono: '',
            direccion: '',
            formaPago: 'efectivo',
            hora: '',
          });
          setErrors({});
        }
      };
      
      audio.play().catch(err => {
        console.error('Error playing audio:', err);
        // If audio fails, submit immediately
        submitOrder();
      });
      
      // Submit after audio ends
      audio.onended = () => {
        submitOrder();
      };
      
      // Fallback: submit after 3 seconds if audio doesn't end
      setTimeout(() => {
        submitOrder();
      }, 3000);
    }
  };

  if (!isOpen) return null;

  const selectedPaymentLabel = paymentMethods.find(m => m.id === formData.formaPago)?.label || 'Efectivo';

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9998] p-4" onClick={onClose}>
      <div 
        className="bg-white rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden border-4 border-primary"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-white border-b-4 border-primary px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-primary">Por favor indique lo siguiente:</h2>
          <button
            onClick={onClose}
            className="hover:bg-primary/10 p-2 rounded-lg transition-colors text-primary"
            title="Cerrar"
          >
            <X size={24} />
          </button>
        </div>

        {/* Form Content */}
        <div className="p-6 space-y-3">
          {/* Name and Hour Row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-primary mb-1">
                * Nombre:
              </label>
              <input
                type="text"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                className="w-full px-2 py-2 rounded-lg border-2 border-primary/30 focus:border-primary focus:outline-none text-foreground text-sm"
                placeholder="Tu nombre"
              />
              {errors.nombre && <p className="text-red-500 text-xs mt-1">{errors.nombre}</p>}
            </div>
            <div>
              <label className="block text-xs font-bold text-primary mb-1">
                * Hora:
              </label>
              <input
                type="time"
                value={formData.hora}
                onChange={(e) => setFormData({ ...formData, hora: e.target.value })}
                className="w-full px-2 py-2 rounded-lg border-2 border-primary/30 focus:border-primary focus:outline-none text-foreground text-sm"
              />
              {errors.hora && <p className="text-red-500 text-xs mt-1">{errors.hora}</p>}
            </div>
          </div>

          {/* Phone */}
          <div>
            <label className="block text-xs font-bold text-primary mb-1">
              * Teléfono:
            </label>
            <input
              type="tel"
              value={formData.telefono}
              onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
              className="w-full px-2 py-2 rounded-lg border-2 border-primary/30 focus:border-primary focus:outline-none text-foreground text-sm"
              placeholder="573001234567"
            />
            {errors.telefono && <p className="text-red-500 text-xs mt-1">{errors.telefono}</p>}
          </div>

          {/* Address */}
          <div>
            <label className="block text-xs font-bold text-primary mb-1">
              * Dirección:
            </label>
            <input
              type="text"
              value={formData.direccion}
              onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
              className="w-full px-2 py-2 rounded-lg border-2 border-primary/30 focus:border-primary focus:outline-none text-foreground text-sm"
              placeholder="Calle 47B # 27 - 06"
            />
            {errors.direccion && <p className="text-red-500 text-xs mt-1">{errors.direccion}</p>}
          </div>

          {/* Payment Methods Grid */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-bold text-primary">
                * Forma de pago:
              </label>
              <span className="text-xs font-semibold text-primary bg-primary/10 px-3 py-1 rounded-lg">
                {selectedPaymentLabel}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {paymentMethods.map((method) => (
                <button
                  key={method.id}
                  onClick={() => setFormData({ ...formData, formaPago: method.id as any })}
                  className={`p-2 rounded-lg border-2 transition-all font-semibold text-xs flex items-center justify-center gap-1 ${
                    formData.formaPago === method.id
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-primary/30 bg-white text-primary hover:border-primary/50'
                  }`}
                >
                  <span>{method.icon}</span>
                  <span>{method.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="bg-white border-t-4 border-primary px-6 py-4 flex gap-3">
          <Button
            onClick={onClose}
            className="flex-1 bg-red-600 text-white hover:bg-red-700 border-0 font-bold text-sm rounded-lg"
          >
            ✕ Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            className="flex-1 bg-green-600 text-white hover:bg-green-700 font-bold text-sm rounded-lg"
          >
            Listo
          </Button>
        </div>
      </div>
    </div>
  );
}
