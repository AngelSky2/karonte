import { useState, useEffect } from 'react';
import '../css/loading-screen.css';

function LoadingScreen({ onLoadingComplete }) {
  const [isVisible, setIsVisible] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Simular progreso de carga
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 95) return 95;
        return prev + Math.random() * 15;
      });
    }, 400);

    const attemptSpeak = async () => {
      try {
        console.log('🎤 Solicitando síntesis de voz al backend...');
        
        const response = await fetch('http://localhost:5000/api/voice/synthesize', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            text: 'Bienvenido, Guardia Imperial. cargando servidor',
            lang: 'es'
          })
        });

        if (!response.ok) {
          throw new Error(`Error ${response.status}`);
        }

        // Convertir respuesta a blob de audio
        const audioBlob = await response.blob();
        const audioUrl = URL.createObjectURL(audioBlob);

        // Crear elemento audio y reproducir
        const audio = new Audio(audioUrl);
        audio.volume = 1;
        
        audio.onended = () => {
          console.log('✓ Audio completado');
          URL.revokeObjectURL(audioUrl);
          completeLoading();
        };

        audio.onerror = (error) => {
          console.log('⚠️ Error reproduciendoaudio:', error);
          URL.revokeObjectURL(audioUrl);
          completeLoading();
        };

        console.log('▶️ Reproduciendo audio...');
        audio.play().catch(err => {
          console.log('⚠️ No se pudo reproducir:', err);
          completeLoading();
        });

      } catch (error) {
        console.log('⚠️ Error en síntesis:', error.message);
        completeLoading();
      }
    };

    const completeLoading = () => {
      setTimeout(() => {
        setProgress(100);
        setTimeout(() => {
          setIsVisible(false);
          onLoadingComplete();
        }, 300);
      }, 500);
    };

    // Esperar 1 segundo y luego intentar
    const delayTimeout = setTimeout(() => {
      attemptSpeak();
    }, 1000);

    const maxTimeout = setTimeout(() => {
      console.log('⏱️ Timeout - completando');
      clearInterval(progressInterval);
      setProgress(100);
      setIsVisible(false);
      onLoadingComplete();
    }, 15000);

    return () => {
      clearInterval(progressInterval);
      clearTimeout(delayTimeout);
      clearTimeout(maxTimeout);
    };
  }, [onLoadingComplete]);

  if (!isVisible) return null;

  return (
    <div className="loading-screen">
      <div className="loading-container">
        <div className="loading-gear-container">
          <svg className="loading-gear" viewBox="0 0 120 120" width="180" height="180">
            <defs>
              <radialGradient id="gearGradient" cx="50%" cy="50%" r="50%">
                <stop offset="0%" style={{ stopColor: 'var(--accent-primary)', stopOpacity: 0.8 }} />
                <stop offset="100%" style={{ stopColor: 'var(--border-color)', stopOpacity: 1 }} />
              </radialGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Engranaje grande (girar) */}
            <g transform="translate(60, 60)">
              {/* Dientes externos */}
              <circle cx="0" cy="0" r="45" fill="none" stroke="var(--border-color)" strokeWidth="2" opacity="0.3" />
              
              {/* Engranaje principal con dientes */}
              <g id="mainGear" filter="url(#glow)">
                <circle cx="0" cy="0" r="35" fill="none" stroke="var(--accent-primary)" strokeWidth="3" />
                
                {/* Dientes (12 dientes) */}
                {Array.from({ length: 12 }).map((_, i) => {
                  const angle = (i * 30) * (Math.PI / 180);
                  const x1 = Math.cos(angle) * 35;
                  const y1 = Math.sin(angle) * 35;
                  const x2 = Math.cos(angle) * 48;
                  const y2 = Math.sin(angle) * 48;
                  return (
                    <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="var(--accent-primary)" strokeWidth="4" strokeLinecap="round" />
                  );
                })}

                {/* Centro del engranaje */}
                <circle cx="0" cy="0" r="12" fill="var(--accent-primary)" filter="url(#glow)" />
                <circle cx="0" cy="0" r="8" fill="var(--glow-color)" opacity="0.6" />
                <circle cx="0" cy="0" r="5" fill="var(--bg-primary)" />
              </g>

              {/* Engranaje pequeño (girar en sentido opuesto) */}
              <g transform="translate(70, 0)" style={{ animation: 'spinReverse 6s linear infinite' }}>
                <circle cx="0" cy="0" r="18" fill="none" stroke="var(--border-color)" strokeWidth="2" opacity="0.5" />
                
                {Array.from({ length: 8 }).map((_, i) => {
                  const angle = (i * 45) * (Math.PI / 180);
                  const x1 = Math.cos(angle) * 18;
                  const y1 = Math.sin(angle) * 18;
                  const x2 = Math.cos(angle) * 26;
                  const y2 = Math.sin(angle) * 26;
                  return (
                    <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="var(--border-color)" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
                  );
                })}
                <circle cx="0" cy="0" r="6" fill="var(--border-color)" opacity="0.8" />
              </g>

              {/* Aura de energía */}
              <circle cx="0" cy="0" r="50" fill="none" stroke="var(--glow-color)" strokeWidth="1" opacity="0.3" />
              <circle cx="0" cy="0" r="55" fill="none" stroke="var(--glow-color)" strokeWidth="0.5" opacity="0.2" />
            </g>
          </svg>
        </div>
        <h1 className="loading-title">KARONTE</h1>
        <p className="loading-subtitle">Sistema de Procesamiento Imperial</p>
        
        {/* Barra de progreso */}
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${Math.min(progress, 100)}%` }}></div>
        </div>
        <p className="progress-text">{Math.floor(Math.min(progress, 100))}%</p>
      </div>
    </div>
  );
}

export default LoadingScreen;
