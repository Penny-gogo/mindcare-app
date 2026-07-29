import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Counselors from './pages/Counselors';
import CounselorDetail from './pages/CounselorDetail';
import Chat from './pages/Chat';
import Profile from './pages/Profile';
import Appointments from './pages/Appointments';
import TreeHole from './pages/TreeHole';
import Assessment from './pages/Assessment';
import Knowledge from './pages/Knowledge';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="counselors" element={<Counselors />} />
        <Route path="counselor/:id" element={<CounselorDetail />} />
        <Route path="chat" element={<Chat />} />
        <Route path="profile" element={<Profile />} />
        <Route path="appointments" element={<Appointments />} />
        <Route path="treehole" element={<TreeHole />} />
        <Route path="assessment" element={<Assessment />} />
        <Route path="knowledge" element={<Knowledge />} />
      </Route>
    </Routes>
  );
}

export default App;