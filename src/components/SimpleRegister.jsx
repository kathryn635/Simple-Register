import React, { useState } from 'react';
import { loginApi, verifyCodeApi } from "../api/auth";
import '../styles/SimpleRegister.css';

function SimpleRegister() {
    const [login, setLogin] = useState('');
    const [pass, setPass] = useState('');
    const [code, setCode] = useState('');
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [step, setStep] = useState('login');

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (login.length < 3) {
            setMessage('Логин должен быть минимум 3 символа');
            return;
        }

        if (pass.length < 6) {
            setMessage('Пароль должен быть минимум 6 символов');
            return;
        }

        setIsLoading(true);
        setMessage('');

        try {
            const result = await loginApi({ 
                email: login, 
                password: pass 
            });
            
            console.log('Login success:', result);
            setMessage('✅ Успешный вход! Введите код подтверждения');
            setStep('verify');
            
        } catch (error) {
            console.error('Login error:', error);
            
            switch(error.status) {
                case 401:
                    setMessage('❌ Неправильный пароль или email');
                    break;
                case 403:
                    setMessage('❌ Пользователь заблокирован');
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

    const handleVerifyCode = async (e) => {
        e.preventDefault();

        if (code.length !== 6) {
            setMessage('Код должен быть 6 цифр');
            return;
        }

        setIsLoading(true);
        setMessage('');

        try {
            const result = await verifyCodeApi({ code });
            console.log('Verification success:', result);
            
            setMessage('✅ Регистрация успешно завершена!');
            
            setTimeout(() => {
                setLogin('');
                setPass('');
                setCode('');
                setStep('login');
                setMessage('');
            }, 2000);
            
        } catch (error) {
            console.error('Verification error:', error);
            setMessage(`❌ ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="page">
            <div className="box">
                <h2 className="title">
                    {step === 'login' ? 'Вход/Регистрация' : 'Подтверждение кода'}
                </h2>
                
                {step === 'login' ? (
                    <form onSubmit={handleSubmit}>
                        <div className="group">
                            <label className="label">Login:</label>
                            <input 
                                className="input"
                                type="text" 
                                value={login}
                                onChange={(e) => setLogin(e.target.value)}
                                placeholder="минимум 3 символа"
                                disabled={isLoading}
                            />
                        </div>

                        <div className="group">
                            <label className="label">Password:</label>
                            <input 
                                className="input"
                                type="password" 
                                value={pass}
                                onChange={(e) => setPass(e.target.value)}
                                placeholder="минимум 6 символов"
                                disabled={isLoading}
                            />
                        </div>

                        <button 
                            type="submit" 
                            className="button"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Загрузка...' : 'Войти'}
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleVerifyCode}>
                        <div className="group">
                            <label className="label">Код подтверждения:</label>
                            <input 
                                className="input"
                                type="text" 
                                value={code}
                                onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                placeholder="6-значный код"
                                maxLength="6"
                                disabled={isLoading}
                            />
                        </div>

                        <button 
                            type="submit" 
                            className="button"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Проверка...' : 'Подтвердить'}
                        </button>

                        <button 
                            type="button" 
                            className="button"
                            onClick={() => setStep('login')}
                            style={{ marginTop: '10px', background: '#666' }}
                            disabled={isLoading}
                        >
                            Назад
                        </button>
                    </form>
                )}
                
                {message && (
                    <div className={`message ${message.includes('✅') ? 'success' : ''}`}>
                        {message}
                    </div>
                )}
            </div>
        </div>
    );
}

export default SimpleRegister;