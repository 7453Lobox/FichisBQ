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
        <div className="relative aspect-video overflow-hidden">
          <img
            src={imagen}
            alt={nombre}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="p-4 flex items-center justify-between">
          <h3 className="font-bold text-lg text-primary">{nombre}</h3>
          <div className="flex items-center gap-2">
            <span className="text-accent font-semibold">Menú</span>
            <ChevronDown
              className={`w-5 h-5 text-accent transition-transform duration-300 ${
                isExpanded ? 'rotate-180' : ''
              }`}
            />
          </div>
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
