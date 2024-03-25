import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { Route, Routes } from 'react-router-dom'
import Home from'./views/Home'
import Register from './views/Register'
import Login from './views/Login'
import {Create} from './views/Create'
import { Dashboard } from './views/Dashboard';
import {Edit} from './views/Edit';
import Show from './views/Show';



function App() {
  return (<div className='bg-light' style={{ height: '100vh', width: '100%' }}>

<Routes>

<Route path="/" element={<Register/>} default />

<Route path="/login" element={<Login/>} />

<Route path="/home" element={<Home/>} />

<Route path="/new-activities" element={<Create/>} />

<Route path="/users" element={<Dashboard/>} />

<Route path="/user/:userId" element={<Show/>} />

<Route path="/activity/edit/:activityId" element={<Edit/>} />



</Routes>
</div>
  );
}

export default App;
