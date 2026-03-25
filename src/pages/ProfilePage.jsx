import React from 'react';
import { useNavigate } from 'react-router-dom';  // 👈 для выхода
import useAuthStore from '../store/authStore';

function ProfilePage() {
    const navigate = useNavigate();
    const { user, logout } = useAuthStore();

    const handleLogout = () => {
        logout();
        navigate('/');  // 👈 переход на главную
    };

    if (!user) {
        return (
            <div className="page">
                <div className="box">
                    <h2 className="title">Вы не авторизованы</h2>
                    <button className="button" onClick={() => navigate('/')}>
                        Перейти к регистрации
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="page">
            <div className="box profile-card">
                <div className="avatar-placeholder">
                    {user.username?.charAt(0).toUpperCase()}
                </div>
                
                <h2 className="title">Профиль пользователя</h2>
                
                <div className="profile-info">
                    <p><strong>Логин:</strong> {user.username}</p>
                    <p><strong>Email:</strong> {user.email}</p>
                    <p><strong>Дата регистрации:</strong> {new Date(user.createdAt).toLocaleDateString()}</p>
                </div>
                
                <button className="button" onClick={handleLogout}>
                    Выйти из аккаунта
                </button>
            </div>
        </div>
    );
}

export default ProfilePage;