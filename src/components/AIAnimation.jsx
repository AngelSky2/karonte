import '../css/ai-animation.css';

function AIAnimation() {
  return (
    <div className="ai-animation-container">
      <div className="ai-core">
        <div className="core-dot"></div>
      </div>
      <div className="ai-rings">
        <div className="ring ring-1"></div>
        <div className="ring ring-2"></div>
        <div className="ring ring-3"></div>
      </div>
      <div className="ai-waves">
        <div className="wave wave-1"></div>
        <div className="wave wave-2"></div>
        <div className="wave wave-3"></div>
        <div className="wave wave-4"></div>
      </div>
    </div>
  );
}

export default AIAnimation;
