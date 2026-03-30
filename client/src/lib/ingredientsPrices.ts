// Precios de ingredientes adicionales
export const ingredientsPrices: Record<string, number> = {
  // De la tarjeta Adicionales
  "Tocineta": 2800,
  "Queso Mozarela": 5000,
  "Queso Costeño": 4000,
  "Porción de Papas": 8000,
  "Carne de Hamburguesa": 7000,
  "Bollo Limpio": 2000,
  
  // Otros ingredientes comunes (precio por defecto 5000)
  "Queso cheddar": 5000,
  "Cebolla crunchy": 5000,
  "Lechuga crespa": 5000,
  "Tomate milano": 5000,
  "Aros de cebolla": 5000,
  "Guacamole": 5000,
  "Pechuga a la plancha": 5000,
  "Butifarra Premium": 5000,
  "Chorizo de ternera": 5000,
  "Queso costeño asado": 5000,
  "Sour cream": 5000,
  "Piña caramelizada": 5000,
  "Cebolla caramelizada": 5000,
  "Papa chongo": 5000,
  "Salchicha Long": 5000,
  "Salchicha Americana súper": 5000,
  "Salchicha ranchera súper": 5000,
  "Salchicha suiza Premium": 5000,
  "Jamón": 5000,
  "Maíz": 5000,
  "Pico de gallo": 5000,
  "Queso mozarela doble crema": 5000,
  "Papas a la francesa": 5000,
  "Salchicha súper": 5000,
  "Tocineta Premium": 5000,
  "Ensalada verde": 5000,
  "Patacón": 5000,
};

// Mapeo de categorías a ingredientes permitidos
export const categoryIngredientsMap: Record<string, string[]> = {
  "Hamburguesas": [
    "Carne de Hamburguesa",
    "Queso Mozarela",
    "Queso cheddar",
    "Tocineta",
    "Cebolla crunchy",
    "Lechuga crespa",
    "Tomate milano",
    "Piña caramelizada",
    "Cebolla caramelizada",
    "Queso Costeño",
    "Butifarra Premium",
    "Chorizo de ternera",
  ],
  "Perros Calientes": [
    "Salchicha Long",
    "Salchicha Americana súper",
    "Salchicha ranchera súper",
    "Salchicha suiza Premium",
    "Queso Mozarela",
    "Tocineta",
    "Lechuga crespa",
    "Papa chongo",
    "Butifarra Premium",
    "Chorizo de ternera",
    "Piña caramelizada",
    "Cebolla caramelizada",
  ],
  "Sandwich Panini": [
    "Jamón",
    "Queso Mozarela",
    "Piña caramelizada",
    "Pechuga a la plancha",
    "Tocineta",
    "Maíz",
    "Lechuga crespa",
    "Tomate milano",
    "Queso mozarela doble crema",
  ],
  "Salchipapas y Patatas": [
    "Salchicha Long",
    "Salchicha suiza Premium",
    "Chorizo de ternera",
    "Butifarra Premium",
    "Salchicha ranchera súper",
    "Salchicha súper",
    "Queso Mozarela",
    "Queso Costeño",
    "Tocineta Premium",
    "Maíz",
    "Lechuga crespa",
    "Papa chongo",
    "Guacamole",
    "Pico de gallo",
    "Sour cream",
  ],
  "Patatas Mini": [
    "Chorizo de ternera",
    "Tocineta Premium",
    "Salchicha súper",
    "Queso Mozarela",
    "Queso Costeño",
    "Lechuga crespa",
    "Papa chongo",
    "Guacamole",
    "Pico de gallo",
    "Sour cream",
  ],
  "Asados": [
    "Pechuga a la plancha",
    "Queso Mozarela",
    "Lechuga crespa",
    "Tomate milano",
    "Papas a la francesa",
  ],
  "Entradas": [
    "Chorizo de ternera",
    "Butifarra Premium",
    "Patacón",
    "Pico de gallo",
    "Sour cream",
  ],
  "Chuzos Desgranados": [
    "Pechuga a la plancha",
    "Chorizo de ternera",
    "Butifarra Premium",
    "Salchicha súper",
    "Tocineta Premium",
    "Queso Costeño",
    "Maíz",
    "Lechuga crespa",
    "Papa chongo",
  ],
  "Especiales": [
    "Papas a la francesa",
    "Carne desmechada",
    "Pollo desmechado",
    "Chorizo de ternera",
    "Tocineta Premium",
    "Salchicha súper",
    "Queso Mozarela",
    "Maíz",
    "Lechuga crespa",
    "Papa chongo",
    "Patacón",
    "Guacamole",
    "Pico de gallo",
  ],
};

// Función para extraer ingredientes de la descripción
export function extractIngredientsFromDescription(description: string): string[] {
  const ingredients: string[] = [];
  const descriptionParts = description.split(",").map(part => part.trim());
  
  for (const part of descriptionParts) {
    // Buscar en los precios conocidos
    for (const ingredient of Object.keys(ingredientsPrices)) {
      if (part.toLowerCase().includes(ingredient.toLowerCase())) {
        if (!ingredients.includes(ingredient)) {
          ingredients.push(ingredient);
        }
      }
    }
  }
  
  return ingredients;
}

// Función para obtener ingredientes permitidos según categoría
export function getAllowedIngredients(category: string): string[] {
  return categoryIngredientsMap[category] || [];
}

// Función para obtener precio de ingrediente
export function getIngredientPrice(ingredient: string): number {
  return ingredientsPrices[ingredient] || 5000;
}
