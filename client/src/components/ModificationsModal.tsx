import { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getAllowedIngredients, getIngredientPrice } from '@/lib/ingredientsPrices';

interface Modification {
  ingredient: string;
  type: 'added' | 'removed';
  price: number;
}

interface ModificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (modifications: Modification[], totalPrice: number) => void;
  dishName: string;
  category: string;
  basePrice: number;
  baseIngredients: string[];
  existingModifications?: Modification[];
}

export default function ModificationsModal({
  isOpen,
  onClose,
  onSave,
  dishName,
  category,
  basePrice,
  baseIngredients,
  existingModifications = [],
}: ModificationsModalProps) {
  const [mode, setMode] = useState<'add' | 'remove' | null>(null);
  const [modifications, setModifications] = useState<Modification[]>(existingModifications);
  const [selectedIngredient, setSelectedIngredient] = useState<string | null>(null);

  const allowedIngredients = getAllowedIngredients(category);
  
  // Filtrar ingredientes según el modo
  const availableIngredients = mode === 'add'
    ? allowedIngredients.filter(ing => !baseIngredients.includes(ing))
    : baseIngredients;

  // Calcular precio total
  const additionalPrice = modifications
    .filter(m => m.type === 'added')
    .reduce((sum, m) => sum + m.price, 0);
  const totalPrice = basePrice + additionalPrice;

  const handleSelectIngredient = (ingredient: string) => {
    if (mode === 'add') {
      const price = getIngredientPrice(ingredient);
      const newMod: Modification = { ingredient, type: 'added', price };
      
      // Evitar duplicados
      if (!modifications.some(m => m.ingredient === ingredient && m.type === 'added')) {
        setModifications([...modifications, newMod]);
      }
    } else if (mode === 'remove') {
      const newMod: Modification = { ingredient, type: 'removed', price: 0 };
      
      // Evitar duplicados
      if (!modifications.some(m => m.ingredient === ingredient && m.type === 'removed')) {
        setModifications([...modifications, newMod]);
      }
    }
    setSelectedIngredient(null);
  };

  const handleRemoveModification = (index: number) => {
    setModifications(modifications.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    onSave(modifications, totalPrice);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b p-6 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-foreground">{dishName}</h2>
            <p className="text-sm text-muted-foreground">{category}</p>
          </div>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Mode Selection */}
          <div className="flex gap-4">
            <Button
              onClick={() => {
                setMode('add');
                setSelectedIngredient(null);
              }}
              variant={mode === 'add' ? 'default' : 'outline'}
              className="flex-1"
            >
              Adicionar
            </Button>
            <Button
              onClick={() => {
                setMode('remove');
                setSelectedIngredient(null);
              }}
              variant={mode === 'remove' ? 'default' : 'outline'}
              className="flex-1"
            >
              Quitar
            </Button>
          </div>

          {/* Ingredients Selection */}
          {mode && (
            <div className="space-y-4">
              <h3 className="font-semibold text-foreground">
                {mode === 'add' ? 'Selecciona ingredientes para adicionar' : 'Selecciona ingredientes para quitar'}
              </h3>
              <div className="grid grid-cols-2 gap-3 max-h-64 overflow-y-auto">
                {availableIngredients.map((ingredient) => (
                  <button
                    key={ingredient}
                    onClick={() => handleSelectIngredient(ingredient)}
                    className="p-3 border-2 border-border rounded-lg hover:bg-accent/10 transition-colors text-left"
                  >
                    <div className="font-medium text-sm text-foreground">{ingredient}</div>
                    {mode === 'add' && (
                      <div className="text-xs text-primary font-semibold">
                        +${getIngredientPrice(ingredient).toLocaleString()}
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Selected Modifications */}
          {modifications.length > 0 && (
            <div className="space-y-3 bg-muted p-4 rounded-lg">
              <h3 className="font-semibold text-foreground">Modificaciones seleccionadas:</h3>
              <div className="space-y-2">
                {modifications.map((mod, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center bg-white p-2 rounded border border-border"
                  >
                    <div>
                      <span className="text-sm font-medium text-foreground">{mod.ingredient}</span>
                      <span className="ml-2 text-xs text-muted-foreground">
                        ({mod.type === 'added' ? 'Adicionar' : 'Quitar'})
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {mod.type === 'added' && (
                        <span className="text-sm font-semibold text-primary">
                          +${mod.price.toLocaleString()}
                        </span>
                      )}
                      <button
                        onClick={() => handleRemoveModification(index)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Price Summary */}
          <div className="bg-accent/10 p-4 rounded-lg space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Precio base:</span>
              <span className="font-medium">${basePrice.toLocaleString()}</span>
            </div>
            {additionalPrice > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Adicionales:</span>
                <span className="font-medium text-primary">+${additionalPrice.toLocaleString()}</span>
              </div>
            )}
            <div className="border-t border-border pt-2 flex justify-between">
              <span className="font-bold text-foreground">Total:</span>
              <span className="font-bold text-lg text-primary">${totalPrice.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t p-6 flex gap-4">
          <Button onClick={onClose} variant="outline" className="flex-1">
            Cancelar
          </Button>
          <Button onClick={handleSave} className="flex-1 bg-primary text-primary-foreground">
            Adicionar al Carrito
          </Button>
        </div>
      </div>
    </div>
  );
}
