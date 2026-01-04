"use client";

import { useState } from "react";
import { CheckCircle2, Circle, ChevronDown, ChevronUp } from "lucide-react"; // Ensure you have lucide-react installed

interface Objective {
  id: string;
  title: string;
  completed: boolean;
}

export function ObjectiveBreakdown() {
  const [objectives, setObjectives] = useState<Objective[]>([
    { id: "1", title: "Complete Calculus Module", completed: false },
    { id: "2", title: "Review React Hooks", completed: true },
    { id: "3", title: "Write Essay Outline", completed: false },
  ]);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleObjective = (id: string) => {
    setObjectives((prev) =>
      prev.map((obj) =>
        obj.id === id ? { ...obj, completed: !obj.completed } : obj
      )
    );
  };

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-sm overflow-hidden w-full max-w-xs transition-all duration-300">
      <div 
        className="p-3 bg-zinc-50 dark:bg-zinc-800/50 flex items-center justify-between cursor-pointer"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <h3 className="text-sm font-semibold text-zinc-700 dark:text-zinc-200">Objectives</h3>
        <button className="text-zinc-400 hover:text-zinc-600">
          {isCollapsed ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
        </button>
      </div>
      
      {!isCollapsed && (
        <div className="p-2 max-h-[150px] overflow-y-auto space-y-1">
          {objectives.map((obj) => (
            <div
              key={obj.id}
              onClick={() => toggleObjective(obj.id)}
              className="flex items-center gap-2 p-2 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer group"
            >
              {obj.completed ? (
                <CheckCircle2 size={16} className="text-emerald-500" />
              ) : (
                <Circle size={16} className="text-zinc-300 group-hover:text-zinc-400" />
              )}
              <span className={`text-xs ${obj.completed ? "text-zinc-400 line-through" : "text-zinc-600 dark:text-zinc-300"}`}>
                {obj.title}
              </span>
            </div>
          ))}
          {objectives.length === 0 && (
            <p className="text-xs text-zinc-400 text-center py-2">No active objectives</p>
          )}
        </div>
      )}
    </div>
  );
}