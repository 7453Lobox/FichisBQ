# Fichi's BBQ - TODO List

## Cambios Visuales y Funcionales

- [x] Reemplazar nombre "Fichi's BBQ" por logo en navegación
- [x] Agregar sección de Redes Sociales (Instagram, Facebook, etc.) en footer
- [x] Agregar icono de WhatsApp antes del número de teléfono
- [x] Mover "Fichi's Suprema" de Salchipapas y Patatas a Especiales
- [x] Agregar "Cerdo a la Plancha" ($21.000) a Carnes
- [x] Agregar "Punta Gorda a la Plancha" ($23.000) a Carnes
- [x] Mejorar contraste en sección Contacto (ubicación, horario, teléfono)
- [x] Mejorar contraste en Footer (texto "Fichi's BBQ - Donde los Guerreros Comen")
- [x] Hacer clickeable la ubicación con Google Maps
- [x] Implementar tema Claro/Oscuro con botón Sol/Luna en esquina superior derecha
- [x] Iniciar siempre en tema oscuro

## Generación de Imágenes

- [ ] Generar imágenes realistas para Entradas (Chorizo, Butifarra, Patacón)
- [ ] Generar imágenes realistas para Salchipapas y Patatas
- [ ] Generar imágenes realistas para Patatas Mini
- [ ] Generar imágenes realistas para Chuzos Desganados
- [ ] Generar imágenes realistas para Hamburguesas
- [ ] Generar imágenes realistas para Perros
- [ ] Generar imágenes realistas para Sandwich Gratinado
- [ ] Generar imágenes realistas para Sandwich Panini
- [ ] Generar imágenes realistas para Carnes (Pechuga, Cerdo, Punta Gorda)
- [ ] Generar imágenes realistas para Adicionales

## Integración de Tercera Imagen

- [ ] Esperar tercera imagen de referencia del usuario
- [ ] Integrar tercera imagen donde sea necesario

## Testing y Entrega

- [ ] Probar tema Claro/Oscuro en todos los navegadores
- [ ] Verificar contraste en tema oscuro y claro
- [ ] Probar Google Maps en ubicación
- [ ] Verificar WhatsApp icon en móvil y desktop
- [ ] Probar todas las imágenes generadas cargan correctamente
- [ ] Guardar checkpoint final
- [ ] Entregar a usuario

## Mejoras Finales Solicitadas

- [x] Destacar el logo con efecto de sombra, brillo o animación
- [x] Aumentar tamaño del slogan "Come Rico, Bebe Rico!!!"
- [x] Mejorar contraste de Ubicación, Horario y Teléfono en Contacto
- [x] Actualizar ubicación de Google Maps con link correcto
- [x] Agregar sección de Testimonios con reseñas de clientes y ⭐


## Cambios Finales Solicitados (Sesión 2)

- [x] Actualizar Git con todos los cambios (imágenes en S3, código en Git)
- [x] Hacer logo clickeable para ir al inicio de la página
- [x] Agregar indicador de estado (Abierto/Cerrado) en tiempo real


## Sistema de Notificaciones de Pedidos (Sesión 3)

- [x] Integrar guardado de pedidos en BD cuando se envían por WhatsApp
- [x] Crear página Admin para ver pedidos en tiempo real (polling cada 5 segundos)
- [x] Agregar funcionalidad para cambiar estado de pedidos (Nuevo → En preparación → Listo → Entregado)
- [x] Crear tests unitarios para procedimientos de órdenes
- [x] Agregar link a panel de administración de pedidos en navegación (solo para admins)
- [x] Implementar colección de datos del cliente (nombre y teléfono) antes de enviar por WhatsApp
- [x] Limpiar carrito después de enviar pedido exitosamente


## Sistema de Autenticación Privado de Admin (Sesión 4)

- [x] Crear tabla adminConfig en BD para almacenar contraseña, email y WhatsApp
- [x] Implementar procedimientos tRPC para login, logout, cambio de contraseña
- [x] Implementar recuperación de contraseña por email y WhatsApp
- [x] Crear página de login privado (/admin/login)
- [x] Crear página de recuperación de contraseña (/admin/recuperar)
- [x] Cambiar URL del panel de pedidos a /admin/pedidos-fichi-bbq (URL privada)
- [x] Remover link de admin de navegación pública
- [x] Crear tests unitarios para autenticación de admin (14 tests)
- [x] Integrar bcrypt para hashing seguro de contraseñas
- [x] Implementar funciones para cambiar email y WhatsApp
- [x] Actualizar contraseña inicial hasheada correctamente
- [x] Implementar recuperación con código de 6 dígitos mostrado en pantalla
- [x] Agregar botón para copiar código al portapapeles
- [x] Validación de código antes de permitir reset de contraseña


## Reorganización del Menú - Tarjetas de Categorías (Sesión 6)

- [x] Actualizar estructura del menú JSON: reorganizar categorías y mover Sandwich Gratinados
- [x] Crear componente CategoryCard para mostrar categorías como tarjetas
- [x] Actualizar componente MenuCard para mostrar descripción y carrito
- [x] Actualizar página Home con nueva lógica de menú
- [x] Eliminar botón "Todos"
- [x] Probar responsividad y guardar checkpoint
