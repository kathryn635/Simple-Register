import React, { useState } from 'react';
import { verifyCodeApi } from "../api/auth";
import CodeInput from '../components/CodeInput';
import useAuthStore from '../store/authStore';
import '../styles/SimpleRegister.css';

function VerifyPage({ email, login, onBack, onVerifySuccess }) {
    const [code, setCode] = useState('');
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    
    const { setUser } = useAuthStore();

    const handleVerifyCode = async (e) => {
        e.preventDefault();

        if (code.length !== 6) {
            setMessage('Код должен быть 6 цифр');
            return;
        }

        setIsLoading(true);
        setMessage('');

        try {
            const result = await verifyCodeApi({ 
                email: email,
                code: code 
            });
            console.log('Verification success:', result);
            
            // Сохраняем пользователя в Zustand
            const userData = {
                id: result.userId || '123',
                email: email,
                username: login,
                avatar: null,
                createdAt: new Date().toISOString()
            };
            setUser(userData);
            
            setMessage('✅ Регистрация успешно завершена!');
            
            setTimeout(() => {
                onVerifySuccess();
            }, 1500);
            
        } catch (error) {
            console.error('Verification error:', error);
            setMessage(`❌ ${error.message || 'Неверный код подтверждения'}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="page">
            <div className="box">
                <h2 className="title">Подтверждение кода</h2>
                
                <form onSubmit={handleVerifyCode}>
                    <div className="group">
                        <label className="label">Код подтверждения:</label>
                        <CodeInput
                            value={code}
                            onChange={setCode}
                            disabled={isLoading}
                            onComplete={(fullCode) => {
                                if (fullCode.length === 6) {
                                    handleVerifyCode({ preventDefault: () => {} });
                                }
                            }}
                        />
                        <p className="hint">Введите 6-значный код из email</p>
                        <p className="hint">Тестовый код: 123456</p>
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
                        className="button button-back"
                        onClick={onBack}
                        disabled={isLoading}
                    >
                        Назад
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

export default VerifyPage;