# NTT Data - Prueba Técnica Frontend Angular

Aplicación web para la gestión de productos financieros desarrollada con Angular 20 y NgRx.

## Perfil: Senior

Esta solución cumple con todos los requisitos para el perfil **Senior**, implementando las funcionalidades F1 a F6, con énfasis en rendimiento, skeleton loading y responsive design.

## Funcionalidades Implementadas

### F1. Listado de Productos Financieros
- Visualización de productos financieros desde API
- Maquetación según diseño D1

### F2. Búsqueda de Productos
- Campo de búsqueda con debounce (300ms)
- Filtrado en tiempo real por nombre, descripción e ID

### F3. Cantidad de Registros
- Contador de resultados mostrados
- Select para mostrar 5, 10 o 20 registros

### F4. Agregar Producto
- Formulario de creación con validaciones sincrónicas y asincrónicas
- Botones "Agregar" y "Reiniciar"
- Validación de ID único mediante servicio de verificación
- Fecha de revisión calculada automáticamente (1 año después de liberación)
- Maquetación según diseño D2

### F5. Editar Producto
- Menú contextual por producto (diseño D3)
- Navegación a formulario de edición
- Campo ID deshabilitado en modo edición
- Mantiene todas las validaciones de F4

### F6. Eliminar Producto
- Opción de eliminar en menú contextual
- Modal de confirmación (diseño D4)
- Botones "Cancelar" y "Confirmar"

## Stack Tecnológico

- **Framework:** Angular 20 (standalone components)
- **State Management:** NgRx (Store, Effects, Actions, Reducers, Selectors)
- **Styling:** SCSS puro con metodología BEM (sin frameworks de UI)
- **Forms:** Reactive Forms con validaciones sincrónicas y asincrónicas
- **Testing:** Jest con 88.1% de cobertura
- **Build:** Angular CLI + Vite

## Requisitos Previos

- **Node.js:** v22.19.0 (mínimo requerido: >= 18.19.1)
- **npm:** 10.9.3 (mínimo requerido: >= 10.x)

Versiones de Node.js soportadas por Angular 20: ^18.19.1, ^20.11.1 o ^22.0.0

## Instalación

```bash
# Instalar dependencias
npm install
```

## Backend Local

La aplicación requiere un servidor backend local. Para ejecutarlo:

```bash
# En una terminal separada, navegar a la carpeta del backend
cd repo-interview-main

# Instalar dependencias
npm install

# Iniciar servidor
npm run start:dev

# El servidor estará disponible en http://localhost:3002
```

## Comandos Disponibles

```bash
# Servidor de desarrollo
npm start
# Ejecuta: ng serve
# La aplicación estará disponible en http://localhost:4200

# Build de producción
npm run build
# Ejecuta: ng build
# Los artefactos se generarán en dist/

# Build en modo watch (desarrollo)
npm run watch
# Ejecuta: ng build --watch --configuration development

# Ejecutar tests
npm test
# Ejecuta: jest

# Ejecutar tests en modo watch
npm run test:watch
# Ejecuta: jest --watch

# Ejecutar tests con coverage
npm run test:coverage
# Ejecuta: jest --coverage
# Coverage actual: 88.1%
```


## Estructura del Proyecto

```
src/
├── app/
│   ├── components/
│   │   ├── product-list/       # F1, F2, F3, F5, F6
│   │   └── product-form/       # F4, F5
│   ├── core/
│   │   ├── models/             # Interfaces de Product
│   │   ├── services/           # ProductService (API)
│   │   └── helpers/
│   │       ├── validators/     # Validaciones sincrónicas y asincrónicas
│   │       └── utils/          # Utilidades de mapeo de errores
│   ├── shared/
│   │   ├── context-menu/       # Menú contextual (F5, F6)
│   │   └── confirm-dialog/     # Modal de confirmación (F6)
│   └── store/
│       ├── products.actions.ts
│       ├── products.effects.ts
│       ├── products.reducer.ts
│       └── products.selectors.ts
└── environments/
```

## Arquitectura y Buenas Prácticas

### State Management
- **NgRx Store:** Estado centralizado e inmutable
- **Effects:** Manejo de side effects y llamadas HTTP
- **Selectors:** Queries memoizadas y optimizadas

### Clean Code y SOLID
- **Single Responsibility:** Cada componente tiene una responsabilidad única
- **Open/Closed:** Componentes extensibles sin modificación (context-menu reutilizable)
- **Dependency Inversion:** Uso de interfaces y dependency injection
- **Separation of Concerns:** Lógica de negocio en store, presentación en componentes

### Operadores RxJS
- `switchMap` para lecturas (GET) - cancelables
- `concatMap` para mutaciones (POST/PUT/DELETE) - secuenciales y sin pérdida de datos
- `debounceTime` para optimizar búsquedas
- `take(1)` para evitar memory leaks

### Validaciones
**Sincrónicas:**
- ID: required, minLength(3), maxLength(10)
- Nombre: required, minLength(5), maxLength(100)
- Descripción: required, minLength(10), maxLength(200)
- Logo: required
- Fecha liberación: required, dateReleaseTodayOrLater
- Fecha revisión: required, calculada automáticamente

**Asincrónicas:**
- ID único: verificación mediante servicio con debounce (400ms)

### Manejo de Errores
- Validaciones visuales en cada campo del formulario
- Mensajes de error específicos por tipo de validación
- Mapeo de errores HTTP a mensajes legibles
- Fallback de imágenes a iniciales cuando falla la carga

### Performance
- Lazy loading de imágenes con `ngSrc`
- Skeleton loaders durante carga de datos
- Debounce en búsquedas para reducir llamadas

### Responsive Design
- Mobile-first approach
- Diseño adaptativo sin frameworks de UI
- Scroll horizontal en tablas para móviles
- Layout flexible con CSS Grid y Flexbox

## Servicios API

**URL Base:** `http://localhost:3002`

| Endpoint | Método | Descripción |
|----------|--------|-------------|
| `/bp/products` | GET | Obtener todos los productos |
| `/bp/products` | POST | Crear producto |
| `/bp/products/:id` | PUT | Actualizar producto |
| `/bp/products/:id` | DELETE | Eliminar producto |
| `/bp/products/verification/:id` | GET | Verificar existencia de ID |

## Cobertura de Tests

```
File                    Statements   Branches   Functions   Lines
------------------------------------------------------------------
Total                      88.1%      72.4%       90%       89.2%
------------------------------------------------------------------
product-list               100%       100%       100%       100%
product-form               91.7%      71.4%      100%       94.6%
store (actions/effects)    100%       100%       100%       100%
store (reducer/selectors)  100%       100%       100%       100%
services                   100%       100%       100%       100%
validators                 81.8%      69.2%      57.1%      81%
utilities                  100%       91.7%      100%       100%
```

## Decisiones Técnicas Destacadas

1. **NgRx para state management:** Proporciona arquitectura escalable, debugging con DevTools y manejo predecible del estado.

2. **Validadores asíncronos con inject():** Uso de factory functions modernas de Angular para inyección de dependencias en validadores.

3. **BEM sin frameworks:** Implementación de diseños sin Bootstrap/Material.

4. **Skeleton loading:** Mejora la percepción de performance y UX durante cargas.

5. **Image fallback:** Sistema robusto que muestra iniciales cuando las imágenes no cargan.

6. **Componentes reutilizables:** Context-menu y confirm-dialog son agnósticos al dominio.

## Cumplimiento de Requisitos

- Clean Code y SOLID aplicados
- UI Development sin frameworks de estilos
- Manejo de excepciones y mensajes de error visuales
- 88.1% de coverage
- Todas las funcionalidades F1 a F6 implementadas
- Rendimiento optimizado
- Skeleton loaders implementados
- Responsive design mobile-first

## Autor

David Alvarado

## Licencia

Proyecto desarrollado como prueba técnica para NTT Data - 2025


