// @jxui/react v3.0.0 — MagneticSwitch (JXUI v3.0 Unified Component Suite)
import React, { useState } from 'react';

// 8. MagneticSwitch
export const MagneticSwitch: React.FC = () => {
  const [active, setActive] = useState(false);
  return (
    <button
      type="button"
      onClick={() => setActive(!active)}
      role="switch"
      aria-checked={active}
      className="relative w-14 h-7 bg-slate-200 dark:bg-slate-800 rounded-full p-1 cursor-pointer"
    >
      <div
        className={`w-5 h-5 bg-white dark:bg-slate-950 rounded-full shadow-sm transition-transform duration-300 ${
          active ? 'translate-x-7' : 'translate-x-0'
        }`}
      />
    </button>
  );
};
