"use client";

import React from "react";
// Assuming you are using 'react-calendar-heatmap' or a custom SVG component
// If using a library, import it here. 
// If you are using a custom grid, use the styles below to constrain it.

export function ActivityHeatmap() {
  // Mock data for visual
  const activityLevel = [1, 3, 0, 4, 2, 1, 0, 2, 4, 1, 3, 2, 0, 1];

  return (
    <div className="w-full max-w-[200px]"> {/* Constrain width here */}
      <h3 className="text-xs font-semibold text-zinc-500 mb-2 uppercase tracking-wider">Activity</h3>
      
      {/* Heatmap Container */}
      <div className="flex flex-wrap gap-1">
        {activityLevel.map((level, i) => (
          <div
            key={i}
            className={`w-3 h-3 rounded-sm ${
              level === 0 ? "bg-zinc-100 dark:bg-zinc-800" :
              level === 1 ? "bg-emerald-200" :
              level === 2 ? "bg-emerald-300" :
              level === 3 ? "bg-emerald-500" :
              "bg-emerald-700"
            }`}
            title={`Activity Level: ${level}`}
          />
        ))}
      </div>
      <p className="text-[10px] text-zinc-400 mt-2 text-right">Last 14 days</p>
    </div>
  );
}