import { useState, useEffect } from 'react';
import './App.css';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Create from './pages/Create';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Clerkin from './pages/Clerkin';
import ClerSign from './pages/ClerSign';
import { Routes, Route } from 'react-router-dom';
import Shared from './pages/Shared';
import Notification from './pages/Notification';
import { History } from './pages/History';
import Checklist from './pages/Checklist';
import Archieve from './pages/Archieve';
import Work from './pages/Work';
import Comment from './pages/Comment';
import Acceptinvitation from './pages/Acceptinvitation';
import  {Analytical} from './components/Anylitical';
// import "./themes.css";
function App() {
  
  const [normal, setNormal] = useState(() => {
    const stored = localStorage.getItem("state");
    return stored === "true"; // converts string to boolean
  });

 
  useEffect(() => {
    localStorage.setItem("state", normal.toString()); 
  }, [normal]);

  return (
    <div>
      <Navbar normal={normal} setNormal={setNormal} cler={false} setCler={() => {}} />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Login  />} />
        <Route path="/signin" element={<Signup setNormal={setNormal} />} />
        <Route path="/create/:workspaceId" element={<Create />} />
        <Route path="/clerk" element={<Clerkin />} />
        <Route path="/clerkSignup/*" element={<ClerSign />} />
        <Route path="/dashboard/:workspaceId" element={<Dashboard />} />
        <Route path="/shared/:workspaceId" element={<Shared />} />
        <Route path="/notification/:workspaceId" element={<Notification />} />
        <Route path="/history/:workspaceId" element={<History />} />
        <Route path='/checklist/:id' element={<Checklist />} />
        <Route path='/archiev/:workspaceId' element={<Archieve/>} />
        <Route path='/work/:id' element={<Work/>} />
        <Route path='/comments/:id' element={<Comment/>} />
            <Route path="/invite/accept/:token" element={<Acceptinvitation />} />
          <Route path='/analytical/:workspaceId' element={<Analytical />} />

      </Routes>
    </div>
  );
}

export default App;
