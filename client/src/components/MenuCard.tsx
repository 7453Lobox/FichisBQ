import { useCart } from '@/contexts/CartContext';
import { ShoppingCart } from 'lucide-react';

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

  const handleAddToCart = () => {
    addItem({
      id,
      nombre,
      precio,
      cantidad: 1,
      categoria,
    });
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
        <p className="text-xs md:text-sm text-foreground/80 mb-4 line-clamp-2">
          {descripcion}
        </p>

        {/* Category badge and add button */}
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full">
            {categoria}
          </span>
          <button
            onClick={handleAddToCart}
            className="bg-primary text-primary-foreground hover:bg-primary/90 p-2 rounded transition-colors"
            aria-label={`Agregar ${nombre} al carrito`}
            title="Agregar al carrito"
          >
            <ShoppingCart size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
