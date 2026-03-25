import React, { useState } from 'react';
import RegisterPage from './pages/RegisterPage';
import VerifyPage from './pages/VerifyPage';
import ProfilePage from './pages/ProfilePage';
import useAuthStore from './store/authStore';

function App() {
    const [step, setStep] = useState('register');
    const [userData, setUserData] = useState({ email: '', login: '' });
    const { isAuthenticated } = useAuthStore();

    if (isAuthenticated) {
        return <ProfilePage />;
    }

    const handleRegisterSuccess = (data) => {
        setUserData(data);
        setStep('verify');
    };

    const handleVerifySuccess = () => {
        setStep('profile');
    };

    const handleBackToRegister = () => {
        setStep('register');
    };

    return (
        <>
            {step === 'register' && (
                <RegisterPage onRegisterSuccess={handleRegisterSuccess} />
            )}
            
            {step === 'verify' && (
                <VerifyPage 
                    email={userData.email}
                    login={userData.login}
                    onBack={handleBackToRegister}
                    onVerifySuccess={handleVerifySuccess}
                />
            )}
            
            {step === 'profile' && (
                <ProfilePage />
            )}
        </>
    );
}

export default App;