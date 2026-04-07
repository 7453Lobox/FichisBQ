import { useState, useEffect } from 'react';
import { useCart } from '@/contexts/CartContext';
import { ShoppingCart, Check } from 'lucide-react';
import ModificationsModal from './ModificationsModal';
import { extractIngredientsFromDescription } from '@/lib/ingredientsPrices';

interface MenuCardProps {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  categoria: string;
  imagen?: string;
}

/**
 * Menu Card Component
 * Design: Viking Banquet Hall - Nordic aesthetics with gold accents
 * Features: Display dish info with image and add to cart button
 */
export default function MenuCard({
  id,
  nombre,
  descripcion,
  precio,
  categoria,
  imagen,
}: MenuCardProps) {
  const { addItem } = useCart();
  const [showModifications, setShowModifications] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const baseIngredients = extractIngredientsFromDescription(descripcion);

  useEffect(() => {
    if (addedToCart) {
      // Play yummy sound
      const audio = new Audio('https://d2xsxph8kpxj0f.cloudfront.net/310519663461231402/ZAf6EHxtQifi3Kavc8aaUS/notification_sound_c83c3154.mp3');
      audio.play().catch((err) => console.log('Audio play error:', err));
      
      const timer = setTimeout(() => setAddedToCart(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [addedToCart]);

  const handleAddToCart = () => {
    setShowModifications(true);
  };

  const handleSaveModifications = (modifications: any[], totalPrice: number) => {
    addItem({
      id,
      nombre,
      precio: totalPrice,
      cantidad: 1,
      categoria,
      modifications,
      basePrice: precio,
    });
    setAddedToCart(true);
    setShowModifications(false);
  };

  return (
    <div className="bg-white border-2 border-accent rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group animate-in">
      {/* Image */}
      {imagen && (
        <div className="relative w-full h-48 md:h-56 overflow-hidden bg-gray-200">
          <img
            src={imagen}
            alt={nombre}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}
      
      {/* Content */}
      <div className="p-4 md:p-6">
        {/* Header with price */}
        <div className="flex justify-between items-start mb-3 gap-2">
          <h3 className="font-bold text-2xl md:text-3xl text-foreground flex-1 group-hover:text-primary transition-colors">
            {nombre}
          </h3>
          <span className="text-accent font-bold text-lg md:text-xl ml-2 whitespace-nowrap flex-shrink-0">
            ${precio.toLocaleString()}
          </span>
        </div>

        {/* Description */}
        <p className="text-xs md:text-sm text-foreground/80 mb-4">
          {descripcion}
        </p>

        {/* Add button */}
        <div className="flex justify-end">
          <button
            onClick={handleAddToCart}
            className={`p-2 rounded-full transition-all duration-300 ${
              addedToCart
                ? 'bg-green-500 text-white scale-110'
                : 'bg-primary text-primary-foreground hover:bg-primary/90'
            }`}
            aria-label={`Agregar ${nombre} al carrito`}
            title="Agregar al carrito"
          >
            {addedToCart ? <Check size={20} /> : <span className="font-bold">Pedir</span>}
          </button>
        </div>
      </div>

      {/* Modifications Modal */}
      <ModificationsModal
        isOpen={showModifications}
        onClose={() => setShowModifications(false)}
        onSave={handleSaveModifications}
        dishName={nombre}
        category={categoria}
        basePrice={precio}
        baseIngredients={baseIngredients}
      />
    </div>
  );
}
