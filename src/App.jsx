import { Outlet } from 'react-router-dom';
import Sidebar from './components/Sidebar';

function App() {
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 h-screen overflow-y-auto bg-gray-100">
        <Outlet />
      </main>
    </div>
  );
}

export default App;
