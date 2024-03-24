import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { Route, Routes } from 'react-router-dom'
import Home from'./views/Home'
import Register from './views/Register'
import Login from './views/Login'
import {Create} from './views/Create'
import { Dashboard } from './views/Dashboard';



function App() {
  return (<div className='bg-light' style={{ height: '100vh', width: '100%' }}>

<Routes>

<Route path="/" element={<Register/>} default />

<Route path="/login" element={<Login/>} />

<Route path="/home" element={<Home/>} />

<Route path="/new-activities" element={<Create/>} />

<Route path="/users" element={<Dashboard/>} />



</Routes>
</div>
  );
}

export default App;
