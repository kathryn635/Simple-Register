import React, { useState } from 'react';
import { loginApi } from "../api/auth";
import '../styles/SimpleRegister.css';

function RegisterPage({ onRegisterSuccess }) {
    const [email, setEmail] = useState('');
    const [login, setLogin] = useState('');
    const [pass, setPass] = useState('');
    const [confirmPass, setConfirmPass] = useState('');
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email.includes('@') || !email.includes('.') || email.includes(' ')) {
            setMessage('❌ Введите корректный email (пример: user@mail.com)');
            return;
        }

        if (login.length < 3) {
            setMessage('Логин должен быть минимум 3 символа');
            return;
        }

        if (pass.length < 6) {
            setMessage('Пароль должен быть минимум 6 символов');
            return;
        }

        if (pass !== confirmPass) {
            setMessage('❌ Пароли не совпадают');
            return;
        }

        setIsLoading(true);
        setMessage('');

        try {
            const result = await loginApi({ 
                email: email,
                username: login, 
                password: pass 
            });
            
            console.log('Login success:', result);
            setMessage('✅ Код подтверждения отправлен на email!');
            
            // Передаем данные на страницу подтверждения
            setTimeout(() => {
                onRegisterSuccess({ email, login, pass });
            }, 1000);
            
        } catch (error) {
            console.error('Login error:', error);
            
            switch(error.status) {
                case 401:
                    setMessage('❌ Неправильный пароль или email');
                    break;
                case 403:
                    setMessage('❌ Пользователь заблокирован');
                    break;
                case 409:
                    setMessage('❌ Пользователь с таким email или логином уже существует');
                    break;
                case 500:
                    setMessage('❌ Ошибка сервера');
                    break;
                case 0:
                    setMessage('❌ Ошибка сети');
                    break;
                default:
                    setMessage(`❌ Ошибка: ${error.message}`);
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="page">
            <div className="box">
                <h2 className="title">Регистрация</h2>
                
                <form onSubmit={handleSubmit}>
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
                        {isLoading ? 'Отправка...' : 'Зарегистрироваться'}
                    </button>
                </form>
                
                {message && (
                    <div className={`message ${message.includes('✅') ? 'success' : ''}`}>
                        {message}
                    </div>
                )}
            </div>
        </div>
    );
}

export default RegisterPage;