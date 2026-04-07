import { useCart } from '@/contexts/CartContext';
import type { CartItem } from '@/contexts/CartContext';
import { ShoppingCart, X, Trash2, Edit2 } from 'lucide-react';
import { useState } from 'react';
import { trpc } from '@/lib/trpc';
import { toast } from 'sonner';
import ModificationsModal from './ModificationsModal';
import CheckoutModal, { type CheckoutData } from './CheckoutModal';
import { extractIngredientsFromDescription } from '@/lib/ingredientsPrices';
import menuData from '@/lib/menuData.json';

/**
 * Floating Cart Component
 * Design: Viking Banquet Hall - Sidebar cart with Nordic aesthetics
 * Features: Add/remove items, quantity control, WhatsApp integration, edit modifications
 */
function FloatingCartContent() {
  const { items, removeItem, updateQuantity, updateItem, total, clearCart } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [editingItemIndex, setEditingItemIndex] = useState<number | null>(null);
  const [showCheckout, setShowCheckout] = useState(false);
  const createOrderMutation = trpc.orders.create.useMutation();

  const WHATSAPP_NUMBER = '573022525442';
  const RESTAURANT_NAME = "Fichi's BBQ";

  // Find the dish being edited
  const editingItem = editingItemIndex !== null ? items[editingItemIndex] : null;
  const editingDish = editingItem ? findDishByName(editingItem.nombre) : null;

  function findDishByName(nombre: string) {
    for (const category of Object.values(menuData)) {
      const dish = (category as any[]).find(d => d.nombre === nombre);
      if (dish) return dish;
    }
    return null;
  }

  const generateWhatsAppMessage = (checkoutData: CheckoutData) => {
    if (items.length === 0) return '';

    let message = `Hola! Quiero hacer un pedido en ${RESTAURANT_NAME}:\n\n`;
    message += `PEDIDO DETALLADO\n`;
    message += `${'='.repeat(34)}\n\n`;

    items.forEach((item, index) => {
      message += `${index + 1}. ${item.nombre.toUpperCase()}\n`;
      message += `   Cantidad: ${item.cantidad}\n`;
      message += `   Precio unitario: $${item.precio.toLocaleString()}\n`;
      
      // Include modifications if present
      if (item.modifications && item.modifications.length > 0) {
        message += `   Modificaciones:\n`;
        item.modifications.forEach(mod => {
          if (mod.type === 'added') {
            message += `     + ${mod.ingredient} (+$${mod.price.toLocaleString()})\n`;
          } else {
            message += `     - ${mod.ingredient}\n`;
          }
        });
      }
      
      message += `   Subtotal: $${(item.precio * item.cantidad).toLocaleString()}\n\n`;
    });

    message += `${'='.repeat(34)}\n`;
    message += `TOTAL: $${total.toLocaleString()}\n\n`;
    message += `📋 DATOS DEL CLIENTE:\n`;
    message += `Nombre: ${checkoutData.nombre}\n`;
    message += `Teléfono: ${checkoutData.telefono}\n`;
    message += `Dirección: ${checkoutData.direccion}\n`;
    message += `Hora: ${checkoutData.hora}\n`;
    message += `Forma de pago: ${checkoutData.formaPago.toUpperCase()}\n\n`;
    message += `Gracias por elegir ${RESTAURANT_NAME}!`;

    return message;
  };

  const handleCheckoutSubmit = async (checkoutData: CheckoutData) => {
    if (items.length === 0) {
      toast.error('Tu carrito está vacío');
      return;
    }

    try {
      // Save order to database
      await createOrderMutation.mutateAsync({
        customerName: checkoutData.nombre,
        customerPhone: checkoutData.telefono,
        items: JSON.stringify(items.map(item => ({
          nombre: item.nombre,
          cantidad: item.cantidad,
          precio: item.precio,
          categoria: item.categoria,
          modifications: item.modifications,
        }))),
        totalPrice: Math.round(total * 100), // Convert to cents
        paymentMethod: checkoutData.formaPago,
        notes: `Dirección: ${checkoutData.direccion}\nHora: ${checkoutData.hora}`,
      });

      toast.success('Pedido guardado! Abriendo WhatsApp...');

      // Generate and send WhatsApp message
      const message = generateWhatsAppMessage(checkoutData);
      const encodedMessage = encodeURIComponent(message);
      const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
      window.open(whatsappUrl, '_blank');

      // Clear cart after successful order
      clearCart();
      setIsOpen(false);
      setShowCheckout(false);
    } catch (error) {
      console.error('Error creating order:', error);
      toast.error('Error al guardar el pedido');
    }
  };

  const handleEditItem = (index: number) => {
    setIsOpen(false); // Close cart to show edit modal on top
    setEditingItemIndex(index);
    setEditingItemId(items[index].id);
  };

  const handleSaveModifications = (modifications: any[], totalPrice: number) => {
    if (editingItemIndex !== null && editingItemId !== null) {
      // Update the item with new modifications and price
      updateItem(editingItemId, {
        precio: totalPrice,
        modifications,
      });
      
      setEditingItemId(null);
      setEditingItemIndex(null);
    }
  };

  return (
    <>
      {/* Floating Cart Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-[9999] w-16 h-16 rounded-full bg-primary text-primary-foreground shadow-[0_8px_25px_rgba(0,0,0,0.6)] hover:shadow-[0_12px_35px_rgba(0,0,0,0.9)] transition-all duration-300 flex items-center justify-center border-4 border-white hover:scale-110"
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
        <div className="fixed inset-0 z-[9998] flex">
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
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {items.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingCart size={48} className="mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">Tu carrito está vacío</p>
                </div>
              ) : (
                items.map((item, index) => (
                  <div key={item.id} className="bg-gray-100 rounded-lg p-4 space-y-2">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-bold text-foreground">{item.nombre}</h3>
                        {item.modifications && item.modifications.length > 0 && (
                          <div className="text-xs text-black mt-1">
                            {item.modifications.map((mod, i) => (
                              <div key={i}>
                                {mod.type === 'added' ? '+' : '-'} {mod.ingredient}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-primary">${item.precio.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">x{item.cantidad}</p>
                      </div>
                    </div>

                    {/* Quantity and Actions */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 bg-white rounded border border-gray-300">
                        <button
                          onClick={() => updateQuantity(item.id, Math.max(1, item.cantidad - 1))}
                          className="px-2 py-1 hover:bg-gray-100 font-bold"
                        >
                          −
                        </button>
                        <span className="px-3 py-1 min-w-[2rem] text-center">{item.cantidad}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.cantidad + 1)}
                          className="px-2 py-1 hover:bg-gray-100 font-bold"
                        >
                          +
                        </button>
                      </div>

                      <button
                        onClick={() => handleEditItem(index)}
                        className="p-2 hover:bg-blue-100 text-blue-600 rounded transition-colors flex items-center gap-1"
                        title="Editar"
                      >
                        <Edit2 size={16} />
                        <span className="text-xs font-semibold">Editar</span>
                      </button>

                      <button
                        onClick={() => removeItem(item.id)}
                        className="p-2 hover:bg-red-100 text-red-600 rounded transition-colors"
                        title="Eliminar"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-gray-200 p-6 space-y-4">
                {/* Total */}
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-foreground">Total:</span>
                  <span className="text-2xl font-black text-primary">${total.toLocaleString()}</span>
                </div>

                {/* Send WhatsApp Button */}
                <button
                  onClick={() => setShowCheckout(true)}
                  className="w-full bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                >
                  📱 Enviar por WhatsApp
                </button>

                {/* Clear Cart Button */}
                <button
                  onClick={() => clearCart()}
                  className="w-full bg-red-600 text-white font-bold py-2 rounded-lg hover:bg-red-700 transition-colors"
                >
                  Limpiar Carrito
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modifications Modal */}
      {editingItemIndex !== null && editingItem && (
        <ModificationsModal
          isOpen={editingItemIndex !== null}
          onClose={() => {
            setEditingItemIndex(null);
            setEditingItemId(null);
          }}
          dishName={editingItem.nombre}
          category={editingItem.categoria}
          basePrice={editingItem.basePrice || (editingDish?.precio || 0)}
          baseIngredients={extractIngredientsFromDescription(editingDish?.descripcion || '')}
          onSave={handleSaveModifications}
          existingModifications={editingItem.modifications || []}
        />
      )}

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={showCheckout}
        onClose={() => setShowCheckout(false)}
        onSubmit={handleCheckoutSubmit}
        totalPrice={total}
      />
    </>
  );
}

export default function FloatingCart() {
  return <FloatingCartContent />;
}
