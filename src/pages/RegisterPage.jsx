import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';  // для перехода
import { loginApi } from "../api/auth";
import AuthLayout from '../components/AuthLayout';
import RegistrationForm from '../components/RegistrationForm';
import StatusMessage from '../components/StatusMessage';

function RegisterPage() {
    const navigate = useNavigate();  // для перехода на другие страницы
    const [email, setEmail] = useState('');
    const [login, setLogin] = useState('');
    const [pass, setPass] = useState('');
    const [confirmPass, setConfirmPass] = useState('');
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email.includes('@') || !email.includes('.') || email.includes(' ')) {
            setMessage('❌ Введите корректный email');
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
            
            // Сохраняем данные и переходим на страницу подтверждения
            localStorage.setItem('tempEmail', email);
            localStorage.setItem('tempLogin', login);
            
            navigate('/verify', { state: { email, login } });  //  переход
            setMessage('✅ Код подтверждения отправлен на email!');
            
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
                default:
                    setMessage(`❌ Ошибка: ${error.message}`);
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthLayout title="Регистрация">
            <RegistrationForm
                email={email}
                setEmail={setEmail}
                login={login}
                setLogin={setLogin}
                pass={pass}
                setPass={setPass}
                confirmPass={confirmPass}
                setConfirmPass={setConfirmPass}
                onSubmit={handleSubmit}
                isLoading={isLoading}
            />
            <StatusMessage message={message} />
        </AuthLayout>
    );
}

export default RegisterPage;
