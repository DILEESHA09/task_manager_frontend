import Navbar from './pages/navbar';
import './App.css';

import Register from './pages/register';
import Login from './pages/login';
import TaskManagement from './pages/home';
import { Route, BrowserRouter as Router, Routes} from 'react-router-dom';

function App() {
  return (
    <>
    <Router>
    <Navbar />
     <Routes>
    <Route path='/register' element={<Register/>}> </Route>
    <Route path='/login' element={<Login/>}> </Route>
    <Route path='/' element={<TaskManagement/>}> </Route>
    </Routes>
    </Router>
   </>
  );
}

export default App;
