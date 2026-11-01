// @jxui/react v3.0.0 — AnimatedRadio (JXUI v3.0 Unified Component Suite)
import React, { useState } from 'react';

// 7. AnimatedRadio
export const AnimatedRadio: React.FC = () => {
  const [selected, setSelected] = useState(true);
  return (
    <button
      type="button"
      onClick={() => setSelected(!selected)}
      role="radio"
      aria-checked={selected}
      className="w-5 h-5 rounded-full border-2 border-indigo-600 flex items-center justify-center cursor-pointer"
    >
      {selected && <div className="w-2.5 h-2.5 bg-indigo-600 rounded-full animate-scale-in" />}
    </button>
  );
};
