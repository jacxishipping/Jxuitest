// @jxui/react v3.0.0 — SignaturePad (JXUI v3.0 Unified Component Suite)
import React, { useRef, useState, useEffect } from 'react';
import { useJXTheme } from '../../../context/JXThemeContext';
import { PenTool, RotateCcw, Check } from 'lucide-react';

// 23. SignaturePad
// Real vector drawing canvas with smooth touch/mouse strokes and 1-click reset
export interface SignaturePadProps {
  onSave?: (dataUrl: string) => void;
  className?: string;
}

export const SignaturePad: React.FC<SignaturePadProps> = ({ onSave, className = '' }) => {
  const { getRadiusClass } = useJXTheme();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#4f46e5';
  }, []);

  const getCoordinates = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    if ('touches' in e) {
      const touch = e.touches[0];
      return { x: touch.clientX - rect.left, y: touch.clientY - rect.top };
    }
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    setHasDrawn(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const { x, y } = getCoordinates(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const { x, y } = getCoordinates(e);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    if (canvasRef.current && onSave) {
      onSave(canvasRef.current.toDataURL());
    }
  };

  const handleClear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawn(false);
  };

  return (
    <div className={`p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 ${getRadiusClass('card')} shadow-sm space-y-2 ${className}`}>
      <div className="flex items-center justify-between text-xs">
        <span className="font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
          <PenTool className="w-3.5 h-3.5 text-indigo-500" />
          <span>Vector Digital Signature</span>
        </span>
        {hasDrawn && (
          <button
            type="button"
            onClick={handleClear}
            className="flex items-center gap-1 text-[11px] font-medium text-slate-500 hover:text-rose-500 cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Clear</span>
          </button>
        )}
      </div>

      <div className="relative w-full h-24 bg-slate-50 dark:bg-slate-950/60 border border-dashed border-slate-300 dark:border-slate-700 rounded-lg overflow-hidden">
        <canvas
          ref={canvasRef}
          width={300}
          height={96}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          className="w-full h-full cursor-crosshair touch-none"
        />
        {!hasDrawn && (
          <span className="absolute inset-0 flex items-center justify-center text-[11px] text-slate-400 pointer-events-none select-none">
            Sign here with mouse or stylus...
          </span>
        )}
      </div>
    </div>
  );
};
