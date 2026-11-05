import { useState } from 'react';
import type { Ingredient } from '../domain/types';

export default function IngredientImage({ ing, className = 'h-16 w-16', emojiClass = 'text-4xl' }: { ing: Ingredient; className?: string; emojiClass?: string }) {
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const showImg = ing.image && !failed;
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      {(!showImg || !loaded) && <span className={`${emojiClass} leading-none`} aria-hidden>{ing.emoji}</span>}
      {showImg && (
        <img
          src={ing.image}
          alt={ing.name}
          loading="lazy"
          decoding="async"
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
          className={`absolute inset-0 h-full w-full object-contain transition-opacity ${loaded ? 'opacity-100' : 'opacity-0'}`}
        />
      )}
    </div>
  );
}
