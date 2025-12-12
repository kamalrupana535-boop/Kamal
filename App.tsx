import React, { useState } from 'react';
import { Home, Map, MessageSquare, Menu, X } from 'lucide-react';
import { AppView } from './types';
import { EmergencyButton } from './components/EmergencyButton';
import { HospitalLocator } from './components/HospitalLocator';
import { MedicalAssistant } from './components/MedicalAssistant';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.HOME);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const renderContent = () => {
    switch (currentView) {
      case AppView.LOCATOR:
        return <HospitalLocator />;
      case AppView.ASSISTANT:
        return <MedicalAssistant />;
      case AppView.HOME:
      default:
        return (
          <div className="flex flex-col h-full bg-white overflow-y-auto">
            {/* Hero Section */}
            <div className="bg-gradient-to-b from-teal-700 to-teal-600 text-white p-8 rounded-b-[3rem] shadow-xl relative overflow-hidden">
               <div className="absolute top-0 right-0 -mr-10 -mt-10 bg-white opacity-10 rounded-full w-64 h-64 blur-3xl"></div>
               <div className="absolute bottom-0 left-0 -ml-10 -mb-10 bg-yellow-400 opacity-10 rounded-full w-48 h-48 blur-2xl"></div>
               
               <h1 className="text-3xl font-bold mb-2 relative z-10">GraminHealth</h1>
               <p className="text-teal-100 text-lg relative z-10">Your companion for health in the farm & village.</p>
            </div>

            <div className="p-6 -mt-10 relative z-20 space-y-6">
              {/* Emergency Section */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-red-100">
                <h2 className="text-red-600 font-bold text-lg mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></span>
                  Emergency Help
                </h2>
                <div className="space-y-3">
                  <EmergencyButton number="102" label="Ambulance" subLabel="For Pregnancy/Accidents" />
                  <EmergencyButton number="108" label="Emergency Services" subLabel="Disaster Management" />
                </div>
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setCurrentView(AppView.LOCATOR)}
                  className="bg-teal-50 hover:bg-teal-100 p-6 rounded-2xl shadow-sm border border-teal-200 flex flex-col items-center justify-center text-center transition-colors group"
                >
                  <div className="bg-teal-100 group-hover:bg-white p-4 rounded-full mb-3 transition-colors">
                    <Map className="w-8 h-8 text-teal-700" />
                  </div>
                  <span className="font-semibold text-teal-900">Find Hospital</span>
                  <span className="text-xs text-teal-600 mt-1">Near Farm</span>
                </button>

                <button
                  onClick={() => setCurrentView(AppView.ASSISTANT)}
                  className="bg-blue-50 hover:bg-blue-100 p-6 rounded-2xl shadow-sm border border-blue-200 flex flex-col items-center justify-center text-center transition-colors group"
                >
                  <div className="bg-blue-100 group-hover:bg-white p-4 rounded-full mb-3 transition-colors">
                    <MessageSquare className="w-8 h-8 text-blue-700" />
                  </div>
                  <span className="font-semibold text-blue-900">Health Chat</span>
                  <span className="text-xs text-blue-600 mt-1">Symptom Check</span>
                </button>
              </div>

              {/* Info Card */}
              <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-200">
                <h3 className="font-bold text-yellow-800 mb-1">First Aid Tip</h3>
                <p className="text-sm text-yellow-900 opacity-90">
                  Stay hydrated while working in the sun. Keep water and ORS handy to prevent heatstroke.
                </p>
              </div>
            </div>
            
            <div className="flex-1"></div>
            <div className="text-center p-4 text-gray-400 text-xs">
              Built for Rural India
            </div>
          </div>
        );
    }
  };

  return (
    <div className="h-screen w-full bg-gray-100 flex justify-center">
      {/* Mobile container constraint */}
      <div className="w-full max-w-md bg-white h-full shadow-2xl relative flex flex-col">
        
        {/* Main Content Area */}
        <main className="flex-1 overflow-hidden relative">
          {renderContent()}
        </main>

        {/* Bottom Navigation Bar */}
        <nav className="bg-white border-t border-gray-200 pb-safe pt-2 px-6 flex justify-between items-center h-16 shrink-0 z-30">
          <button
            onClick={() => setCurrentView(AppView.HOME)}
            className={`flex flex-col items-center gap-1 transition-colors ${currentView === AppView.HOME ? 'text-teal-600' : 'text-gray-400 hover:text-gray-600'}`}
          >
            <Home className={`w-6 h-6 ${currentView === AppView.HOME ? 'fill-current' : ''}`} />
            <span className="text-[10px] font-medium">Home</span>
          </button>
          
          <button
            onClick={() => setCurrentView(AppView.LOCATOR)}
            className={`flex flex-col items-center gap-1 transition-colors ${currentView === AppView.LOCATOR ? 'text-teal-600' : 'text-gray-400 hover:text-gray-600'}`}
          >
            <Map className={`w-6 h-6 ${currentView === AppView.LOCATOR ? 'fill-current' : ''}`} />
            <span className="text-[10px] font-medium">Locate</span>
          </button>
          
          <button
            onClick={() => setCurrentView(AppView.ASSISTANT)}
            className={`flex flex-col items-center gap-1 transition-colors ${currentView === AppView.ASSISTANT ? 'text-teal-600' : 'text-gray-400 hover:text-gray-600'}`}
          >
            <MessageSquare className={`w-6 h-6 ${currentView === AppView.ASSISTANT ? 'fill-current' : ''}`} />
            <span className="text-[10px] font-medium">Assistant</span>
          </button>
        </nav>
      </div>
    </div>
  );
};

export default App;
