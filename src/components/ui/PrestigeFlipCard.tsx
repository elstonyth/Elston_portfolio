import React, { useState } from 'react';

interface PrestigeFlipCardProps {
  frontImageUrl?: string;
  backImageUrl?: string;
}

const getAssetUrl = (path: string) => {
  const base = import.meta.env.BASE_URL || '/';
  return `${base}${path.startsWith('/') ? path.slice(1) : path}`;
};

export const PrestigeFlipCard: React.FC<PrestigeFlipCardProps> = ({
  frontImageUrl = 'card-front.png',
  backImageUrl = 'card-back.jpg',
}) => {
  const frontUrl = getAssetUrl(frontImageUrl);
  const backUrl = getAssetUrl(backImageUrl);
  const [isFlipped, setIsFlipped] = useState(false);

  const handleToggle = () => {
    setIsFlipped((prev) => !prev);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      setIsFlipped((prev) => !prev);
    }
  };

  return (
    <div
      className={`prestige-flip-card${isFlipped ? ' is-flipped' : ''}`}
      aria-label="American Express Black Card"
      role="button"
      tabIndex={0}
      onClick={handleToggle}
      onKeyDown={handleKeyDown}
    >
      <div className="prestige-flip-card-inner">
        <div 
          className="prestige-flip-card-face prestige-flip-card-front"
          style={{ 
            backgroundImage: `url(${frontUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
          role="img"
          aria-label="American Express Card Front"
        />
        <div 
          className="prestige-flip-card-face prestige-flip-card-back"
          style={{ 
            backgroundImage: `url(${backUrl})`,
            backgroundSize: 'contain',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            backgroundColor: '#000'
          }}
          role="img"
          aria-label="Card back with custom artwork"
        />
      </div>
    </div>
  );
};
