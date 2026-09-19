import React, { useEffect } from 'react';
import { Dashboard } from './components/Dashboard';
import { useTelemetry } from './data/telemetryStore';
import { SimulationProvider, WebSocketProvider, switchProvider } from './data/dataSource';

export const App: React.FC = () => {
  const dataSource = useTelemetry((state) => state.system.dataSource);

  // Initialize data provider and handle source switching
  useEffect(() => {
    if (dataSource === 'simulation') {
      switchProvider(SimulationProvider);
    } else {
      switchProvider(WebSocketProvider);
    }

    return () => {
      // Disconnect on unmount
      SimulationProvider.disconnect();
      WebSocketProvider.disconnect();
    };
  }, [dataSource]);

  return <Dashboard />;
};

export default App;
