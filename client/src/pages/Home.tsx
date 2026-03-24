import MenuCard from '@/components/MenuCard';
import FloatingCart from '@/components/FloatingCart';
import { useState } from 'react';
import menuData from '@/lib/menuData.json';
import { useAuth } from '@/_core/hooks/useAuth';
import { useTheme } from '@/contexts/ThemeContext';
import { Sun, Moon } from 'lucide-react';

/**
 * Home Page - Fichi's BBQ Landing Page
 * Design: Viking Banquet Hall Nórdico Moderno
 * Features: Hero, Menu, Gallery, Contact, Shopping Cart
 */
export default function Home() {
  // The userAuth hooks provides authentication state
  // To implement login/logout functionality, simply call logout() or redirect to getLoginUrl()
  let { user, loading, error, isAuthenticated, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = Object.keys(menuData);
  const displayedItems = selectedCategory
    ? menuData[selectedCategory as keyof typeof menuData] || []
    : Object.values(menuData).flat();

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-30 bg-white dark:bg-primary border-b-4 border-accent shadow-lg">
        <div className="container py-3 md:py-4 flex items-center justify-between gap-4">
          <img src="https://d2xsxph8kpxj0f.cloudfront.net/310519663461231402/ZAf6EHxtQifi3Kavc8aaUS/fichi-logo_3195d514.png" alt="Fichi's BBQ" className="h-12 md:h-14 object-contain" />
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
          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-gray-200 dark:bg-accent text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-accent/80 transition-colors"
              title="Cambiar tema"
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <a href="https://wa.me/573022525442" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-xs md:text-sm font-bold text-primary dark:text-white hover:text-accent dark:hover:text-accent transition-colors whitespace-nowrap">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.67-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421-7.403h-.004a9.87 9.87 0 00-4.781 1.149c-1.488.574-2.797 1.483-3.773 2.459-1.844 1.844-2.769 4.302-2.769 6.994 0 1.202.195 2.554.536 3.814.341 1.26.879 2.489 1.541 3.57.662 1.081 1.437 2.011 2.306 2.76 1.844 1.577 4.28 2.457 6.944 2.457 1.202 0 2.554-.195 3.814-.536 1.26-.341 2.489-.879 3.57-1.541 1.081-.662 2.011-1.437 2.76-2.306 1.577-1.844 2.457-4.28 2.457-6.944 0-1.202-.195-2.554-.536-3.814-.341-1.26-.879-2.489-1.541-3.57-.662-1.081-1.437-2.011-2.306-2.76-1.844-1.577-4.28-2.457-6.944-2.457"/></svg>
              +57 3022525442
            </a>
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
            <a href="https://maps.google.com/?q=Calle+47B+27-06+Barranquilla+Colombia" target="_blank" rel="noopener noreferrer" className="viking-shield p-8 hover:shadow-xl transition-all duration-300 cursor-pointer">
              <div className="text-4xl mb-4">📍</div>
              <h3 className="font-bold text-lg mb-2">Ubicación</h3>
              <p className="font-semibold text-white">Calle 47B # 27 - 06 Local 2</p>
              <p className="font-semibold text-white">Barranquilla, Colombia</p>
              <p className="text-xs mt-2 text-accent">Haz clic para ver en Google Maps</p>
            </a>

            <div className="viking-shield p-8">
              <div className="text-4xl mb-4">⏰</div>
              <h3 className="font-bold text-lg mb-2">Horario</h3>
              <p className="font-semibold text-white">Martes a Domingo</p>
              <p className="font-semibold text-white">4:00 PM - 11:00 PM</p>
            </div>

            <div className="viking-shield p-8">
              <div className="text-4xl mb-4">📱</div>
              <h3 className="font-bold text-lg mb-2">Teléfono</h3>
              <p className="font-semibold text-white">+57 3022525442</p>
              <p className="text-sm mt-2 text-accent font-semibold">WhatsApp disponible</p>
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

      {/* Social Media Section */}
      <section className="bg-primary text-primary-foreground py-12">
        <div className="container text-center">
          <h3 className="text-2xl font-bold mb-6">Síguenos en Redes Sociales</h3>
          <div className="flex justify-center gap-6 flex-wrap">
            <a
              href="https://www.instagram.com/fichisbq/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center w-12 h-12 bg-white text-primary rounded-full hover:bg-accent hover:text-white transition-all duration-300 transform hover:scale-110"
              title="Instagram"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.057-1.645.069-4.849.069-3.204 0-3.584-.012-4.849-.069-3.259-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1112.324 0 6.162 6.162 0 01-12.324 0zM12 16a4 4 0 110-8 4 4 0 010 8zm4.965-10.322a1.44 1.44 0 110-2.881 1.44 1.44 0 010 2.881z"/>
              </svg>
            </a>
            <a
              href="https://www.facebook.com/fichisbq/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center w-12 h-12 bg-white text-primary rounded-full hover:bg-accent hover:text-white transition-all duration-300 transform hover:scale-110"
              title="Facebook"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </a>
            <a
              href="https://wa.me/573022525442"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center w-12 h-12 bg-white text-primary rounded-full hover:bg-accent hover:text-white transition-all duration-300 transform hover:scale-110"
              title="WhatsApp"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.67-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421-7.403h-.004a9.87 9.87 0 00-4.781 1.149c-1.488.574-2.797 1.483-3.773 2.459-1.844 1.844-2.769 4.302-2.769 6.994 0 1.202.195 2.554.536 3.814.341 1.26.879 2.489 1.541 3.57.662 1.081 1.437 2.011 2.306 2.76 1.844 1.577 4.28 2.457 6.944 2.457 1.202 0 2.554-.195 3.814-.536 1.26-.341 2.489-.879 3.57-1.541 1.081-.662 2.011-1.437 2.76-2.306 1.577-1.844 2.457-4.28 2.457-6.944 0-1.202-.195-2.554-.536-3.814-.341-1.26-.879-2.489-1.541-3.57-.662-1.081-1.437-2.011-2.306-2.76-1.844-1.577-4.28-2.457-6.944-2.457"/>
              </svg>
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground py-8">
        <div className="container text-center">
          <p className="font-bold mb-2 text-lg">Fichi's BBQ - Donde los Guerreros Comen</p>
          <p className="text-sm text-accent font-semibold">
            Hecho con fuego y pasión por la buena comida
          </p>
        </div>
      </footer>

      {/* Floating Cart */}
      <FloatingCart />
    </div>
  );
}
