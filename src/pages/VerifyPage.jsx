import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';  // 👈 для получения данных
import { verifyCodeApi } from "../api/auth";
import AuthLayout from '../components/AuthLayout';
import VerificationForm from '../components/VerificationForm';
import StatusMessage from '../components/StatusMessage';
import useAuthStore from '../store/authStore';

function VerifyPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const { setUser } = useAuthStore();
    
    const [code, setCode] = useState('');
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    
    // Получаем email из location state или из localStorage
    const email = location.state?.email || localStorage.getItem('tempEmail');
    const login = location.state?.login || localStorage.getItem('tempLogin');

    useEffect(() => {
        if (!email) {
            navigate('/');  // Если нет email, возвращаем на регистрацию
        }
    }, [email, navigate]);

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
            
            // Сохраняем пользователя
            const userData = {
                id: result.userId || '123',
                email: email,
                username: login,
                createdAt: new Date().toISOString()
            };
            setUser(userData);
            
            setMessage('✅ Регистрация успешно завершена!');
            
            // Очищаем временные данные
            localStorage.removeItem('tempEmail');
            localStorage.removeItem('tempLogin');
            
            // Переходим в профиль через 1.5 секунды
            setTimeout(() => {
                navigate('/profile');
            }, 1500);
            
        } catch (error) {
            console.error('Verification error:', error);
            setMessage(`❌ ${error.message || 'Неверный код подтверждения'}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthLayout title="Подтверждение кода">
            <VerificationForm
                code={code}
                setCode={setCode}
                onSubmit={handleVerifyCode}
                onBack={() => navigate('/')}
                isLoading={isLoading}
                email={email}
            />
            <StatusMessage message={message} />
        </AuthLayout>
    );
}

export default VerifyPage;