import React from 'react';

function RegistrationForm({ 
    email, setEmail,
    login, setLogin,
    pass, setPass,
    confirmPass, setConfirmPass,
    onSubmit,
    isLoading 
}) {
    return (
        <form onSubmit={onSubmit}>
            <div className="group">
                <label className="label">Email:</label>
                <input 
                    className="input"
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="example@mail.com"
                    disabled={isLoading}
                    required
                />
            </div>

            <div className="group">
                <label className="label">Логин:</label>
                <input 
                    className="input"
                    type="text" 
                    value={login}
                    onChange={(e) => setLogin(e.target.value)}
                    placeholder="минимум 3 символа"
                    disabled={isLoading}
                    required
                />
            </div>

            <div className="group">
                <label className="label">Пароль:</label>
                <input 
                    className="input"
                    type="password" 
                    value={pass}
                    onChange={(e) => setPass(e.target.value)}
                    placeholder="минимум 6 символов"
                    disabled={isLoading}
                    required
                />
            </div>

            <div className="group">
                <label className="label">Подтвердите пароль:</label>
                <input 
                    className="input"
                    type="password" 
                    value={confirmPass}
                    onChange={(e) => setConfirmPass(e.target.value)}
                    placeholder="повторите пароль"
                    disabled={isLoading}
                    required
                />
            </div>

            <button 
                type="submit" 
                className="button"
                disabled={isLoading}
            >
                {isLoading ? 'Загрузка...' : 'Зарегистрироваться'}
            </button>
        </form>
    );
}

export default RegistrationForm;