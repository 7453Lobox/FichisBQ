import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import MenuCard from './MenuCard';

interface MenuItem {
  nombre: string;
  descripcion?: string;
  precio: number;
}

interface CategoryCardProps {
  title: string;
  image: string;
  items: MenuItem[];
}

export default function CategoryCard({ title, image, items }: CategoryCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="w-full">
      {/* Category Header Card */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full relative h-48 md:h-56 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 group cursor-pointer"
      >
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-300 group-hover:scale-105"
          style={{ backgroundImage: `url(${image})` }}
        >
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors" />
        </div>

        {/* Title and Chevron */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <h3 className="text-2xl md:text-3xl font-bold text-white text-center px-4 mb-2">
            {title}
          </h3>
          <ChevronDown
            size={28}
            className={`text-accent transition-transform duration-300 ${
              isExpanded ? 'rotate-180' : ''
            }`}
          />
        </div>
      </button>

      {/* Expanded Items */}
      {isExpanded && (
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-4">
          {items.map((item) => (
            <MenuCard
              key={item.nombre}
              id={item.nombre.toLowerCase().replace(/\s+/g, '-')}
              nombre={item.nombre}
              descripcion={item.descripcion || ''}
              precio={item.precio}
              categoria={title}
            />
          ))}
        </div>
      )}
    </div>
  );
}
