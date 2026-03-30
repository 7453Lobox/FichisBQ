import { X } from 'lucide-react';
import MenuCard from './MenuCard';
import { getDishImage } from '@/lib/dishImages';

interface Plato {
  nombre: string;
  descripcion?: string;
  precio: number;
}

interface CategoryModalProps {
  nombre: string;
  platos: Plato[];
  onClose: () => void;
}

export default function CategoryModal({ nombre, platos, onClose }: CategoryModalProps) {
  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 bg-white border-b-2 border-accent p-6 flex items-center justify-between">
            <h2 className="font-black text-4xl text-black">{nombre}</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Cerrar"
            >
              <X className="w-6 h-6 text-black" />
            </button>
          </div>

          {/* Platos Grid */}
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
          </div>
        </div>
      </div>
    </>
  );
}
