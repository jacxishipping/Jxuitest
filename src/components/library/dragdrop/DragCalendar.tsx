// @jxui/react v3.0.0 — DragCalendar (JXUI v3.0 Unified Component Suite)
import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { useJXTheme } from '../../../context/JXThemeContext';
import { Move, GripVertical, UploadCloud, Calendar, Grid } from 'lucide-react';

// 14. DragCalendar
export const DragCalendar: React.FC = () => {
  return (
    <div className="flex items-center gap-2 text-xs">
      <Calendar className="w-4 h-4 text-indigo-500" />
      <span>Drag appointment to Thursday</span>
    </div>
  );
};
