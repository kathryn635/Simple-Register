import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';
import RegistrationForm from '../components/RegistrationForm';
import StatusMessage from '../components/StatusMessage';
import socket from '../api/socket';

function RegisterPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [login, setLogin] = useState('');
  const [pass, setPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Проверка логина в реальном времени
  const handleLoginChange = (value) => {
    setLogin(value);
    if (value.length >= 3) {
      socket.emit('check_login', { login: value });
    }
  };

  socket.on('check_login_result', (data) => {
    if (!data.available) setMessage('Логин занят');
    else setMessage('');
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (pass !== confirmPass) {
      setMessage('Пароли не совпадают');
      return;
    }

    setIsLoading(true);
    
    socket.emit('register', { email, login, password: pass });
    
    socket.once('register_success', () => {
      localStorage.setItem('tempEmail', email);
      localStorage.setItem('tempLogin', login);
      navigate('/verify');
    });
    
    socket.once('register_error', (error) => {
      setMessage(error);
      setIsLoading(false);
    });
  };

  return (
    <AuthLayout title="Регистрация">
      <RegistrationForm
        email={email} setEmail={setEmail}
        login={login} setLogin={handleLoginChange}
        pass={pass} setPass={setPass}
        confirmPass={confirmPass} setConfirmPass={setConfirmPass}
        onSubmit={handleSubmit}
        isLoading={isLoading}
      />
      <StatusMessage message={message} />
    </AuthLayout>
  );
}

export default RegisterPage;