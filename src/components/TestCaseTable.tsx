'use client';

import { useState } from 'react';
import type { TestCase, DataSwitch, LEDIndicator } from '@/types';

interface TestCaseTableProps {
  testCases: TestCase[];
  inputSwitches: DataSwitch[];
  outputLEDs: LEDIndicator[];
}

export default function TestCaseTable({ testCases, inputSwitches, outputLEDs }: TestCaseTableProps) {
  const [checkedRows, setCheckedRows] = useState<Set<number>>(new Set());

  const toggleRow = (index: number) => {
    setCheckedRows(prev => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="bg-gray-900 text-white px-4 py-3">
        <h3 className="font-bold">Test Cases</h3>
        <p className="text-gray-300 text-sm">Set switches and verify LED outputs match</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b">
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 w-8">#</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Description</th>
              {inputSwitches.map(sw => (
                <th key={sw} className="px-2 py-2 text-center text-xs font-medium text-blue-600 bg-blue-50">{sw}</th>
              ))}
              {outputLEDs.map(led => (
                <th key={led} className="px-2 py-2 text-center text-xs font-medium text-green-600 bg-green-50">{led}</th>
              ))}
              <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 w-8">✓</th>
            </tr>
          </thead>
          <tbody>
            {testCases.map((tc, i) => (
              <tr
                key={i}
                className={`border-b transition-colors ${checkedRows.has(i) ? 'bg-green-50' : 'hover:bg-gray-50'}`}
              >
                <td className="px-3 py-2 text-gray-400 font-mono text-xs">{i + 1}</td>
                <td className="px-3 py-2 text-gray-700">{tc.description}</td>
                {inputSwitches.map(sw => (
                  <td key={sw} className="px-2 py-2 text-center font-mono bg-blue-50/50">
                    <span className={`inline-block w-6 h-6 rounded text-xs leading-6 font-bold ${
                      tc.inputs[sw] === 1 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-500'
                    }`}>
                      {tc.inputs[sw]}
                    </span>
                  </td>
                ))}
                {outputLEDs.map(led => (
                  <td key={led} className="px-2 py-2 text-center font-mono bg-green-50/50">
                    <span className={`inline-block w-6 h-6 rounded text-xs leading-6 font-bold ${
                      tc.expectedOutputs[led] === 1 ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'
                    }`}>
                      {tc.expectedOutputs[led]}
                    </span>
                  </td>
                ))}
                <td className="px-3 py-2 text-center">
                  <button
                    onClick={() => toggleRow(i)}
                    className={`w-6 h-6 rounded border-2 transition-colors ${
                      checkedRows.has(i) ? 'bg-green-500 border-green-500 text-white' : 'border-gray-300'
                    }`}
                  >
                    {checkedRows.has(i) && '✓'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Progress */}
      <div className="px-4 py-3 bg-gray-50 border-t">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">
            {checkedRows.size} of {testCases.length} verified
          </span>
          <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-green-500 rounded-full transition-all"
              style={{ width: `${(checkedRows.size / testCases.length) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
