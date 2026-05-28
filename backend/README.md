# 🔧 Backend Karonte

Backend para la aplicación Karonte - Asistente IA Mechanicus

## 📋 Requisitos

- Node.js (v14+)
- npm o yarn

## 🚀 Instalación

```bash
cd backend
npm install
```

## ▶️ Ejecutar

**Desarrollo (con nodemon):**
```bash
npm run dev
```

**Producción:**
```bash
npm start
```

El servidor estará disponible en `http://localhost:5000`

## 📂 Estructura

```
backend/
├── src/
│   ├── server.js              # Punto de entrada
│   ├── controllers/
│   │   └── chatController.js  # Lógica del chat
│   ├── routes/
│   │   └── chatRoutes.js      # Rutas del API
│   └── database/
│       └── db.js              # Configuración SQLite
├── package.json
└── README.md
```

## 🔌 API Endpoints

### GET `/api/chat/messages`
Obtiene el historial de mensajes

**Query params:**
- `tab` (opcional): 'chat', 'tasks', 'mission' (default: 'chat')

**Response:**
```json
[
  {
    "id": 1,
    "sender": "system",
    "text": "Mensaje",
    "tab": "chat",
    "timestamp": "2026-05-28T..."
  }
]
```

### POST `/api/chat/message`
Envía un nuevo mensaje

**Body:**
```json
{
  "sender": "user",
  "text": "Hola",
  "tab": "chat"
}
```

## 🗄️ Base de Datos

SQLite guardará datos en `/data/karonte.db`

**Tablas:**
- `messages` - Historial de chat
- `tasks` - Tareas del imperio
