'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

export default function LogoLoop({
  logos = [],
  speed = 100,
  direction = 'left',
  logoHeight = 48,
  gap = 40,
  pauseOnHover = false,
  scaleOnHover = false,
  fadeOut = false,
  fadeOutColor = '#ffffff',
  ariaLabel = 'Logo carousel',
}) {
  const containerRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);
  const animationFrameRef = useRef(null);

  useEffect(() => {
    if (logos.length === 0) return;

    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    let scrollPosition = 0;
    let lastTime = performance.now();

    const animate = (currentTime) => {
      if (!isPaused && scrollContainer) {
        const deltaTime = (currentTime - lastTime) / 1000; // Convert to seconds
        lastTime = currentTime;

        // Calculate scroll width of one set of logos
        const singleSetWidth = scrollContainer.scrollWidth / 2;

        if (direction === 'left') {
          scrollPosition += (speed * deltaTime);
          if (scrollPosition >= singleSetWidth) {
            scrollPosition = scrollPosition - singleSetWidth;
          }
          scrollContainer.style.transform = `translateX(-${scrollPosition}px)`;
        } else {
          scrollPosition -= (speed * deltaTime);
          if (scrollPosition <= -singleSetWidth) {
            scrollPosition = scrollPosition + singleSetWidth;
          }
          scrollContainer.style.transform = `translateX(-${scrollPosition}px)`;
        }
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);
    lastTime = performance.now();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [speed, direction, isPaused, logos.length]);

  const handleMouseEnter = () => {
    if (pauseOnHover) {
      setIsPaused(true);
    }
  };

  const handleMouseLeave = () => {
    if (pauseOnHover) {
      setIsPaused(false);
    }
  };

  // Duplicate logos for seamless loop
  const duplicatedLogos = [...logos, ...logos];

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden"
      style={{ height: `${logoHeight + 20}px` }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      aria-label={ariaLabel}
    >
      {/* Fade out gradients */}
      {fadeOut && (
        <>
          <div
            className="absolute left-0 top-0 bottom-0 z-10 w-32 pointer-events-none"
            style={{
              background: `linear-gradient(to right, ${fadeOutColor}, transparent)`,
            }}
          />
          <div
            className="absolute right-0 top-0 bottom-0 z-10 w-32 pointer-events-none"
            style={{
              background: `linear-gradient(to left, ${fadeOutColor}, transparent)`,
            }}
          />
        </>
      )}

      {/* Logo container */}
      <div
        ref={scrollContainerRef}
        className="flex items-center"
        style={{
          gap: `${gap}px`,
          willChange: 'transform',
          width: 'fit-content',
        }}
      >
        {duplicatedLogos.map((logo, index) => (
          <div
            key={index}
            className="flex-shrink-0 flex items-center justify-center"
            style={{
              height: `${logoHeight}px`,
              transition: scaleOnHover ? 'transform 0.3s ease' : 'none',
            }}
            onMouseEnter={(e) => {
              if (scaleOnHover) {
                e.currentTarget.style.transform = 'scale(1.1)';
              }
            }}
            onMouseLeave={(e) => {
              if (scaleOnHover) {
                e.currentTarget.style.transform = 'scale(1)';
              }
            }}
          >
            {logo.href ? (
              <a
                href={logo.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center"
              >
                {logo.src ? (
                  <Image
                    src={logo.src}
                    alt={logo.alt || logo.title || 'Logo'}
                    width={logoHeight}
                    height={logoHeight}
                    className="object-contain"
                    style={{ maxWidth: `${logoHeight * 2}px`, height: 'auto' }}
                  />
                ) : logo.node ? (
                  <div style={{ fontSize: `${logoHeight}px`, color: logo.color || 'currentColor' }}>
                    {logo.node}
                  </div>
                ) : null}
              </a>
            ) : (
              <div className="flex items-center justify-center">
                {logo.src ? (
                  <Image
                    src={logo.src}
                    alt={logo.alt || logo.title || 'Logo'}
                    width={logoHeight}
                    height={logoHeight}
                    className="object-contain"
                    style={{ maxWidth: `${logoHeight * 2}px`, height: 'auto' }}
                  />
                ) : logo.node ? (
                  <div style={{ fontSize: `${logoHeight}px`, color: logo.color || 'currentColor' }}>
                    {logo.node}
                  </div>
                ) : null}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

