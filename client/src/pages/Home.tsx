import MenuCard from '@/components/MenuCard';
import FloatingCart from '@/components/FloatingCart';
import { useState } from 'react';
import menuData from '@/lib/menuData.json';
import { useAuth } from '@/_core/hooks/useAuth';

/**
 * Home Page - Fichi's BBQ Landing Page
 * Design: Viking Banquet Hall Nórdico Moderno
 * Features: Hero, Menu, Gallery, Contact, Shopping Cart
 */
export default function Home() {
  // The userAuth hooks provides authentication state
  // To implement login/logout functionality, simply call logout() or redirect to getLoginUrl()
  let { user, loading, error, isAuthenticated, logout } = useAuth();

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = Object.keys(menuData);
  const displayedItems = selectedCategory
    ? menuData[selectedCategory as keyof typeof menuData] || []
    : Object.values(menuData).flat();

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-30 bg-white border-b-4 border-accent shadow-lg">
        <div className="container py-3 md:py-4 flex items-center justify-between gap-4">
          <h1 className="viking-title text-2xl md:text-3xl text-primary">Fichi's BBQ</h1>
          <div className="hidden md:flex gap-6">
            <a href="#menu" className="font-semibold text-foreground hover:text-primary transition-colors">
              Menu
            </a>
            <a href="#galeria" className="font-semibold text-foreground hover:text-primary transition-colors">
              Galeria
            </a>
            <a href="#contacto" className="font-semibold text-foreground hover:text-primary transition-colors">
              Contacto
            </a>
          </div>
          <div className="text-xs md:text-sm font-bold text-primary whitespace-nowrap">
            +57 3022525442
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative h-96 md:h-screen overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url(https://d2xsxph8kpxj0f.cloudfront.net/310519663461231402/ZAf6EHxtQifi3Kavc8aaUS/hero-viking-bbq-3S2okLQNr3KdoQqpbAvFWW.webp)',
          }}
        >
          <div className="absolute inset-0 bg-black/40" />
        </div>

        <div className="relative container h-full flex items-center py-8 md:py-0">
          <div className="w-full md:w-1/2 text-white">
            <h2 className="viking-title text-3xl md:text-6xl mb-4 text-white">
              Bienvenido al Salón de Banquetes
            </h2>
            <p className="text-base md:text-2xl mb-8 text-white/90">
              Donde los guerreros se reúnen para disfrutar de la mejor comida BBQ
            </p>
            <a
              href="#menu"
              className="inline-block bg-accent text-accent-foreground font-bold py-4 px-8 rounded-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              Comienza tu Conquista
            </a>
          </div>
        </div>
      </section>

      {/* Menu Section */}
      <section id="menu" className="py-16 md:py-24 bg-background">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="viking-title text-4xl md:text-5xl text-primary mb-4">
              Nuestro Menú Épico
            </h2>
            <div className="h-1 w-24 bg-accent mx-auto" />
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-3 justify-center mb-12">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-6 py-2 rounded-full font-bold transition-all ${
                selectedCategory === null
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-white border-2 border-accent text-primary hover:bg-accent/10'
              }`}
            >
              Todos
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-6 py-2 rounded-full font-bold transition-all ${
                  selectedCategory === cat
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-white border-2 border-accent text-primary hover:bg-accent/10'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Menu Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedItems.map((item: any) => (
              <MenuCard
                key={item.nombre}
                id={item.nombre.toLowerCase().replace(/\s+/g, '-')}
                nombre={item.nombre}
                descripcion={item.descripcion}
                precio={item.precio}
                categoria={selectedCategory || 'Menu'}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section id="galeria" className="py-16 md:py-24 bg-white">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="viking-title text-4xl md:text-5xl text-primary mb-4">
              Galería en Vivo
            </h2>
            <div className="h-1 w-24 bg-accent mx-auto" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 group">
                <div className="relative aspect-square bg-muted overflow-hidden">
                  <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-6xl mb-4">🍖</div>
                      <p className="text-foreground font-bold">Foto {i}</p>
                      <p className="text-sm text-muted-foreground">Momentos épicos</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Food Showcase Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="viking-title text-4xl md:text-5xl text-primary mb-6">
                Calidad Premium
              </h2>
              <p className="text-lg text-foreground mb-4">
                Cada plato es preparado con ingredientes de la más alta calidad, siguiendo recetas tradicionales y técnicas modernas de BBQ.
              </p>
              <p className="text-lg text-foreground mb-8">
                Nuestros guerreros culinarios dedican horas a perfeccionar cada sabor, asegurando que cada bocado sea una experiencia épica.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center gap-3">
                  <span className="text-accent text-2xl">⚔️</span>
                  <span className="font-bold">Ingredientes Premium</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-accent text-2xl">🔥</span>
                  <span className="font-bold">Cocinado a la Perfección</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-accent text-2xl">🍖</span>
                  <span className="font-bold">Sabores Auténticos</span>
                </li>
              </ul>
            </div>
            <div className="rounded-lg overflow-hidden shadow-xl">
              <img
                src="https://d2xsxph8kpxj0f.cloudfront.net/310519663461231402/ZAf6EHxtQifi3Kavc8aaUS/grilled-meats-showcase-mEd2HQqfuNdswKX6dqyubt.webp"
                alt="Carnes a la parrilla"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Why Us Section */}
      <section className="py-16 md:py-24 bg-primary text-primary-foreground">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="viking-title text-4xl md:text-5xl mb-4">
              Por Qué Elegir Fichi's
            </h2>
            <div className="h-1 w-24 bg-accent mx-auto" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-5xl mb-4">⚔️</div>
              <h3 className="font-bold text-lg mb-2">Guerreros Culinarios</h3>
              <p className="text-sm">Nuestro equipo domina el arte del BBQ con pasión y dedicación</p>
            </div>
            <div className="text-center">
              <div className="text-5xl mb-4">🔥</div>
              <h3 className="font-bold text-lg mb-2">Fuego Perfecto</h3>
              <p className="text-sm">Cada plato es cocinado a la temperatura exacta para máximo sabor</p>
            </div>
            <div className="text-center">
              <div className="text-5xl mb-4">🍖</div>
              <h3 className="font-bold text-lg mb-2">Ingredientes Premium</h3>
              <p className="text-sm">Solo utilizamos las mejores carnes y productos frescos</p>
            </div>
            <div className="text-center">
              <div className="text-5xl mb-4">⭐</div>
              <h3 className="font-bold text-lg mb-2">Experiencia Épica</h3>
              <p className="text-sm">Cada visita es una aventura gastronómica memorable</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container text-center">
          <h2 className="viking-title text-4xl md:text-5xl text-primary mb-6">
            Listo para la Conquista
          </h2>
          <p className="text-xl text-foreground mb-8 max-w-2xl mx-auto">
            Explora nuestro menú épico, agrega tus platos favoritos y envía tu pedido directamente por WhatsApp. Que comience el festín!
          </p>
          <a
            href="#menu"
            className="inline-block bg-primary text-primary-foreground font-bold py-4 px-8 rounded-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 viking-button"
          >
            Ver Menú Completo
          </a>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contacto" className="py-16 md:py-24 bg-primary text-primary-foreground">
        <div className="container text-center">
          <h2 className="viking-title text-4xl md:text-5xl mb-12">Contactanos</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="viking-shield p-8">
              <div className="text-4xl mb-4">📍</div>
              <h3 className="font-bold text-lg mb-2">Ubicación</h3>
              <p>Calle 47B # 27 - 06 Local 2</p>
              <p>Barranquilla, Colombia</p>
            </div>

            <div className="viking-shield p-8">
              <div className="text-4xl mb-4">⏰</div>
              <h3 className="font-bold text-lg mb-2">Horario</h3>
              <p>Martes a Domingo</p>
              <p>4:00 PM - 11:00 PM</p>
            </div>

            <div className="viking-shield p-8">
              <div className="text-4xl mb-4">📱</div>
              <h3 className="font-bold text-lg mb-2">Teléfono</h3>
              <p>+57 3022525442</p>
              <p className="text-sm mt-2">WhatsApp disponible</p>
            </div>
          </div>

          <div className="mt-12">
            <a
              href="https://wa.me/573022525442"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-green-600 text-white font-bold py-4 px-8 rounded-lg hover:bg-green-700 transition-all duration-300 hover:-translate-y-1"
            >
              Chatea con nosotros en WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-dark text-white py-8">
        <div className="container text-center">
          <p className="font-bold mb-2">Fichi's BBQ - Donde los Guerreros Comen</p>
          <p className="text-sm text-gray-400">
            Hecho con fuego y pasión por la buena comida
          </p>
        </div>
      </footer>

      {/* Floating Cart */}
      <FloatingCart />
    </div>
  );
}
