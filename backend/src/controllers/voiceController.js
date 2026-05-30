const fetch = require('node-fetch');

// Generar audio con Google Translate TTS
const synthesizeVoice = async (req, res) => {
  const { text, lang = 'es' } = req.body;

  if (!text) {
    return res.status(400).json({ error: 'Texto requerido' });
  }

  try {
    console.log(`Generando audio con Google Translate: "${text}"`);
    
    // URL de Google Translate TTS
    const googleUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(text)}&tl=${lang}&client=tw-ob&ttsspeed=0.5`;

    // Hacer fetch al audio
    const response = await fetch(googleUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    if (!response.ok) {
      throw new Error(`Google TTS error: ${response.status}`);
    }

    // Obtener buffer del audio
    const audioBuffer = await response.buffer();

    // Enviar audio
    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Content-Length', audioBuffer.length);
    res.send(audioBuffer);

    console.log('[OK] Audio de Google Translate enviado');
  } catch (error) {
    console.error('❌ Error en Google TTS:', error.message);
    res.status(500).json({ error: 'Error generando audio: ' + error.message });
  }
};

module.exports = {
  synthesizeVoice
};
