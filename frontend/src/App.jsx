import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import { SocketProvider } from './context/SocketContext';
import ToastNotification from './components/ui/ToastNotification';

// Base
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Customers from './pages/Customers';
import Orders from './pages/Orders';
import Segments from './pages/Segments';
import Campaigns from './pages/Campaigns';
import Analytics from './pages/Analytics';
import Insights from './pages/Insights';
import AIAgent from './pages/AIAgent';
import Settings from './pages/Settings';

function App() {
  return (
    <SocketProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="customers" element={<Customers />} />
            <Route path="orders" element={<Orders />} />
            <Route path="segments" element={<Segments />} />
            <Route path="campaigns" element={<Campaigns />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="insights" element={<Insights />} />
            <Route path="agent" element={<AIAgent />} />
            <Route path="settings" element={<Settings />} />
          </Route>
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
      <ToastNotification />
    </SocketProvider>
  );
}

export default App;
