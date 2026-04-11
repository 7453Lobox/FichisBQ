import FloatingCart from '@/components/FloatingCart';
import CategoryCard from '@/components/CategoryCard';
import MenuCard from '@/components/MenuCard';
import { useState, useEffect, useRef } from 'react';
import React from 'react';
import menuData from '@/lib/menuData.json';
import { useAuth } from '@/_core/hooks/useAuth';
import { useTheme } from '@/contexts/ThemeContext';
import { useCart } from '@/contexts/CartContext';
import { getDishImage } from '@/lib/dishImages';
import { Sun, Moon, ArrowLeft } from 'lucide-react';

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
  const { items } = useCart();

  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // Scroll animation observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = document.querySelectorAll('.scroll-slide-up, .scroll-fade-in');
    elements.forEach((el) => observer.observe(el));

    return () => {
      elements.forEach((el) => observer.unobserve(el));
    };
  }, [selectedCategory]);

  const isOpen = () => {
    const day = currentTime.getDay();
    const hours = currentTime.getHours();
    const minutes = currentTime.getMinutes();
    const timeInMinutes = hours * 60 + minutes;
    if (day === 1) return false;
    const openTime = 16 * 60;
    const closeTime = 23 * 60;
    return timeInMinutes >= openTime && timeInMinutes < closeTime;
  };

  const getCategoryImage = (categoryName: string): string => {
    const imageMap: { [key: string]: string } = {
      'Hamburguesas': 'https://d2xsxph8kpxj0f.cloudfront.net/310519663461231402/ZAf6EHxtQifi3Kavc8aaUS/dublin-hamburguesa-nCWdTTqQypcmyQv3mN7wqY.webp',
      'Perros Calientes': 'https://d2xsxph8kpxj0f.cloudfront.net/310519663461231402/ZAf6EHxtQifi3Kavc8aaUS/perro-hawaiano-dZqCQpavCNWwakR5mvmamx.webp',
      'Sandwich Panini': 'https://d2xsxph8kpxj0f.cloudfront.net/310519663461231402/ZAf6EHxtQifi3Kavc8aaUS/sandwich-gratinado-fbUfKHgGYSgaGsoCk2GKPV.webp',
      'Salchipapas y Patatas': 'https://d2xsxph8kpxj0f.cloudfront.net/310519663461231402/ZAf6EHxtQifi3Kavc8aaUS/salchipapas-gratinada-AVHv5n4M4Thbxbj2EogMci.webp',
      'Patatas Mini': 'https://d2xsxph8kpxj0f.cloudfront.net/310519663461231402/ZAf6EHxtQifi3Kavc8aaUS/salchipapas-gratinada-AVHv5n4M4Thbxbj2EogMci.webp',
      'Asados': 'https://d2xsxph8kpxj0f.cloudfront.net/310519663461231402/ZAf6EHxtQifi3Kavc8aaUS/pechuga-plancha-8D2eX7LMJ4YtD4L3LmebTc.webp',
      'Entradas': 'https://d2xsxph8kpxj0f.cloudfront.net/310519663461231402/ZAf6EHxtQifi3Kavc8aaUS/chorizo-ternera-bollo-MUzLRbGAnPCDTwwQ9Hn4yA.webp',
      'Chuzos Desgranados': 'https://d2xsxph8kpxj0f.cloudfront.net/310519663461231402/ZAf6EHxtQifi3Kavc8aaUS/salchipapas-gratinada-AVHv5n4M4Thbxbj2EogMci.webp',
      'Especiales': 'https://d2xsxph8kpxj0f.cloudfront.net/310519663461231402/ZAf6EHxtQifi3Kavc8aaUS/fichis-suprema-BQTDs3jRPXsojZfyrxvcA4.webp',
      'Adicionales': 'https://d2xsxph8kpxj0f.cloudfront.net/310519663461231402/ZAf6EHxtQifi3Kavc8aaUS/patacon-x5-oXJGdWift7tfeKEw5JbkUR.webp',
    };
    return imageMap[categoryName] || 'https://via.placeholder.com/400x300';
  };

  const selectedCategoryPlatos = selectedCategory 
    ? (menuData[selectedCategory as keyof typeof menuData] as any[]) || []
    : [];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-30 bg-white dark:bg-primary border-b-4 border-accent shadow-lg">
        <div className="container py-1 md:py-2 flex items-center justify-between gap-4">
          <a href="#" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="cursor-pointer">
            <img src="https://d2xsxph8kpxj0f.cloudfront.net/310519663461231402/ZAf6EHxtQifi3Kavc8aaUS/fichi-logo_3195d514.png" alt="Fichi's BBQ" className="h-12 md:h-16 object-contain drop-shadow-lg hover:drop-shadow-2xl transition-all duration-300 hover:scale-105" />
          </a>
          
          <div className="flex-1 text-center hidden md:block">
            <p className="text-2xl md:text-3xl font-bold text-primary dark:text-accent italic" style={{fontFamily: 'Georgia, serif'}}>Come Rico, Bebe Rico!!!</p>
          </div>
          
          <div className="flex items-center gap-6 ml-auto">
            <div className="hidden lg:flex gap-6 items-center">
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-accent/20 dark:bg-accent/30">
                <span className={`w-3 h-3 rounded-full ${isOpen() ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></span>
                <span className="text-sm font-bold text-foreground dark:text-white">{isOpen() ? 'Abierto' : 'Cerrado'}</span>
              </div>
              <a href="#menu" className="font-semibold text-foreground dark:text-white hover:text-primary dark:hover:text-accent transition-colors">
                Menu
              </a>
              <a href="#galeria" className="font-semibold text-foreground dark:text-white hover:text-primary dark:hover:text-accent transition-colors">
                Galeria
              </a>
              <a href="#contacto" className="font-semibold text-foreground dark:text-white hover:text-primary dark:hover:text-accent transition-colors">
                Contacto
              </a>
            </div>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-gray-200 dark:bg-transparent text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-transparent transition-colors"
              title="Cambiar tema"
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <a href="https://wa.me/573022525442" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center text-xs md:text-sm font-bold text-primary dark:text-white hover:text-accent dark:hover:text-accent transition-colors">
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/WhatsApp.svg/1200px-WhatsApp.svg.png" alt="WhatsApp" className="w-5 h-5 object-contain" />
            </a>
            <button
              onClick={() => {
                const cartBtn = document.querySelector('[aria-label="Abrir carrito"]') as HTMLButtonElement;
                if (cartBtn) cartBtn.click();
              }}
              className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors relative"
              aria-label="Abrir carrito desde navbar"
              title="Carrito de compras"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {items.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-accent text-accent-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                  {items.length}
                </span>
              )}
            </button>
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
              Donde los guerreros se reúnen para disfrutar<br className="hidden md:block" /> de la mejor comida BBQ
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
            <h2 className="viking-title text-4xl md:text-5xl text-primary mb-4 font-black dark:bg-white/80 dark:text-primary dark:px-4 dark:py-2 dark:rounded-lg dark:inline-block">
              Nuestro<br />Menú Épico
            </h2>
            <div className="h-1 w-24 bg-accent mx-auto" />
          </div>

          {/* Show categories or dishes based on selection */}
          {!selectedCategory ? (
            // Category Cards Grid
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.entries(menuData).map(([categoryName, platos]) => (
                <div
                  key={categoryName}
                  onClick={() => setSelectedCategory(categoryName)}
                  className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer border-2 border-accent"
                >
                  <div className="relative aspect-square overflow-hidden">
                    <img
                      src={getCategoryImage(categoryName)}
                      alt={categoryName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4 text-center">
                    <h3 className="font-black text-3xl text-black mb-3">{categoryName}</h3>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedCategory(categoryName);
                      }}
                      className="bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-2 rounded font-semibold transition-colors"
                    >
                      Menú
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            // Dishes Grid with Back Button
            <div>
              {/* Back Button */}
              <div className="flex items-center justify-between mb-8">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className="flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-3 rounded-lg font-semibold transition-colors"
                >
                  <ArrowLeft size={20} />
                  Atrás
                </button>
                <h2 className="text-3xl md:text-4xl font-black text-black">
                  {selectedCategory}
                </h2>
                <div className="w-24" /> {/* Spacer for centering */}
              </div>

              {/* Dishes Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
                {selectedCategoryPlatos.map((plato: any) => (
                  <MenuCard
                    key={plato.nombre}
                    id={plato.nombre.toLowerCase().replace(/\s+/g, '-')}
                    nombre={plato.nombre}
                    descripcion={plato.descripcion}
                    precio={plato.precio}
                    categoria={selectedCategory}
                    imagen={getDishImage(plato.nombre)}
                    onAddToCart={() => setSelectedCategory(null)}
                  />
                ))}
              </div>

              {/* Other Categories Below */}
              <div className="mt-20 pt-16 border-t-4 border-accent">
                <h3 className="text-2xl font-black text-black mb-8 text-center">
                  Otras Categorías
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {Object.entries(menuData).map(([categoryName, platos]) => 
                    categoryName !== selectedCategory ? (
                      <div
                        key={categoryName}
                        onClick={() => setSelectedCategory(categoryName)}
                        className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer border-2 border-accent"
                      >
                        <div className="relative aspect-square overflow-hidden">
                          <img
                            src={getCategoryImage(categoryName)}
                            alt={categoryName}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="p-4 text-center">
                          <h3 className="font-black text-2xl text-black mb-3">{categoryName}</h3>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedCategory(categoryName);
                            }}
                            className="bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-2 rounded font-semibold transition-colors text-sm"
                          >
                            Ver Menú
                          </button>
                        </div>
                      </div>
                    ) : null
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Gallery Section */}
      <section id="galeria" className="py-16 md:py-24 bg-white scroll-slide-up">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="viking-title text-4xl md:text-5xl text-primary mb-4 font-black">
              Galería en Vivo
            </h2>
            <div className="h-1 w-24 bg-accent mx-auto" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { id: 1, src: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663461231402/ZAf6EHxtQifi3Kavc8aaUS/gallery-eating-1-29mCR4wAsXFDjizF7bK5Xf.webp', alt: 'Mujer disfrutando carnes BBQ' },
              { id: 2, src: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663461231402/ZAf6EHxtQifi3Kavc8aaUS/gallery-eating-2-5DCFg2GaaDFkUomEUY9uKZ.webp', alt: 'Amigos disfrutando hamburguesas' },
              { id: 3, src: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663461231402/ZAf6EHxtQifi3Kavc8aaUS/gallery-eating-3-4zi2eXbdsdpngN7hXBdAQJ.webp', alt: 'Hombre disfrutando pechuga a la plancha' },
              { id: 4, src: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663461231402/ZAf6EHxtQifi3Kavc8aaUS/gallery-eating-4-NMJ5tXFhZMnQpwqaqJ4fWb.webp', alt: 'Pareja disfrutando festín BBQ' },
              { id: 5, src: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663461231402/ZAf6EHxtQifi3Kavc8aaUS/gallery-eating-5-9HC6kUUmkBAu7ccZANwvCh.webp', alt: 'Hombre mordiendo hamburguesa jugosa' },
              { id: 6, src: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663461231402/ZAf6EHxtQifi3Kavc8aaUS/gallery-eating-6-2nTNnGBr8azByhazqssSAp.webp', alt: 'Familia disfrutando salchipapas' },
            ].map((photo) => (
              <div key={photo.id} className="rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 group">
                <div className="relative aspect-square bg-muted overflow-hidden">
                  <img
                    src={photo.src}
                    alt={photo.alt}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Food Showcase Section */}
      <section className="py-16 md:py-24 bg-white scroll-slide-up">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="viking-title text-4xl md:text-5xl text-primary mb-6 font-black">
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
      <section className="py-16 md:py-24 bg-primary text-primary-foreground scroll-slide-up">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="viking-title text-4xl md:text-5xl mb-4 font-black">
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
          <h2 className="viking-title text-4xl md:text-5xl text-primary mb-6 font-black">
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
          <h2 className="viking-title text-4xl md:text-5xl mb-12 font-black">Contactanos</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="viking-shield p-8">
              <div className="text-4xl mb-4">📍</div>
              <h3 className="font-bold text-lg mb-2 text-black">Ubicación</h3>
              <p className="text-black">Calle 47B # 27 - 06 Local 2</p>
              <p className="text-black">Barranquilla, Colombia</p>
              <a href="https://www.google.com/maps/@10.9703195,-74.7917297,3a,75y,348.63h,89.73t/data=!3m7!1e1!3m5!1subFgpyHJFcpBJNwTl4F01g!2e0!6shttps:%2F%2Fstreetviewpixels-pa.googleapis.com%2Fv1%2Fthumbnail%3Fcb_client%3Dmaps_sv.tactile%26w%3D900%26h%3D600%26pitch%3D0.27407572451750184%26panoid%3DubFgpyHJFcpBJNwTl4F01g%26yaw%3D348.6278044249931!7i16384!8i8192?entry=ttu&g_ep=EgoyMDI2MDQwMS4wIKXMDSoASAFQAw%3D%3D" target="_blank" rel="noopener noreferrer" className="inline-block mt-3 bg-primary text-accent font-bold py-2 px-6 rounded-full hover:opacity-90 transition-all text-sm">Ver en Google Maps</a>
            </div>

            <div className="viking-shield p-8">
              <div className="text-4xl mb-4">⏰</div>
              <h3 className="font-bold text-lg mb-2 text-black">Horario</h3>
              <p className="text-black">Martes a Domingo</p>
              <p className="text-black">4:00 PM - 11:00 PM</p>
            </div>

            <div className="viking-shield p-8">
              <div className="text-4xl mb-4">📱</div>
              <h3 className="font-bold text-lg mb-2 text-black">Teléfono</h3>
              <p className="text-black">+57 3022525442</p>
              <p className="text-sm mt-2 text-black">WhatsApp disponible</p>
              <a href="https://wa.me/573022525442?text=Hola%20Fichi's%20BQ%2C%20quisiera%20hacer%20un%20rico%20pedido" target="_blank" rel="noopener noreferrer" className="inline-block mt-2 transition-opacity hover:opacity-80" title="WhatsApp">
                <img src="https://d2xsxph8kpxj0f.cloudfront.net/310519663461231402/ZAf6EHxtQifi3Kavc8aaUS/whatsapp-logo_f5daf00e.png" alt="WhatsApp" className="w-10 h-10" />
              </a>
            </div>
          </div>

          <div className="mt-12">
            <a
              href="https://wa.me/573022525442?text=Hola%20Fichi's%20BQ%2C%20quisiera%20hacer%20un%20rico%20pedido"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-green-600 text-white font-bold py-4 px-8 rounded-lg hover:bg-green-700 transition-all duration-300 hover:-translate-y-1"
            >
              Chatea con nosotros en WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 md:py-24 bg-background scroll-slide-up">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="viking-title text-4xl md:text-5xl text-primary mb-4 font-black dark:bg-white/80 dark:text-primary dark:px-4 dark:py-2 dark:rounded-lg dark:inline-block">
              Lo Que Dicen Nuestros Clientes
            </h2>
            <div className="h-1 w-24 bg-accent mx-auto" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { stars: 5, text: "¡La mejor comida BBQ que he probado! Los platos son increíbles y el servicio es excelente. Definitivamente volveré.", author: "Carlos M.", verified: true },
              { stars: 5, text: "Fichi's es un lugar épico. La temática vikinga es genial y la comida es de primera calidad. Recomendado 100%.", author: "María L.", verified: true },
              { stars: 5, text: "Cada plato es una obra maestra. El carrito de compras por WhatsApp es muy práctico. ¡Excelente experiencia!", author: "Juan P.", verified: true },
            ].map((testimonial, index) => (
              <div key={index} className="bg-white dark:bg-white/10 rounded-lg p-6 shadow-lg">
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.stars)].map((_, i) => (
                    <span key={i} className="text-yellow-400 text-xl">⭐</span>
                  ))}
                </div>
                <p className="text-black dark:text-black mb-4 italic">"{testimonial.text}"</p>
                <p className="font-bold text-primary dark:text-accent">- {testimonial.author}</p>
                {testimonial.verified && (
                  <p className="text-xs text-black mt-2">Cliente verificado en Google</p>
                )}
              </div>
            ))}
          </div>

          <div className="text-center mt-20">
            <a
              href="https://www.google.com/maps/place/fichi's,+Cra.+27,+Suroccidente,+Barranquilla,+Atl%C3%A1ntico/@10.9703807,-74.791762,15z/data=!4m6!3m5!1s0x8ef42d5b31357cbb:0x91c6751df5cc8232!8m2!3d10.9703807!4d-74.791762!16s%2Fg%2F11v62whjb6?utm_campaign=ml-ardl-aht_2025&g_ep=Eg1tbF8yMDI2MDQwMV8wIJvbDyoASAJQAQ%3D%3D"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-primary text-accent font-bold py-3 px-8 rounded-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              Ver todas nuestras reseñas en Google
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-dark text-white py-12">
        <div className="border-t border-primary/30 mx-[20%] mb-8"></div>
        <div className="container">
          {/* Main Footer Content - 3 Column Layout */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start mb-8 order-1 md:order-none">
            {/* Center Column - Main Info and Social - First on mobile */}
            <div className="text-center order-first md:order-2">
              <p className="font-bold text-primary mb-2 text-base">Fichi's BBQ - Donde Comen los Guerreros</p>
              <p className="text-sm text-black mb-4">
                Hecho con fuego y pasión por la buena comida
              </p>
              
              {/* Social Icons */}
              <div className="flex justify-center gap-4 mb-4">
                <a href="https://instagram.com/fichisbq" target="_blank" rel="noopener noreferrer" className="transition-opacity hover:opacity-80" title="Instagram">
                  <img src="https://d2xsxph8kpxj0f.cloudfront.net/310519663461231402/ZAf6EHxtQifi3Kavc8aaUS/instagram_icon_9551fcdb.png" alt="Instagram" className="w-9 h-9" />
                </a>
                <a href="https://facebook.com/fichisbq" target="_blank" rel="noopener noreferrer" className="transition-opacity hover:opacity-80" title="Facebook">
                  <img src="https://d2xsxph8kpxj0f.cloudfront.net/310519663461231402/ZAf6EHxtQifi3Kavc8aaUS/facebook_icon_7ea649a7.png" alt="Facebook" className="w-9 h-9" />
                </a>
                <a href="https://wa.me/573022525442?text=Hola%20Fichi's%20BQ%2C%20quisiera%20hacer%20un%20rico%20pedido" target="_blank" rel="noopener noreferrer" className="transition-opacity hover:opacity-80" title="WhatsApp">
                  <img src="https://d2xsxph8kpxj0f.cloudfront.net/310519663461231402/ZAf6EHxtQifi3Kavc8aaUS/whatsapp_icon_86efb8be.png" alt="WhatsApp" className="w-9 h-9" />
                </a>
              </div>
              
              {/* Copyright */}
              <p className="text-xs text-black">Copyright © Fichi's BBQ. Todos los derechos reservados.</p>
            </div>

            {/* Left Column - SIC Logo and Legal Info - Second on mobile */}
            <div className="flex flex-col items-center md:items-start order-2 md:order-1">
              {/* SIC Logo */}
              <a 
                href="https://www.sic.gov.co/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-block cursor-pointer transition-opacity hover:opacity-80 mb-4"
                title="Superintendencia de Industria y Comercio"
              >
                <img 
                  src="https://d2xsxph8kpxj0f.cloudfront.net/310519663461231402/ZAf6EHxtQifi3Kavc8aaUS/sic-logo-hq-brown_3556b97a.png" 
                  alt="SIC" 
                  className="h-10 w-auto"
                />
              </a>
              
              {/* Legal Information */}
              <p className="text-xs text-primary leading-relaxed text-center md:text-left">
                El gramaje de cada proteína corresponde a su peso en crudo.
              </p>
              <p className="text-xs text-primary leading-relaxed text-center md:text-left mt-1">
                Todos nuestros precios incluyen impuestos.
              </p>
              <p className="text-xs text-primary leading-relaxed text-center md:text-left mt-1">
                Fotos de referencia publicitaria (IA).
              </p>
              <p className="text-xs text-primary leading-relaxed text-center md:text-left mt-1">
                Sujeto a disponibilidad y cobertura del punto de venta.
              </p>
            </div>

            {/* Right Column - CompuPhone Logo and Credits - Third on mobile */}
            <div className="flex flex-col items-center md:items-center order-3 md:order-3">
              <p className="text-xs text-primary mb-2 text-center">Desarrollado por</p>
              <a 
                href="https://www.facebook.com/CompuPhoneBarranquilla/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-block cursor-pointer transition-opacity hover:opacity-80 mb-2"
                title="CompuPhone"
              >
                <img 
                  src="https://d2xsxph8kpxj0f.cloudfront.net/310519663461231402/ZAf6EHxtQifi3Kavc8aaUS/compuphone-logo_eaabed22.png" 
                  alt="CompuPhone" 
                  className="h-20 w-auto"
                />
              </a>
              <a 
                href="https://www.facebook.com/CompuPhoneBarranquilla/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline transition-colors text-sm font-semibold"
              >
                CompuPhone
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating Cart - Always on top */}
      <FloatingCart />
    </div>
  );
}
