'use client';

import { useState } from 'react';
import type { WiringStep } from '@/types';
import { formatConnection } from '@/lib/breadboard';

const CATEGORY_STYLES: Record<string, { bg: string; border: string; icon: string; label: string }> = {
  'power-setup': { bg: 'bg-red-50', border: 'border-red-200', icon: '⚡', label: 'Power Setup' },
  'ic-placement': { bg: 'bg-purple-50', border: 'border-purple-200', icon: '🔲', label: 'IC Placement' },
  'power-wiring': { bg: 'bg-red-50', border: 'border-red-200', icon: '🔴', label: 'Power Wiring' },
  'input-wiring': { bg: 'bg-yellow-50', border: 'border-yellow-200', icon: '→', label: 'Input Wiring' },
  'output-wiring': { bg: 'bg-blue-50', border: 'border-blue-200', icon: '←', label: 'Output Wiring' },
  'inter-chip-wiring': { bg: 'bg-orange-50', border: 'border-orange-200', icon: '↔', label: 'Inter-Chip Wiring' },
  'verification': { bg: 'bg-green-50', border: 'border-green-200', icon: '✓', label: 'Verification' },
};

const WIRE_COLOR_CLASSES: Record<string, string> = {
  red: 'bg-red-500',
  black: 'bg-gray-900',
  yellow: 'bg-yellow-400',
  green: 'bg-green-500',
  blue: 'bg-blue-500',
  orange: 'bg-orange-500',
  white: 'bg-white border border-gray-300',
  purple: 'bg-purple-500',
  brown: 'bg-amber-800',
  gray: 'bg-gray-400',
};

interface StepCardProps {
  step: WiringStep;
  isCompleted: boolean;
  onToggle: () => void;
}

export default function StepCard({ step, isCompleted, onToggle }: StepCardProps) {
  const [expanded, setExpanded] = useState(false);
  const style = CATEGORY_STYLES[step.category] || CATEGORY_STYLES['verification'];

  return (
    <div
      className={`rounded-lg border-2 transition-all ${
        isCompleted ? 'border-green-300 bg-green-50/50 opacity-75' : `${style.border} ${style.bg}`
      }`}
    >
      <button
        onClick={onToggle}
        className="w-full flex items-start gap-3 p-4 text-left"
      >
        {/* Checkbox */}
        <div className={`mt-0.5 w-6 h-6 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
          isCompleted ? 'bg-green-500 border-green-500 text-white' : 'border-gray-300 bg-white'
        }`}>
          {isCompleted && (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-mono text-gray-500">#{step.stepNumber}</span>
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${style.bg} ${style.border} border`}>
              {style.icon} {style.label}
            </span>
            {step.connection?.color && (
              <span className="flex items-center gap-1 text-xs text-gray-500">
                <span className={`inline-block w-3 h-3 rounded-full ${WIRE_COLOR_CLASSES[step.connection.color]}`} />
                {step.connection.color} wire
              </span>
            )}
          </div>
          <p className={`font-semibold ${isCompleted ? 'line-through text-gray-500' : 'text-gray-900'}`}>
            {step.title}
          </p>
          <p className="text-sm text-gray-600 mt-1">{step.instruction}</p>

          {/* Connection detail */}
          {step.connection && (
            <div className="mt-2 text-xs font-mono bg-white/70 rounded p-2 border border-gray-200">
              <span className="text-gray-500">FROM:</span>{' '}
              <span className="text-blue-700">{formatConnection(step.connection.from)}</span>
              <br />
              <span className="text-gray-500">TO:</span>{' '}
              <span className="text-green-700">{formatConnection(step.connection.to)}</span>
            </div>
          )}

          {/* Tip */}
          {step.tip && (
            <div className="mt-2 text-xs bg-amber-50 border border-amber-200 rounded p-2 text-amber-800">
              <strong>Tip:</strong> {step.tip}
            </div>
          )}
        </div>
      </button>
    </div>
  );
}
