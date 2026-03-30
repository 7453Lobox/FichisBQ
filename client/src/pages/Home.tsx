import MenuCard from '@/components/MenuCard';
import FloatingCart from '@/components/FloatingCart';
import CategoryCard from '@/components/CategoryCard';
import { useState, useEffect } from 'react';
import React from 'react';
import menuData from '@/lib/menuData.json';
import { useAuth } from '@/_core/hooks/useAuth';
import { useTheme } from '@/contexts/ThemeContext';
import { getDishImage } from '@/lib/dishImages';
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

  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

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
      'Hamburguesas': 'https://d2xsxph8kpxj0f.cloudfront.net/310519663461231402/ZAf6EHxtQifi3Kavc8aaUS/hamburguesa-gourmet-viking.webp',
      'Perros Calientes': 'https://d2xsxph8kpxj0f.cloudfront.net/310519663461231402/ZAf6EHxtQifi3Kavc8aaUS/perro-caliente-viking.webp',
      'Sandwich Panini': 'https://d2xsxph8kpxj0f.cloudfront.net/310519663461231402/ZAf6EHxtQifi3Kavc8aaUS/sandwich-panini-viking.webp',
      'Salchipapas y Patatas': 'https://d2xsxph8kpxj0f.cloudfront.net/310519663461231402/ZAf6EHxtQifi3Kavc8aaUS/salchipapas-viking.webp',
      'Patatas Mini': 'https://d2xsxph8kpxj0f.cloudfront.net/310519663461231402/ZAf6EHxtQifi3Kavc8aaUS/patatas-mini-viking.webp',
      'Asados': 'https://d2xsxph8kpxj0f.cloudfront.net/310519663461231402/ZAf6EHxtQifi3Kavc8aaUS/asados-viking.webp',
      'Entradas': 'https://d2xsxph8kpxj0f.cloudfront.net/310519663461231402/ZAf6EHxtQifi3Kavc8aaUS/entradas-viking.webp',
      'Chuzos Desgranados': 'https://d2xsxph8kpxj0f.cloudfront.net/310519663461231402/ZAf6EHxtQifi3Kavc8aaUS/chuzos-viking.webp',
      'Especiales': 'https://d2xsxph8kpxj0f.cloudfront.net/310519663461231402/ZAf6EHxtQifi3Kavc8aaUS/especiales-viking.webp',
      'Adicionales': 'https://d2xsxph8kpxj0f.cloudfront.net/310519663461231402/ZAf6EHxtQifi3Kavc8aaUS/adicionales-viking.webp',
    };
    return imageMap[categoryName] || 'https://via.placeholder.com/400x300';
  };

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
              className="p-2 rounded-lg bg-gray-200 dark:bg-accent text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-accent/80 transition-colors"
              title="Cambiar tema"
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <a href="https://wa.me/573022525442" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-xs md:text-sm font-bold text-primary dark:text-white hover:text-accent dark:hover:text-accent transition-colors whitespace-nowrap">
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/WhatsApp.svg/1200px-WhatsApp.svg.png" alt="WhatsApp" className="w-5 h-5 object-contain" />
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

          {/* Category Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Object.entries(menuData).map(([categoryName, platos]) => (
              <CategoryCard
                key={categoryName}
                nombre={categoryName}
                imagen={getCategoryImage(categoryName)}
                platos={platos}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section id="galeria" className="py-16 md:py-24 bg-white">
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
      <section className="py-16 md:py-24 bg-white">
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
      <section className="py-16 md:py-24 bg-primary text-primary-foreground">
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
          <h2 className="viking-title text-4xl md:text-5xl text-primary mb-6 font-black dark:bg-white/80 dark:text-primary dark:px-4 dark:py-2 dark:rounded-lg dark:inline-block">
            Listo para la Conquista
          </h2>
          <p className="text-xl text-foreground mb-8 max-w-2xl mx-auto">
            Explora nuestro menú épico, agrega tus platos favoritos<br />
            y envía tu pedido directamente por WhatsApp.<br />
            Que comience el festín!
          </p>
          <div className="flex justify-center">
            <a
              href="#menu"
              className="inline-block bg-primary text-primary-foreground font-bold py-4 px-8 rounded-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 viking-button"
            >
              Ver Menú Completo
            </a>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contacto" className="py-16 md:py-24 bg-primary text-primary-foreground">
        <div className="container text-center">
          <h2 className="viking-title text-4xl md:text-5xl mb-12 text-black dark:text-white font-black">Contactanos</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <a href="https://www.google.com/maps/place/fichi's/@10.9703195,-74.7917297,3a,75y,344.22h,91.64t/data=!3m7!1e1!3m5!1subFgpyHJFcpBJNwTl4F01g!2e0!6shttps:%2F%2Fstreetviewpixels-pa.googleapis.com%2Fv1%2Fthumbnail%3Fcb_client%3Dmaps_sv.tactile%26w%3D900%26h%3D600%26pitch%3D-1.644396754728291%26panoid%3DubFgpyHJFcpBJNwTl4F01g%26yaw%3D344.21720122086276!7i16384!8i8192!4m16!1m9!3m8!1s0x8ef42d5b31357cbb:0x91c6751df5cc8232!2sfichi's!8m2!3d10.9703807!4d-74.791762!9m1!1b1!16s%2Fg%2F11v62whjb6!3m5!1s0x8ef42d5b31357cbb:0x91c6751df5cc8232!8m2!3d10.9703807!4d-74.791762!16s%2Fg%2F11v62whjb6?entry=ttu&g_ep=EgoyMDI2MDMxOC4xIKXMDSoASAFQAw%3D%3D" target="_blank" rel="noopener noreferrer" className="viking-shield p-8 hover:shadow-xl transition-all duration-300 cursor-pointer">
              <div className="text-4xl mb-4">📍</div>
              <h3 className="font-bold text-lg md:text-xl mb-2 text-black">Ubicación</h3>
              <p className="font-semibold text-base md:text-lg text-black">Calle 47B # 27 - 06 Local 2</p>
              <p className="font-semibold text-base md:text-lg text-black">Barranquilla, Colombia</p>
              <p className="text-xs mt-2 text-accent font-bold hover:text-accent/80 transition-colors">Haz clic para ver en Google Maps</p>
            </a>

            <div className="viking-shield p-8">
              <div className="text-4xl mb-4">⏰</div>
              <h3 className="font-bold text-lg md:text-xl mb-2 text-black">Horario</h3>
              <p className="font-semibold text-base md:text-lg text-black">Martes a Domingo</p>
              <p className="font-semibold text-base md:text-lg text-black">4:00 PM - 11:00 PM</p>
            </div>

            <div className="viking-shield p-8">
              <div className="text-4xl mb-4">
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/WhatsApp.svg/1200px-WhatsApp.svg.png" alt="WhatsApp" className="w-12 h-12 object-contain inline-block" />
              </div>
              <h3 className="font-bold text-lg md:text-xl mb-2 text-black">Teléfono</h3>
              <p className="font-semibold text-base md:text-lg text-black">+57 3022525442</p>
              <a href="https://wa.me/573022525442" target="_blank" rel="noopener noreferrer" className="text-sm mt-2 text-accent font-bold hover:text-accent/80 transition-colors cursor-pointer block">WhatsApp disponible</a>
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
          <h3 className="text-2xl font-bold mb-6 text-black dark:text-white">Síguenos en Redes Sociales</h3>
          <div className="flex justify-center gap-6 flex-wrap">
            <a
              href="https://www.instagram.com/fichisbq/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center w-14 h-14 bg-white text-primary rounded-full hover:bg-accent hover:text-white transition-all duration-300 transform hover:scale-110 shadow-lg"
              title="Instagram"
            >
              <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.057-1.645.069-4.849.069-3.204 0-3.584-.012-4.849-.069-3.259-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1112.324 0 6.162 6.162 0 01-12.324 0zM12 16a4 4 0 110-8 4 4 0 010 8zm4.965-10.322a1.44 1.44 0 110-2.881 1.44 1.44 0 010 2.881z"/>
              </svg>
            </a>
            <a
              href="https://www.facebook.com/fichisbq/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center w-14 h-14 bg-white text-primary rounded-full hover:bg-accent hover:text-white transition-all duration-300 transform hover:scale-110 shadow-lg"
              title="Facebook"
            >
              <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </a>
            <a
              href="https://wa.me/573022525442"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center w-14 h-14 rounded-full hover:shadow-xl transition-all duration-300 transform hover:scale-110 shadow-lg"
              title="WhatsApp"
            >
              <img src="https://d2xsxph8kpxj0f.cloudfront.net/310519663461231402/ZAf6EHxtQifi3Kavc8aaUS/whatsapp-icon_52c12804.webp" alt="WhatsApp" className="w-14 h-14 object-contain" />
            </a>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="viking-title text-4xl md:text-5xl text-primary mb-4">
              Lo Que Dicen Nuestros Clientes
            </h2>
            <div className="h-1 w-24 bg-accent mx-auto" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-white border-2 border-accent rounded-lg p-6 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-yellow-500">⭐⭐⭐⭐⭐</span>
              </div>
              <p className="text-black mb-4 italic">"¡La mejor comida BBQ que he probado! Los platos son increíbles y el servicio es excelente. Definitivamente volveré."</p>
              <p className="font-bold text-black">- Carlos M.</p>
              <p className="text-sm text-gray-600">Cliente verificado en Google</p>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-white border-2 border-accent rounded-lg p-6 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-yellow-500">⭐⭐⭐⭐⭐</span>
              </div>
              <p className="text-black mb-4 italic">"Fichi's es un lugar épico. La temática vikinga es genial y la comida es de primera calidad. Recomendado 100%."</p>
              <p className="font-bold text-black">- María L.</p>
              <p className="text-sm text-gray-600">Cliente verificado en Google</p>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-white border-2 border-accent rounded-lg p-6 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-yellow-500">⭐⭐⭐⭐⭐</span>
              </div>
              <p className="text-black mb-4 italic">"Cada plato es una obra maestra. El carrito de compras por WhatsApp es muy práctico. ¡Excelente experiencia!"</p>
              <p className="font-bold text-black">- Juan P.</p>
              <p className="text-sm text-gray-600">Cliente verificado en Google</p>
            </div>
          </div>

          <div className="text-center mt-12">
            <a
              href="https://www.google.com/maps/place/fichi's/@10.970249,-74.7930763,18z/data=!4m16!1m9!3m8!1s0x8ef42d5b31357cbb:0x91c6751df5cc8232!2sfichi's!8m2!3d10.9703807!4d-74.791762!9m1!1b1!16s%2Fg%2F11v62whjb6!3m5!1s0x8ef42d5b31357cbb:0x91c6751df5cc8232!8m2!3d10.9703807!4d-74.791762!16s%2Fg%2F11v62whjb6?entry=ttu&g_ep=EgoyMDI2MDMxOC4xIKXMDSoASAFQAw%3D%3D"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-primary text-primary-foreground font-bold py-3 px-6 rounded-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              Ver Más Reseñas en Google
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
