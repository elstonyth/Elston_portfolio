import React from 'react';

interface PrestigeFlipCardProps {
  frontImageUrl?: string;
  backImageUrl?: string;
}

export const PrestigeFlipCard: React.FC<PrestigeFlipCardProps> = ({
  frontImageUrl = '/card-front.png',
  backImageUrl = '/card-back.jpg',
}) => {
  return (
    <div className="prestige-flip-card" aria-label="American Express Black Card">
      <div className="prestige-flip-card-inner">
        <div 
          className="prestige-flip-card-face prestige-flip-card-front"
          style={{ 
            backgroundImage: `url(${frontImageUrl})`,
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
            backgroundImage: `url(${backImageUrl})`,
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
