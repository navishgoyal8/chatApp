import './App.css';
import { Outlet } from 'react-router-dom';
import axios from 'axios';
import toast,{Toaster} from 'react-hot-toast';

axios.defaults.withCredentials = true;

function App() {
  return (
    <>
      <Toaster />
      <main>
        <Outlet />
      </main>
    </>
    
  );
}

export default App;
