import { useCart } from '@/contexts/CartContext';
import { ShoppingCart } from 'lucide-react';

interface MenuCardProps {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  categoria: string;
}

/**
 * Menu Card Component
 * Design: Viking Banquet Hall - Nordic aesthetics with gold accents
 * Features: Display dish info and add to cart button
 */
export default function MenuCard({
  id,
  nombre,
  descripcion,
  precio,
  categoria,
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
    <div className="bg-white border-2 border-accent rounded-lg p-4 md:p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group animate-in">
      {/* Header with price */}
      <div className="flex justify-between items-start mb-3 gap-2">
        <h3 className="font-bold text-base md:text-lg text-foreground flex-1 group-hover:text-primary transition-colors">
          {nombre}
        </h3>
        <span className="text-accent font-bold text-lg md:text-xl ml-2 whitespace-nowrap flex-shrink-0">
          ${precio.toLocaleString()}
        </span>
      </div>

      {/* Description */}
      <p className="text-xs md:text-sm text-muted-foreground mb-4 line-clamp-2">
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
  );
}
