import { useCart } from '@/contexts/CartContext';
import { ShoppingCart, X, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { trpc } from '@/lib/trpc';
import { toast } from 'sonner';

/**
 * Floating Cart Component
 * Design: Viking Banquet Hall - Sidebar cart with Nordic aesthetics
 * Features: Add/remove items, quantity control, WhatsApp integration
 */
export default function FloatingCart() {
  const { items, removeItem, updateQuantity, total, clearCart } = useCart();
  const [isOpen, setIsOpen] = useState(false);

  const WHATSAPP_NUMBER = '573022525442';
  const RESTAURANT_NAME = "Fichi's BBQ";

  const generateWhatsAppMessage = () => {
    if (items.length === 0) return '';

    let message = `Hola! Quiero hacer un pedido en ${RESTAURANT_NAME}:\n\n`;
    message += `PEDIDO DETALLADO\n`;
    message += `${'='.repeat(40)}\n\n`;

    items.forEach((item, index) => {
      message += `${index + 1}. ${item.nombre.toUpperCase()}\n`;
      message += `   Cantidad: ${item.cantidad}\n`;
      message += `   Precio unitario: $${item.precio.toLocaleString()}\n`;
      message += `   Subtotal: $${(item.precio * item.cantidad).toLocaleString()}\n\n`;
    });

    message += `${'='.repeat(40)}\n`;
    message += `TOTAL: $${total.toLocaleString()}\n\n`;
    message += `Direccion: (Por confirmar)\n`;
    message += `Hora: (Por confirmar)\n`;
    message += `Forma de pago: (Por confirmar)\n\n`;
    message += `Gracias por elegir ${RESTAURANT_NAME}!`;

    return message;
  };

  const createOrderMutation = trpc.orders.create.useMutation();

  const handleWhatsAppClick = async () => {
    if (items.length === 0) {
      toast.error('Tu carrito está vacío');
      return;
    }

    // Collect customer info
    const customerName = prompt('¿Cuál es tu nombre?');
    if (!customerName) return;

    const customerPhone = prompt('¿Cuál es tu número de teléfono? (ej: 573001234567)');
    if (!customerPhone) return;

    try {
      // Save order to database
      await createOrderMutation.mutateAsync({
        customerName,
        customerPhone,
        items: JSON.stringify(items.map(item => ({
          nombre: item.nombre,
          cantidad: item.cantidad,
          precio: item.precio,
          categoria: item.categoria,
        }))),
        totalPrice: Math.round(total * 100), // Convert to cents
        paymentMethod: 'whatsapp',
        notes: '',
      });

      toast.success('Pedido guardado! Abriendo WhatsApp...');

      // Generate and send WhatsApp message
      const message = generateWhatsAppMessage();
      const encodedMessage = encodeURIComponent(message);
      const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
      window.open(whatsappUrl, '_blank');

      // Clear cart after successful order
      clearCart();
      setIsOpen(false);
    } catch (error) {
      console.error('Error creating order:', error);
      toast.error('Error al guardar el pedido');
    }
  };

  return (
    <>
      {/* Floating Cart Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-40 w-16 h-16 rounded-full bg-primary text-primary-foreground shadow-2xl hover:shadow-[0_10px_30px_rgba(0,0,0,0.8)] transition-all duration-300 flex items-center justify-center border-4 border-white hover:scale-110"
        aria-label="Abrir carrito"
      >
        <ShoppingCart size={28} />
        {items.length > 0 && (
          <span className="absolute -top-2 -right-2 bg-accent text-accent-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
            {items.length}
          </span>
        )}
      </button>

      {/* Cart Sidebar */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="flex-1 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />

          {/* Cart Panel */}
          <div className="w-full sm:max-w-md bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-300 max-h-screen">
            {/* Header */}
            <div className="bg-primary text-primary-foreground p-6 flex items-center justify-between">
              <h2 className="viking-title text-2xl">Tu Conquista</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="hover:bg-primary/80 p-2 rounded transition-colors"
                aria-label="Cerrar carrito"
              >
                <X size={24} />
              </button>
            </div>

            {/* Items List */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
              {items.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingCart size={48} className="mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">Tu carrito esta vacio</p>
                  <p className="text-sm text-muted-foreground mt-2">Comienza tu aventura gastronomica!</p>
                </div>
              ) : (
                items.map((item) => (
                  <div
                    key={item.id}
                    className="border-b border-border pb-4 last:border-b-0"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <h3 className="font-bold text-foreground">{item.nombre}</h3>
                        <p className="text-sm text-muted-foreground">${item.precio.toLocaleString()}</p>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-destructive hover:bg-destructive/10 p-1 rounded transition-colors"
                        aria-label="Eliminar del carrito"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.cantidad - 1)}
                        className="bg-secondary text-secondary-foreground w-8 h-8 rounded hover:bg-secondary/80 transition-colors"
                      >
                        -
                      </button>
                      <span className="flex-1 text-center font-bold">{item.cantidad}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.cantidad + 1)}
                        className="bg-secondary text-secondary-foreground w-8 h-8 rounded hover:bg-secondary/80 transition-colors"
                      >
                        +
                      </button>
                      <span className="font-bold text-primary ml-2">
                        ${(item.precio * item.cantidad).toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-border p-4 md:p-6 space-y-4 bg-muted/30">
                <div className="flex justify-between items-center text-base md:text-lg font-bold">
                  <span>Total:</span>
                  <span className="text-primary text-xl md:text-2xl">${total.toLocaleString()}</span>
                </div>
                <div className="space-y-2">
                  <button
                    onClick={handleWhatsAppClick}
                    disabled={createOrderMutation.isPending}
                    className="w-full bg-green-600 text-white font-bold py-3 rounded hover:bg-green-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {createOrderMutation.isPending ? 'Guardando...' : 'Enviar por WhatsApp'}
                  </button>
                  <button
                    onClick={() => clearCart()}
                    className="w-full border-2 border-destructive text-destructive font-bold py-2 rounded hover:bg-destructive/10 transition-colors"
                  >
                    Limpiar Carrito
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
