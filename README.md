# 🌊 Sensorificación del Río Claro - Pucón

Dashboard de monitoreo hidrológico en tiempo real para el Río Claro en Pucón, Chile.

## 🚀 Características

- **Monitoreo en tiempo real** de variables hidrológicas
- **4 tipos de métricas**: Flujo, Nivel, Caudal y Velocidad
- **Visualizaciones especializadas** según el tipo de variable
- **Tooltips informativos** con explicaciones técnicas
- **Modo pantalla completa** para análisis detallado
- **Sidebar colapsable** para optimizar espacio
- **Tema claro/oscuro** con modo automático
- **Animaciones fluidas** y micro-interacciones
- **Diseño responsivo** para todos los dispositivos

## 📋 Requisitos Previos

- **Node.js** (versión 16 o superior)
- **npm** o **yarn**

## ⚡ Instalación y Ejecución

### 1. Clonar el repositorio
```bash
git clone https://github.com/leftra123/mock-pucon.git
cd mock-pucon
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Ejecutar en modo desarrollo
```bash
npm run dev
```

### 4. Abrir en el navegador
```
http://localhost:5173
```

## 🛠️ Scripts Disponibles

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Inicia el servidor de desarrollo |
| `npm run build` | Construye la aplicación para producción |
| `npm run preview` | Previsualiza la build de producción |
| `npm run lint` | Ejecuta el linter de código |

## 📊 Variables Monitoreadas

### Flujo (m³/s)
Volumen de agua que pasa por una sección del río por segundo. Representado con **gráfico de área** para mostrar el flujo continuo.

### Nivel (m)
Altura del agua sobre un punto de referencia. Visualizado con **gráfico de barras** para representar mediciones discretas.

### Caudal (L/s)
Cantidad específica de agua que fluye. Mostrado con **gráfico de líneas** para precisión en las mediciones.

### Velocidad (m/s)
Velocidad del flujo del agua. Representado con **gráfico de área suave** para mostrar el movimiento continuo.

## 🎨 Funcionalidades de la Interfaz

### Panel Lateral (Variables)
- **Navegación por métricas** con tooltips explicativos
- **Botón de colapso** para mostrar solo iconos
- **Estado del sistema** con indicador visual

### Dashboard Principal
- **Gráfico principal** con 4 tipos de visualización
- **Tarjetas de métricas** con sparklines de tendencia
- **Gráfico comparativo** entre estaciones
- **Tarjeta de temperatura** con mini-gráfico

### Controles
- **Rangos temporales**: 30m, 1h, 6h, 24h
- **Modo pantalla completa** para análisis detallado
- **Selector de tema**: Claro, Oscuro, Automático
- **Notificaciones** del sistema

## 🔧 Tecnologías Utilizadas

- **React 18** con TypeScript
- **Vite** como bundler
- **Tailwind CSS** para estilos
- **Recharts** para visualizaciones
- **Framer Motion** para animaciones
- **React CountUp** para animaciones numéricas
- **Lucide React** para iconos

## 📱 Responsividad

El dashboard está optimizado para:
- **Desktop** (1024px+)
- **Tablet** (768px - 1023px)
- **Mobile** (320px - 767px)

## 🎯 Estructura del Proyecto

```
src/
├── App.tsx          # Componente principal
├── main.tsx         # Punto de entrada
├── index.css        # Estilos globales
└── vite-env.d.ts    # Tipos de Vite
```

## 📈 Datos Simulados

El dashboard utiliza datos simulados que:
- Se actualizan cada **3 segundos**
- Simulan **variaciones naturales** del río
- Incluyen **2 estaciones** de monitoreo
- Generan **tendencias realistas**

## 🚀 Despliegue

### Build para producción
```bash
npm run build
```

Los archivos se generarán en la carpeta `dist/` listos para desplegar en cualquier servidor web estático.

## 📄 Licencia

MIT License

Copyright (c) 2025 Sensorificación del Río Claro - Pucón

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

---

**Desarrollado para el monitoreo hidrológico del Río Claro, Pucón - Chile** 🇨🇱
