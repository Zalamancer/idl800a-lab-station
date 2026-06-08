import ExperimentViewer from '@/components/ExperimentViewer';
import { EXPERIMENT_3 } from '@/data/experiment3';
import { IC_CHIPS } from '@/data/ic-chips';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Bar */}
      <header className="bg-gray-900 text-white border-b border-gray-800">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-sm">
              IDL
            </div>
            <div>
              <h1 className="font-bold text-lg leading-tight">IDL-800a Digital Lab Station</h1>
              <p className="text-gray-400 text-xs">Step-by-step wiring instructions</p>
            </div>
          </div>
          <div className="text-right text-xs text-gray-400">
            <p>K&H Manufacturing</p>
            <p>AD-200 Breadboard (1,896 tie points)</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 py-8">
        <ExperimentViewer experiment={EXPERIMENT_3} chips={IC_CHIPS} />
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 text-xs text-center py-4 border-t border-gray-800">
        <p>IDL-800a Digital Lab Station Guide</p>
        <p className="mt-1">Pin data verified against TI datasheets. Always double-check physical wiring before powering on.</p>
      </footer>
    </div>
  );
}
