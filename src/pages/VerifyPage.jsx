import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';
import VerificationForm from '../components/VerificationForm';
import StatusMessage from '../components/StatusMessage';
import useAuthStore from '../store/authStore';
import socket from '../api/socket';

function VerifyPage() {
  const navigate = useNavigate();
  const { setUser } = useAuthStore();
  const [code, setCode] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const email = localStorage.getItem('tempEmail');

  useEffect(() => {
    if (!email) navigate('/');
  }, [email]);

  const handleVerify = (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    socket.emit('verify', { email, code });
    
    socket.once('verify_success', (data) => {
      setUser(data.user);
      localStorage.removeItem('tempEmail');
      localStorage.removeItem('tempLogin');
      navigate('/profile');
    });
    
    socket.once('verify_error', (error) => {
      setMessage(error);
      setIsLoading(false);
    });
  };

  return (
    <AuthLayout title="Подтверждение">
      <VerificationForm
        code={code} setCode={setCode}
        onSubmit={handleVerify}
        onBack={() => navigate('/')}
        isLoading={isLoading}
        email={email}
      />
      <StatusMessage message={message} />
    </AuthLayout>
  );
}

export default VerifyPage;