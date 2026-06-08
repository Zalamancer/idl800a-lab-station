'use client';

import type { ICChip } from '@/types';

interface ICPinoutProps {
  chip: ICChip;
  highlightPins?: number[];
}

export default function ICPinout({ chip, highlightPins = [] }: ICPinoutProps) {
  const halfPins = chip.pinCount / 2;
  const leftPins = chip.pins.filter(p => p.number >= 1 && p.number <= halfPins);
  const rightPins = chip.pins
    .filter(p => p.number > halfPins && p.number <= chip.pinCount)
    .sort((a, b) => b.number - a.number); // reverse order for right side (top to bottom)

  const pinColor = (pin: { number: number; direction: string }) => {
    if (highlightPins.includes(pin.number)) return 'bg-yellow-200 border-yellow-500 font-bold';
    switch (pin.direction) {
      case 'power': return 'bg-red-100 border-red-300';
      case 'ground': return 'bg-gray-200 border-gray-400';
      case 'input': return 'bg-blue-50 border-blue-200';
      case 'output': return 'bg-green-50 border-green-200';
      default: return 'bg-white border-gray-200';
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="bg-gray-900 text-white px-4 py-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-lg">{chip.id}</h3>
            <p className="text-gray-300 text-sm">{chip.name}</p>
          </div>
          <span className="text-xs bg-gray-700 px-2 py-1 rounded">{chip.package}</span>
        </div>
      </div>

      {/* Warnings */}
      {chip.warnings && chip.warnings.length > 0 && (
        <div className="bg-amber-50 border-b border-amber-200 px-4 py-2">
          {chip.warnings.map((w, i) => (
            <p key={i} className="text-xs text-amber-800">⚠ {w}</p>
          ))}
        </div>
      )}

      {/* Pinout Diagram */}
      <div className="p-4">
        <div className="flex justify-center">
          <div className="inline-block">
            {/* Notch indicator */}
            <div className="flex justify-center mb-1">
              <div className="w-8 h-4 border-b-2 border-gray-400 rounded-b-full" />
            </div>

            {/* Pin rows */}
            <div className="border-2 border-gray-800 rounded-sm bg-gray-50">
              {leftPins.map((leftPin, i) => {
                const rightPin = rightPins[i];
                return (
                  <div key={i} className="flex items-center">
                    {/* Left pin */}
                    <div className={`flex items-center gap-1 px-2 py-1 border-b border-r border-gray-300 w-40 ${pinColor(leftPin)}`}>
                      <span className="text-xs font-mono w-5 text-right text-gray-500">{leftPin.number}</span>
                      <span className="text-xs font-medium truncate">{leftPin.name}</span>
                    </div>
                    {/* Right pin */}
                    {rightPin && (
                      <div className={`flex items-center gap-1 px-2 py-1 border-b border-gray-300 w-40 justify-end ${pinColor(rightPin)}`}>
                        <span className="text-xs font-medium truncate">{rightPin.name}</span>
                        <span className="text-xs font-mono w-5 text-left text-gray-500">{rightPin.number}</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-3 mt-4 justify-center text-xs">
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-red-100 border border-red-300" /> VCC</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-gray-200 border border-gray-400" /> GND</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-blue-50 border border-blue-200" /> Input</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-green-50 border border-green-200" /> Output</span>
          {highlightPins.length > 0 && (
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-yellow-200 border border-yellow-500" /> Active</span>
          )}
        </div>

        {/* VCC/GND quick ref */}
        <div className="mt-3 text-center text-xs text-gray-500">
          VCC = Pin {chip.vccPin} | GND = Pin {chip.gndPin}
        </div>
      </div>
    </div>
  );
}
