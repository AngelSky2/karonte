# ⚙️ Karonte - Mechanicus Console

Un asistente inteligente con interfaz estilo Warhammer 40K que combina **inteligencia artificial (Gemini)** y **entrada de texto** para gestionar tareas y obtener respuestas. Diseñado como una aplicación web que simula una consola Mechanicus del Adeptus Mechanicus.

## 🎯 Características

- ✅ **Chat con IA (Google Gemini)** - Responde preguntas en tiempo real
- ✅ **Gestor de Tareas** - Crea, edita, elimina y organiza listas de tareas
- ✅ **Interfaz Temática** - Diseño Warhammer 40K (consola Mechanicus verde neon)
- ✅ **Animación IA** - Núcleo pulsante con anillos orbitales animados
- ✅ **Chat en Vivo** - Muestra mensajes al instante con estado "cargando..."
- ✅ **Respuestas por Tab** - Diferentes endpoints según la pestaña activa

## 🛠️ Tech Stack

- **Frontend**: React 18 + Vite 8 (hot module replacement)
- **Backend**: Node.js + Express.js
- **Base de Datos**: SQLite3
- **IA**: Google Gemini API (gemini-3.5-flash)
- **Síntesis de Voz**: Google Translate TTS (chunked para textos largos)

## 📋 Requisitos Previos

- **Node.js** 16+ ([descargar](https://nodejs.org/))
- **npm** (incluido con Node.js)
- **Git** (opcional, para clonar)
- **Google Gemini API Key** (gratuita desde [ai.google.dev](https://ai.google.dev/))

## ⚡ Instalación Rápida

### 1. Clonar o descargar el proyecto
```bash
cd Karonte
```

### 2. Instalar dependencias del Frontend
```bash
npm install
```

### 3. Instalar dependencias del Backend
```bash
cd backend
npm install
cd ..
```

### 4. Configurar variables de entorno

**Crear archivo `.env` en la carpeta `backend/`:**
```env
PORT=5000
GEMINI_API_KEY=tu_api_key_aqui
```

> 📌 **Cómo obtener la API Key:**
> 1. Ir a https://ai.google.dev/
> 2. Click en "Get API Key"
> 3. Crear un proyecto en Google Cloud
> 4. Copiar la key generada

## Ejecutar el Proyecto

### Opción 1: Ejecutar Todo Junto (Recomendado)

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```
El backend se ejecutará en `http://localhost:5000`

**Terminal 2 - Frontend:**
```bash
npm run dev
```
El frontend se abrirá en `http://localhost:5173`

### Opción 2: Ejecutar Solo Frontend (si backend ya está corriendo)
```bash
npm run dev
```

## 📁 Estructura del Proyecto

```
Karonte/
├── src/
│   ├── components/
│   │   ├── navbar.jsx          # Navegación de pestañas
│   │   ├── title.jsx           # Título dinámico
│   │   ├── input.jsx           # Campo de entrada
│   │   ├── AIAnimation.jsx     # Animación de IA
│   │   ├── LoadingScreen.jsx   # Pantalla de carga
│   │   └── terminal/
│   │       └── chat.jsx        # Panel de chat
│   ├── css/
│   │   ├── ai-animation.css    # Estilos animación IA
│   │   ├── input.css           # Estilos input
│   │   ├── terminal/
│   │   │   └── chat.css        # Estilos chat
│   │   └── themes/
│   │       └── mechanicus.css  # Variables de tema
│   ├── App.jsx                 # Componente principal
│   └── main.jsx                # Punto de entrada
├── backend/
│   ├── src/
│   │   ├── server.js           # Configuración Express
│   │   ├── controllers/
│   │   │   └── aiController.js # Lógica IA y voz
│   │   ├── routes/
│   │   │   └── aiRoutes.js     # Endpoints de IA
│   │   └── db/
│   │       └── database.js     # SQLite setup
│   ├── data/
│   │   └── karonte.db          # Base de datos (auto-creada)
│   └── .env                    # Variables de entorno
├── vite.config.js              # Configuración Vite
├── package.json                # Dependencias
└── README.md                   # Este archivo
```

## 🎮 Cómo Usar

1. **Abrir la app** en navegador (http://localhost:5173)
2. **Escribir un mensaje** en el campo de entrada
3. **Presionar Enter** → Mensaje aparece al instante con `>>>>`
4. **Esperar "cargando..."** → Karonte procesa la respuesta
5. **Ver respuesta** → Aparece el mensaje de IA

### Pestañas Disponibles
- **Chat del Servidor** - Preguntas a Gemini (IA)
- **Tareas para el Imperio** - Gestor de tareas
- **Administración de Logística** - (Próximamente)
- **Información de Misión** - (Próximamente)

## Comandos Disponibles

### Frontend
```bash
npm run dev       # Inicia servidor Vite (dev)
npm run build     # Compila para producción
npm run preview   # Vista previa de build
```

### Backend
```bash
cd backend
npm run dev       # Inicia con nodemon (auto-reinicia)
npm start         # Inicia sin nodemon
```

## ⚠️ Limitaciones

- **Cuota Gemini**: 20 solicitudes/día en free tier (se reinicia a las 00:00 UTC)
- **Google TTS**: Máximo ~100 caracteres por chunk
- **SQLite**: Mensajes se limpian al reiniciar backend (por diseño)

## 🐛 Solucionar Problemas

### Error: "Cannot find module"
```bash
# Reinstalar dependencias
npm install
cd backend && npm install && cd ..
```

### Puerto 5000 ya está en uso
```bash
# Cambiar PORT en backend/.env
PORT=3001  # o el que prefieras
```

### API Key inválida
```bash
# Generar nueva desde https://ai.google.dev/
# Actualizar backend/.env
GEMINI_API_KEY=nueva_key
# Reiniciar backend
```

### Mensajes no aparecen
- Verificar que backend esté corriendo en `http://localhost:5000`
- Abrir DevTools (F12) para ver errores
- Revisar consola del backend

## 📝 Licencia

Proyecto personal - Warhammer 40K Fan-made

## 🎨 Tema Mechanicus

```css
--bg-primary: #022004    /* Fondo oscuro */
--accent-primary: #42c05f /* Verde neon */
--glow-color: #42c05f
```

---

**¡Que empiece el cómputo!** ⚙️🖥️
