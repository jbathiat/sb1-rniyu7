import React, { useState, useRef, useEffect } from 'react';
import { X, RotateCw, ZoomIn, ZoomOut } from 'lucide-react';
import { PhotoProp } from '../types';

interface DraggablePropProps {
  prop: PhotoProp;
  containerRef: React.RefObject<HTMLDivElement>;
  onChange: (prop: PhotoProp) => void;
  onRemove: () => void;
}

const DraggableProp: React.FC<DraggablePropProps> = ({
  prop,
  containerRef,
  onChange,
  onRemove
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const propRef = useRef<HTMLDivElement>(null);
  const dragStart = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !containerRef.current || !propRef.current) return;

      const container = containerRef.current.getBoundingClientRect();
      const newX = prop.position.x + (e.clientX - dragStart.current.x);
      const newY = prop.position.y + (e.clientY - dragStart.current.y);

      // Keep prop within container bounds
      const boundedX = Math.max(0, Math.min(newX, container.width - propRef.current.offsetWidth));
      const boundedY = Math.max(0, Math.min(newY, container.height - propRef.current.offsetHeight));

      onChange({
        ...prop,
        position: {
          ...prop.position,
          x: boundedX,
          y: boundedY
        }
      });

      dragStart.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, prop, onChange, containerRef]);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    dragStart.current = { x: e.clientX, y: e.clientY };
  };

  const handleRotate = (delta: number) => {
    onChange({
      ...prop,
      position: {
        ...prop.position,
        rotation: (prop.position.rotation + delta) % 360
      }
    });
  };

  const handleScale = (delta: number) => {
    const newScale = Math.max(0.5, Math.min(2, prop.position.scale + delta));
    onChange({
      ...prop,
      position: {
        ...prop.position,
        scale: newScale
      }
    });
  };

  return (
    <div
      ref={propRef}
      className="absolute cursor-move group"
      style={{
        left: prop.position.x,
        top: prop.position.y,
        transform: `rotate(${prop.position.rotation}deg) scale(${prop.position.scale})`,
        transformOrigin: 'center'
      }}
      onMouseDown={handleMouseDown}
    >
      <img
        src={prop.url}
        alt="Prop"
        className="max-w-[200px] max-h-[200px] pointer-events-none"
        draggable={false}
      />

      {/* Controls */}
      <div className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="flex gap-1 bg-black/75 rounded-lg p-1">
          <button
            onClick={() => handleRotate(90)}
            className="p-1 text-white hover:text-pink-300"
          >
            <RotateCw size={16} />
          </button>
          <button
            onClick={() => handleScale(0.1)}
            className="p-1 text-white hover:text-pink-300"
          >
            <ZoomIn size={16} />
          </button>
          <button
            onClick={() => handleScale(-0.1)}
            className="p-1 text-white hover:text-pink-300"
          >
            <ZoomOut size={16} />
          </button>
          <button
            onClick={onRemove}
            className="p-1 text-white hover:text-pink-300"
          >
            <X size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default DraggableProp;