import React from 'react';
import useAuthStore from '../store/authStore';
import '../styles/ProfilePage.css';

function ProfilePage() {
    const { user, logout } = useAuthStore();

    if (!user) {
        return (
            <div className="profile-page">
                <div className="profile-card">
                    <h2>Вы не авторизованы</h2>
                    <button onClick={() => window.location.href = '/'}>
                        Перейти к регистрации
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="profile-page">
            <div className="profile-card">
                <div className="profile-avatar">
                    {user.avatar ? (
                        <img src={user.avatar} alt="avatar" />
                    ) : (
                        <div className="avatar-placeholder">
                            {user.username?.charAt(0).toUpperCase()}
                        </div>
                    )}
                </div>
                
                <h2>Профиль пользователя</h2>
                
                <div className="profile-info">
                    <div className="info-row">
                        <span className="info-label">Логин:</span>
                        <span className="info-value">{user.username}</span>
                    </div>
                    
                    <div className="info-row">
                        <span className="info-label">Email:</span>
                        <span className="info-value">{user.email}</span>
                    </div>
                    
                    <div className="info-row">
                        <span className="info-label">Дата регистрации:</span>
                        <span className="info-value">
                            {new Date(user.createdAt).toLocaleDateString()}
                        </span>
                    </div>
                    
                    <div className="info-row">
                        <span className="info-label">ID:</span>
                        <span className="info-value">{user.id}</span>
                    </div>
                </div>
                
                <button onClick={logout} className="logout-button">
                    Выйти из аккаунта
                </button>
            </div>
        </div>
    );
}

export default ProfilePage;