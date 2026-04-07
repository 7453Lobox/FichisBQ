import { useState } from 'react';
import { X, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getAllowedIngredients, getIngredientPrice, getIngredientImage } from '@/lib/ingredientsPrices';

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
  const [mode, setMode] = useState<'add' | 'remove' | null>('add');
  const [modifications, setModifications] = useState<Modification[]>(existingModifications);

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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" style={{ scrollbarGutter: 'stable', overflow: 'hidden' }}>
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full h-[90vh] flex flex-col overflow-hidden">
        {/* Header - Fixed */}
        <div className="bg-white border-b p-4 md:p-6 flex justify-between items-start flex-shrink-0">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-foreground">¿Deseas algún adicional?</h2>
            <p className="text-xs md:text-sm text-primary font-semibold">{dishName}</p>
          </div>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors flex-shrink-0 ml-2"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content - Scrolleable */}
        <div className="flex-1 overflow-y-auto px-4 md:px-6 py-4 md:py-6 space-y-6" style={{ scrollbarGutter: 'stable', WebkitOverflowScrolling: 'touch' }}>
          {/* Mode Selection - Always show with 'add' pre-selected */}
          <div className="flex gap-3 sticky top-0 bg-white pt-2 pb-4 z-10">
            <Button
              onClick={() => {
                setMode('add');
              }}
              variant={mode === 'add' ? 'default' : 'outline'}
              className="flex-1 text-sm md:text-base font-semibold py-2 md:py-3 h-auto"
            >
              + Adicionar
            </Button>
            <Button
              onClick={() => {
                setMode('remove');
              }}
              variant={mode === 'remove' ? 'default' : 'outline'}
              className="flex-1 text-sm md:text-base font-semibold py-2 md:py-3 h-auto"
            >
              - Quitar
            </Button>
          </div>

          {/* Question */}
          {mode && (
            <p className="text-xs md:text-sm font-medium text-black text-center -mt-2">
              {mode === 'add' 
                ? 'Selecciona ingredientes para agregar' 
                : 'Selecciona ingredientes para quitar'}
            </p>
          )}

          {/* Ingredients Grid */}
          {mode && (
            <div className="grid grid-cols-1 gap-3">
              {availableIngredients.map((ingredient) => {
                const price = getIngredientPrice(ingredient);
                const modType = mode === 'add' ? 'added' : 'removed';
                const isSelected = modifications.some(m => m.ingredient === ingredient && m.type === modType);

                return (
                  <button
                    key={ingredient}
                    onClick={() => handleSelectIngredient(ingredient)}
                    className={`p-3 rounded-lg border-2 transition-all text-left flex items-center gap-3 active:scale-95 ${
                      isSelected
                        ? 'border-primary bg-primary/10 shadow-md'
                        : 'border-border hover:border-primary/50 hover:bg-muted'
                    }`}
                  >
                    {/* Info - Left Side */}
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm text-foreground truncate">{ingredient}</div>
                      {mode === 'add' && (
                        <div className="text-xs text-primary font-semibold">
                          +${price.toLocaleString()}
                        </div>
                      )}
                    </div>

                    {/* Image - Right Side */}
                    <div className="w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 bg-muted flex items-center justify-center">
                      {getIngredientImage(ingredient) ? (
                        <img
                          src={getIngredientImage(ingredient) || ''}
                          alt={ingredient}
                          className="w-full h-full object-cover"
                          loading="eager"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                      ) : (
                        <span className="text-xl">🍖</span>
                      )}
                    </div>

                    {/* Plus Button */}
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      isSelected ? 'bg-primary text-white' : 'bg-muted text-foreground'
                    }`}>
                      <Plus size={16} />
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {/* Selected Modifications */}
          {modifications.length > 0 && (
            <div className="space-y-3 bg-muted p-4 rounded-lg">
              <h3 className="font-semibold text-sm md:text-base text-foreground">Modificaciones seleccionadas:</h3>
              <div className="space-y-2">
                {modifications.map((mod, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center bg-white p-2 rounded border border-border"
                  >
                    <div>
                      <span className="text-xs md:text-sm font-medium text-foreground">{mod.ingredient}</span>
                      <span className="ml-2 text-xs text-muted-foreground">
                        ({mod.type === 'added' ? 'Adicionar' : 'Quitar'})
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {mod.type === 'added' && (
                        <span className="text-xs md:text-sm font-semibold text-primary">
                          +${mod.price.toLocaleString()}
                        </span>
                      )}
                      <button
                        onClick={() => handleRemoveModification(index)}
                        className="text-red-500 hover:text-red-700 transition-colors flex-shrink-0"
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
            <div className="flex justify-between text-xs md:text-sm">
              <span className="text-muted-foreground">Precio base:</span>
              <span className="font-medium">${basePrice.toLocaleString()}</span>
            </div>
            {additionalPrice > 0 && (
              <div className="flex justify-between text-xs md:text-sm">
                <span className="text-muted-foreground">Adicionales:</span>
                <span className="font-medium text-primary">+${additionalPrice.toLocaleString()}</span>
              </div>
            )}
            <div className="border-t border-border pt-2 flex justify-between">
              <span className="font-bold text-sm md:text-base text-foreground">Total:</span>
              <span className="font-bold text-base md:text-lg text-primary">${totalPrice.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Footer - Fixed */}
        <div className="bg-white border-t px-4 md:px-6 py-3 md:py-4 flex gap-3 flex-shrink-0 bg-gradient-to-r from-primary/5 to-accent/5">
          <Button 
            onClick={onClose} 
            variant="outline" 
            className="flex-1 text-xs sm:text-sm md:text-base font-semibold py-2 md:py-3 h-auto"
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleSave} 
            className="flex-1 bg-primary text-primary-foreground text-xs sm:text-sm md:text-base font-semibold py-2 md:py-3 h-auto hover:bg-primary/90 transition-colors"
          >
            ✓ Adicionar al Carrito
          </Button>
        </div>
      </div>
    </div>
  );
}
