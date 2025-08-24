import React from 'react';

interface ShinyTextProps {
  text: string;
  disabled?: boolean;
  speed?: number;
  className?: string;
}

const ShinyText: React.FC<ShinyTextProps> = ({ 
  text, 
  disabled = false, 
  speed = 3, 
  className = '' 
}) => {
  if (disabled) {
    return <span className={className}>{text}</span>;
  }

  const shineStyle = {
    background: 'linear-gradient(45deg, #111827 25%, #f3f4f6e0 50%, #111827 75%)',
    backgroundSize: '200% 100%',
    backgroundClip: 'text',
    WebkitBackgroundClip: 'text',
    color: 'transparent',
    animation: `shineEffect ${speed}s infinite linear`,
  };

  // Add keyframes to document head if not already present
  React.useEffect(() => {
    const styleId = 'shiny-text-keyframes';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.textContent = `
        @keyframes shineEffect {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `;
      document.head.appendChild(style);
    }
  }, []);

  return (
    <span 
      className={className}
      style={shineStyle}
    >
      {text}
    </span>
  );
};

export default ShinyText;
