#!/usr/bin/env node

import say from 'say';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const audioPath = path.join(__dirname, '../public/welcome.mp3');

console.log('Generando audio de bienvenida...');

// Usar espeak en Linux, decir en Mac, o PowerShell en Windows
const platform = process.platform;
const voice = platform === 'linux' ? 'es' : 'es-ES';

say.export('Bienvenido, Guardia Imperial', voice, audioPath, (err) => {
  if (err) {
    console.error('❌ Error al generar audio:', err.message);
    process.exit(1);
  }
  console.log('[OK] Audio generado en:', audioPath);
  console.log('[OK] Ya puedes usar el audio en la app');
});
