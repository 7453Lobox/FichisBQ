import { useState } from 'react';
import CategoryModal from './CategoryModal';
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
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      {/* Category Card */}
      <div
        onClick={() => setIsModalOpen(true)}
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
            onClick={(e) => {
              e.stopPropagation();
              setIsModalOpen(true);
            }}
            className="bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-2 rounded font-semibold transition-colors"
          >
            Menú
          </button>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <CategoryModal
          nombre={nombre}
          platos={platos}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
}
