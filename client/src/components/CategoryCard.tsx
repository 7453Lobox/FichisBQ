import { useState } from 'react';
import MenuCard from './MenuCard';
import { ChevronDown } from 'lucide-react';

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
          <h3 className="font-bold text-lg text-primary mb-2">{nombre}</h3>
          <span className="text-primary font-semibold text-sm">Menú</span>
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
            />
          ))}
        </div>
      )}
    </div>
  );
}
