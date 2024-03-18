import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { Route, Routes } from 'react-router-dom'
import LoginAndRegistration from'./views/LoginAndRegistration'
import Home from'./views/Home'
import { Register } from './views/Register';



function App() {
  return (
    <div className="App">
        
        <Routes>

{/* Login-Registration  page */}
<Route path="/" element={<Register/>} />

{/* Home  page */}
<Route path="/home" element={<Home/>} />



</Routes>
    </div>
  );
}

export default App;
