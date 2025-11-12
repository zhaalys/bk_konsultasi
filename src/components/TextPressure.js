'use client';

import { useEffect, useRef } from 'react';

export default function TextPressure({
  text = "Hello!",
  flex = true,
  alpha = false,
  stroke = false,
  width = true,
  weight = true,
  italic = false,
  textColor = "#6A93C7",
  strokeColor = "#ff0000",
  minFontSize = 36,
  className = "",
}) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current || !flex) return;

    const container = containerRef.current;
    
    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      const chars = container.querySelectorAll('.text-pressure-char');
      
      chars.forEach((char) => {
        const charRect = char.getBoundingClientRect();
        const charCenterX = charRect.left - rect.left + charRect.width / 2;
        const charCenterY = charRect.top - rect.top + charRect.height / 2;
        
        const dx = mouseX - charCenterX;
        const dy = mouseY - charCenterY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Calculate pressure based on distance
        const interactionRadius = Math.max(rect.width, rect.height) * 0.5;
        const normalizedDistance = Math.min(distance / interactionRadius, 1);
        let pressure = Math.max(0, 1 - normalizedDistance);
        
        // Smoothstep easing for smoother animation
        pressure = pressure * pressure * (3 - 2 * pressure);
        
        // Build font variation settings
        const variations = [];
        
        if (weight) {
          const weightValue = 400 + (pressure * 500);
          variations.push(`'wght' ${Math.round(weightValue)}`);
        }
        
        if (width) {
          const widthValue = 75 + (pressure * 25);
          variations.push(`'wdth' ${Math.round(widthValue)}`);
        }
        
        if (italic) {
          const italicValue = pressure * 14;
          variations.push(`'slnt' ${Math.round(italicValue)}`);
        }
        
        // Apply font variation settings
        if (variations.length > 0) {
          char.style.fontVariationSettings = variations.join(' ');
        }
        
        // Fallback font-weight for better compatibility
        if (weight) {
          const fontWeightValue = Math.round(400 + (pressure * 500));
          char.style.fontWeight = fontWeightValue;
        }
        
        // Apply opacity if alpha is enabled
        if (alpha) {
          char.style.opacity = 0.3 + (pressure * 0.7);
        }
        
        // Apply scale for visible animation
        const scale = 1 + (pressure * 0.1);
        char.style.transform = `scale(${scale})`;
      });
    };
    
    const handleMouseLeave = () => {
      const chars = containerRef.current?.querySelectorAll('.text-pressure-char');
      if (!chars) return;
      
      chars.forEach((char) => {
        char.style.fontVariationSettings = '';
        char.style.fontWeight = '';
        char.style.opacity = '';
        char.style.transform = 'scale(1)';
      });
    };

    const container = containerRef.current;
    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [flex, alpha, width, weight, italic, text]);

  // Determine if we should use gradient
  const useGradient = textColor === 'gradient-blue' || 
                      textColor === '#6A93C7' || 
                      textColor === '#C0D9EE' ||
                      textColor.includes('gradient');

  return (
    <div
      ref={containerRef}
      className={`text-pressure-container ${className}`}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        fontSize: `clamp(${minFontSize * 0.7}px, ${minFontSize}px + 8vw, ${minFontSize * 1.5}px)`,
        fontWeight: 900,
        letterSpacing: '0.02em',
        lineHeight: 0.85,
        cursor: flex ? 'none' : 'default',
        userSelect: 'none',
        textTransform: 'uppercase',
      }}
    >
      {text.split('').map((char, index) => {
        // Apply gradient or solid color
        const charStyle = useGradient
          ? {
              background: 'linear-gradient(to bottom, #1e40af 0%, #2563eb 25%, #3b82f6 50%, #60a5fa 75%, #93c5fd 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }
          : {
              color: textColor,
            };

        return (
          <span
            key={`${char}-${index}`}
            className="text-pressure-char"
            style={{
              display: 'inline-block',
              WebkitTextStroke: stroke ? `1px ${strokeColor}` : 'none',
              textShadow: stroke
                ? `-1px -1px 0 ${strokeColor}, 1px -1px 0 ${strokeColor}, -1px 1px 0 ${strokeColor}, 1px 1px 0 ${strokeColor}`
                : 'none',
              transition: 'font-variation-settings 0.15s ease-out, font-weight 0.15s ease-out, opacity 0.15s ease-out, transform 0.15s ease-out',
              fontVariationSettings: weight ? "'wght' 900" : undefined,
              fontWeight: 900,
              ...charStyle,
            }}
          >
            {char === ' ' ? '\u00A0' : char}
          </span>
        );
      })}
    </div>
  );
}
