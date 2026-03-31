import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';  //  импортируем
import RegisterPage from './pages/RegisterPage';
import VerifyPage from './pages/VerifyPage';
import ProfilePage from './pages/ProfilePage';
import useAuthStore from './store/authStore';

function App() {
    const { isAuthenticated } = useAuthStore();

    return (
        <Routes>
            {/* Если авторизован - профиль, иначе регистрация */}
            <Route 
                path="/" 
                element={isAuthenticated ? <Navigate to="/profile" /> : <Navigate to ="/registration"/>} 
            />
             
            <Route 
                path="/registration" 
                element={< RegisterPage />} 
            />
            <Route 
                path="/verify" 
                element={<VerifyPage />} 
            />
            
            <Route 
                path="/profile" 
                element={isAuthenticated ? <ProfilePage /> : <Navigate to="/" />} 
            />
        </Routes>
    );
}

export default App;
