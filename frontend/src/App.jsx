import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Welcome from './pages/Welcome';

// 1. Importamos Home y el Router
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import GameMode from './pages/GameMode';
import Game from './pages/Game';
import AuthCallback from "./pages/AuthCallback";
import Ranking from "./pages/Ranking";
import Profile from './pages/Profile';
import CreateQuestion from "./pages/CreateQuestion";
import Admin from './pages/Admin';
import Achievements from "./pages/Achievements";
import MyQuestions from './pages/MyQuestions';
import ProtectedRoute from './components/ProtectedRoute';

function App() {

  return (
    <BrowserRouter>
      <Routes>
        {/* RUTA 1: Lo que ves al entrar (Login/Bienvenida) */}
        <Route path="/" element={<Welcome />} />

        {/* RUTA 2: La página Home */}
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/gamemode" element={<GameMode />} />
        <Route path="/game" element={<Game />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="/ranking" element={<Ranking />} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/nueva-pregunta" element={<ProtectedRoute><CreateQuestion /></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />
        <Route path="/logros" element={<ProtectedRoute><Achievements /></ProtectedRoute>} />
        <Route path="/mis-preguntas" element={<ProtectedRoute><MyQuestions /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;