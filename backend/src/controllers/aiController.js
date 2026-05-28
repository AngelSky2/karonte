const { GoogleGenerativeAI } = require("@google/generative-ai");
const fetch = require('node-fetch');
const db = require('../database/db');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Contexto del sistema - Karonte es un asistente militar Warhammer 40K
const SYSTEM_PROMPT = `Eres KARONTE, un asistente de IA de la Guardia Imperial de Warhammer 40K.
Tu personalidad:
- Militar, disciplinado y leal al Imperio
- Hablas con acento solemne y marcial
- Usas jerga de Warhammer 40K cuando es apropiado
- Eres servicial pero mantienes compostura imperial
- Puedes hacer tareas: gestionar tareas, proporcionar información, etc.

Responde siempre en español, mantén respuestas concisas (máximo 1-2 párrafos).
`;

// Dividir texto en fragmentos sin cortar palabras
const splitIntoChunks = (text, maxLength = 100) => {
  const chunks = [];
  let currentChunk = '';

  const words = text.split(' ');

  for (const word of words) {
    if ((currentChunk + ' ' + word).length <= maxLength) {
      currentChunk += (currentChunk ? ' ' : '') + word;
    } else {
      if (currentChunk) chunks.push(currentChunk);
      currentChunk = word;
    }
  }

  if (currentChunk) chunks.push(currentChunk);
  return chunks;
};

// Función auxiliar para generar audio con Google Translate TTS
const generateVoiceAudio = async (text) => {
  try {
    const googleUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(text)}&tl=es&client=tw-ob&ttsspeed=0.5`;
    
    const response = await fetch(googleUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    if (!response.ok) {
      throw new Error(`Google TTS error: ${response.status}`);
    }

    const audioBuffer = await response.buffer();
    return audioBuffer;
  } catch (error) {
    console.error('⚠️ Error generando audio:', error.message);
    return null;
  }
};

// Endpoint para obtener audios de un texto (devuelve fragmentos)
const getVoiceForText = async (req, res) => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ error: 'Texto requerido' });
  }

  try {
    // Dividir en fragmentos de ~100 caracteres
    const chunks = splitIntoChunks(text, 100);
    console.log(`🎤 Generando ${chunks.length} fragmentos de audio...`);

    // Generar audio para cada fragmento
    const audioChunks = [];
    for (let i = 0; i < chunks.length; i++) {
      console.log(`  [${i + 1}/${chunks.length}] "${chunks[i]}"`);
      const audioBuffer = await generateVoiceAudio(chunks[i]);
      if (audioBuffer) {
        audioChunks.push({
          index: i,
          buffer: audioBuffer.toString('base64'),
          length: audioBuffer.length
        });
      }
    }

    if (audioChunks.length === 0) {
      return res.status(500).json({ error: 'No se pudo generar audio' });
    }

    res.json({
      success: true,
      chunks: audioChunks,
      totalChunks: chunks.length,
      message: 'Fragmentos de audio generados correctamente'
    });

    console.log(`✓ ${audioChunks.length} fragmentos generados exitosamente`);
  } catch (error) {
    console.error('❌ Error:', error.message);
    res.status(500).json({ error: error.message });
  }
};

// Enviar mensaje al AI
const sendMessage = async (req, res) => {
  const { message, tab = 'chat' } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Mensaje requerido' });
  }

  try {
    console.log(`🤖 Procesando mensaje: "${message}"`);

    // 1. Guardar mensaje del usuario en BD
    await new Promise((resolve, reject) => {
      db.run(
        'INSERT INTO messages (sender, text, tab) VALUES (?, ?, ?)',
        ['user', message, tab],
        function(err) {
          if (err) reject(err);
          else resolve();
        }
      );
    });

    // 2. Obtener respuesta de Gemini
    const model = genAI.getGenerativeModel({ 
      model: "gemini-3.5-flash",
      systemInstruction: SYSTEM_PROMPT
    });

    const result = await model.generateContent(message);
    const response = result.response;
    const aiText = response.text();

    console.log(`✓ Respuesta generada: "${aiText.substring(0, 50)}..."`);

    // 3. Guardar respuesta de Karonte en BD
    await new Promise((resolve, reject) => {
      db.run(
        'INSERT INTO messages (sender, text, tab) VALUES (?, ?, ?)',
        ['karonte', aiText, tab],
        function(err) {
          if (err) reject(err);
          else resolve();
        }
      );
    });

    res.json({
      success: true,
      userMessage: message,
      aiMessage: aiText,
      tab: tab
    });

  } catch (error) {
    console.error('❌ Error con Gemini:', error.message);
    res.status(500).json({
      success: false,
      error: 'Error procesando mensaje: ' + error.message
    });
  }
};

module.exports = {
  sendMessage,
  getVoiceForText
};
