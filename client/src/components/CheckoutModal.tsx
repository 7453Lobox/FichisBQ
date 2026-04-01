import { useState } from 'react';
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

export default function CheckoutModal({ isOpen, onClose, onSubmit, totalPrice }: CheckoutModalProps) {
  const [formData, setFormData] = useState<CheckoutData>({
    nombre: '',
    telefono: '',
    direccion: '',
    formaPago: 'efectivo',
    hora: '',
  });

  const [errors, setErrors] = useState<Partial<CheckoutData>>({});

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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9997] p-4">
      <div className="bg-primary dark:bg-primary rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground p-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold">Por favor indique lo siguiente:</h2>
          <button
            onClick={onClose}
            className="hover:bg-white/20 p-2 rounded-lg transition-colors"
            title="Cerrar"
          >
            <X size={24} />
          </button>
        </div>

        {/* Form Content */}
        <div className="p-6 space-y-4">
          {/* Name and Hour Row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-primary-foreground mb-2">
                * Nombre:
              </label>
              <input
                type="text"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border-2 border-accent/30 focus:border-accent focus:outline-none text-foreground"
                placeholder="Tu nombre"
              />
              {errors.nombre && <p className="text-red-500 text-xs mt-1">{errors.nombre}</p>}
            </div>
            <div>
              <label className="block text-sm font-bold text-primary-foreground mb-2">
                * Hora:
              </label>
              <input
                type="time"
                value={formData.hora}
                onChange={(e) => setFormData({ ...formData, hora: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border-2 border-accent/30 focus:border-accent focus:outline-none text-foreground"
              />
              {errors.hora && <p className="text-red-500 text-xs mt-1">{errors.hora}</p>}
            </div>
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-bold text-primary-foreground mb-2">
              * Teléfono:
            </label>
            <input
              type="tel"
              value={formData.telefono}
              onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border-2 border-accent/30 focus:border-accent focus:outline-none text-foreground"
              placeholder="573001234567"
            />
            {errors.telefono && <p className="text-red-500 text-xs mt-1">{errors.telefono}</p>}
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-bold text-primary-foreground mb-2">
              * Dirección:
            </label>
            <input
              type="text"
              value={formData.direccion}
              onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border-2 border-accent/30 focus:border-accent focus:outline-none text-foreground"
              placeholder="Calle 47B # 27 - 06"
            />
            {errors.direccion && <p className="text-red-500 text-xs mt-1">{errors.direccion}</p>}
          </div>

          {/* Payment Methods Grid */}
          <div>
            <label className="block text-sm font-bold text-primary-foreground mb-3">
              * Forma de pago:
            </label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { id: 'efectivo', label: 'Efectivo', icon: '💵' },
                { id: 'tarjeta', label: 'Tarjeta', icon: '💳' },
                { id: 'transferencia', label: 'Transferencia', icon: '🏦' },
                { id: 'nequi', label: 'Nequi', icon: '💎' },
              ].map((method) => (
                <button
                  key={method.id}
                  onClick={() => setFormData({ ...formData, formaPago: method.id as any })}
                  className={`p-3 rounded-lg border-2 transition-all font-semibold text-sm flex items-center justify-center gap-2 ${
                    formData.formaPago === method.id
                      ? 'border-accent bg-accent/20 text-primary-foreground'
                      : 'border-accent/30 bg-white/10 text-primary-foreground hover:border-accent/50'
                  }`}
                >
                  <span>{method.icon}</span>
                  <span>{method.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Total Price */}
          <div className="bg-white/10 rounded-lg p-4 text-center">
            <p className="text-primary-foreground/80 text-sm mb-1">Total a pagar:</p>
            <p className="text-3xl font-bold text-accent">${totalPrice.toLocaleString()}</p>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="bg-primary/80 p-6 flex gap-3">
          <Button
            onClick={onClose}
            variant="outline"
            className="flex-1 bg-red-600 text-white hover:bg-red-700 border-0 font-bold"
          >
            ✕ Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            className="flex-1 bg-accent text-accent-foreground hover:bg-accent/90 font-bold text-lg"
          >
            Listo
          </Button>
        </div>
      </div>
    </div>
  );
}
