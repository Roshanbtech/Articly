import React, { useEffect } from 'react';
import { useAuth } from './hooks/useAuth';
import Loader from './components/common/Loader';
import AppRoutes from './routes/AppRoutes';

const App: React.FC = () => {
  const { initializing, loadSession } = useAuth();

  useEffect(() => {
    loadSession();
  }, []);

  if (initializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <Loader />
      </div>
    );
  }

  return <AppRoutes />;
};

export default App;
