import React, { useEffect, useRef, useState } from 'react';

interface DeferredSectionProps {
  children: React.ReactNode;
  placeholder?: React.ReactNode;
  /**
   * Pre-load content slightly before it enters the viewport.
   * Defaults to 0px top/bottom and 200px bottom margin for earlier hydration.
   */
  rootMargin?: string;
  threshold?: number;
  minHeight?: number;
  className?: string;
  id?: string;
}

export const DeferredSection: React.FC<DeferredSectionProps> = ({
  children,
  placeholder,
  rootMargin = '0px 0px 200px 0px',
  threshold = 0.1,
  minHeight,
  className,
  id,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isVisible) return;

    const target = containerRef.current;
    if (!target || typeof IntersectionObserver === 'undefined') {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.disconnect();
          }
        });
      },
      { rootMargin, threshold }
    );

    observer.observe(target);

    return () => {
      observer.disconnect();
    };
  }, [isVisible, rootMargin, threshold]);

  return (
    <div
      ref={containerRef}
      id={id}
      className={className}
      style={{ minHeight: !isVisible && minHeight ? minHeight : undefined }}
    >
      {isVisible ? children : placeholder}
    </div>
  );
};

export default DeferredSection;
