'use client';

import { useState } from 'react';
import type { Experiment, ExperimentPart, DataSwitch, LEDIndicator } from '@/types';
import type { ICChip } from '@/types';
import StepCard from './StepCard';
import ICPinout from './ICPinout';
import TestCaseTable from './TestCaseTable';

interface ExperimentViewerProps {
  experiment: Experiment;
  chips: Record<string, ICChip>;
}

export default function ExperimentViewer({ experiment, chips }: ExperimentViewerProps) {
  const [activePartIndex, setActivePartIndex] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Record<string, Set<number>>>({});
  const [showPinouts, setShowPinouts] = useState(false);

  const activePart = experiment.parts[activePartIndex];
  const partKey = activePart.id;
  const completed = completedSteps[partKey] || new Set<number>();

  const toggleStep = (stepNumber: number) => {
    setCompletedSteps(prev => {
      const current = new Set(prev[partKey] || []);
      if (current.has(stepNumber)) current.delete(stepNumber);
      else current.add(stepNumber);
      return { ...prev, [partKey]: current };
    });
  };

  const totalSteps = activePart.steps.length;
  const completedCount = completed.size;
  const progress = totalSteps > 0 ? (completedCount / totalSteps) * 100 : 0;

  // Determine which switches and LEDs are used for test cases
  const inputSwitches: DataSwitch[] = activePart.testCases.length > 0
    ? (Object.keys(activePart.testCases[0].inputs) as DataSwitch[]).sort()
    : [];
  const outputLEDs: LEDIndicator[] = activePart.testCases.length > 0
    ? (Object.keys(activePart.testCases[0].expectedOutputs) as LEDIndicator[]).sort()
    : [];

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <p className="text-sm text-gray-500 font-medium uppercase tracking-wide">{experiment.course}</p>
        <h1 className="text-3xl font-bold text-gray-900 mt-1">{experiment.title}</h1>
        <p className="text-gray-600 mt-2">{experiment.description}</p>
      </div>

      {/* Part Tabs */}
      <div className="flex gap-2 mb-6">
        {experiment.parts.map((part, i) => {
          const partCompleted = completedSteps[part.id] || new Set();
          const partProgress = part.steps.length > 0 ? (partCompleted.size / part.steps.length) * 100 : 0;
          return (
            <button
              key={part.id}
              onClick={() => setActivePartIndex(i)}
              className={`flex-1 rounded-lg border-2 p-3 text-left transition-all ${
                i === activePartIndex
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <p className="font-semibold text-sm">{part.title}</p>
              <p className="text-xs text-gray-500 mt-1">{part.icsRequired.join(', ')}</p>
              <div className="mt-2 w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-500 rounded-full transition-all"
                  style={{ width: `${partProgress}%` }}
                />
              </div>
            </button>
          );
        })}
      </div>

      {/* Progress Bar */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="font-bold text-lg">{activePart.title}</h2>
          <span className="text-sm text-gray-500">{completedCount}/{totalSteps} steps</span>
        </div>
        <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-green-500 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-sm text-gray-600 mt-2">{activePart.description}</p>
      </div>

      {/* Toggle IC Pinouts */}
      <div className="mb-6">
        <button
          onClick={() => setShowPinouts(!showPinouts)}
          className="flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
        >
          <svg
            className={`w-4 h-4 transition-transform ${showPinouts ? 'rotate-90' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
          {showPinouts ? 'Hide' : 'Show'} IC Pinout Reference ({activePart.icsRequired.length} chips)
        </button>

        {showPinouts && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            {activePart.icsRequired.map(chipId => {
              const chip = chips[chipId];
              return chip ? <ICPinout key={chipId} chip={chip} /> : null;
            })}
          </div>
        )}
      </div>

      {/* Wiring Steps */}
      <div className="space-y-3 mb-8">
        <h3 className="font-bold text-lg text-gray-900 flex items-center gap-2">
          Wiring Steps
          {completedCount === totalSteps && totalSteps > 0 && (
            <span className="text-sm font-normal bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
              All complete!
            </span>
          )}
        </h3>
        {activePart.steps.map(step => (
          <StepCard
            key={step.stepNumber}
            step={step}
            isCompleted={completed.has(step.stepNumber)}
            onToggle={() => toggleStep(step.stepNumber)}
          />
        ))}
      </div>

      {/* Test Cases */}
      {activePart.testCases.length > 0 && (
        <div className="mb-8">
          <TestCaseTable
            testCases={activePart.testCases}
            inputSwitches={inputSwitches}
            outputLEDs={outputLEDs}
          />
        </div>
      )}
    </div>
  );
}
