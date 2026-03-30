import { useState } from 'react';
import MenuCard from './MenuCard';
import { ChevronDown } from 'lucide-react';
import { getDishImage } from '@/lib/dishImages';

interface Plato {
  nombre: string;
  descripcion?: string;
  precio: number;
}

interface CategoryCardProps {
  nombre: string;
  imagen: string;
  platos: Plato[];
}

export default function CategoryCard({ nombre, imagen, platos }: CategoryCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="w-full">
      {/* Category Card */}
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer border-2 border-accent"
      >
        <div className="relative aspect-square overflow-hidden">
          <img
            src={imagen}
            alt={nombre}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="p-4 text-center">
          <h3 className="font-black text-3xl text-black mb-3">{nombre}</h3>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-2 rounded font-semibold transition-colors"
          >
            Menú
          </button>
        </div>
      </div>

      {/* Expanded Platos Grid */}
      {isExpanded && (
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {platos.map((plato) => (
            <MenuCard
              key={plato.nombre}
              id={plato.nombre.toLowerCase().replace(/\s+/g, '-')}
              nombre={plato.nombre}
              descripcion={plato.descripcion || ''}
              precio={plato.precio}
              categoria={nombre}
              imagen={getDishImage(plato.nombre)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
