import React, { useState, useRef, useEffect } from 'react';
import { loginApi, verifyCodeApi } from "../api/auth";
import '../styles/SimpleRegister.css';

function CodeInput({ value, onChange, disabled, onComplete }) {
  const [code, setCode] = useState(value || ['', '', '', '', '', '']);
  const inputsRef = useRef([]);

  useEffect(() => {
    if (value && value.length === 6) {
      const codeArray = value.split('');
      setCode(codeArray);
    }
  }, [value]);

  const handleChange = (index, e) => {
    let newValue = e.target.value;
    
    if (newValue.length > 0) {
      const digit = parseInt(newValue);
      if (isNaN(digit) || digit < 0 || digit > 9) {
        return;
      }
      newValue = newValue.charAt(0);
    }
    
    const newCode = [...code];
    newCode[index] = newValue;
    setCode(newCode);
    
    const fullCode = newCode.join('');
    onChange(fullCode);
    
    if (newValue && index < 5) {
      inputsRef.current[index + 1].focus();
    }
    
    if (fullCode.length === 6 && onComplete) {
      onComplete(fullCode);
    }
  };
  
  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputsRef.current[index - 1].focus();
    }
    
    if (e.key === 'ArrowLeft' && index > 0) {
      inputsRef.current[index - 1].focus();
    }
    
    if (e.key === 'ArrowRight' && index < 5) {
      inputsRef.current[index + 1].focus();
    }
  };
  
  const handlePaste = (e) => {
    e.preventDefault();
    let pastedData = e.clipboardData.getData('text/plain');
    
    let numbers = '';
    for (let i = 0; i < pastedData.length; i++) {
      const char = pastedData[i];
      const digit = parseInt(char);
      if (!isNaN(digit) && digit >= 0 && digit <= 9) {
        numbers += char;
      }
    }
    numbers = numbers.slice(0, 6);
    
    if (numbers) {
      const newCode = numbers.split('');
      while (newCode.length < 6) newCode.push('');
      setCode(newCode);
      onChange(numbers);
      
      if (numbers.length === 6 && onComplete) {
        onComplete(numbers);
      }
      
      const lastFilledIndex = Math.min(numbers.length, 5);
      if (lastFilledIndex < 6) {
        inputsRef.current[lastFilledIndex].focus();
      }
    }
  };
  
  return (
    <div className="code-input-container">
      {code.map((digit, index) => (
        <input
          key={index}
          ref={(el) => (inputsRef.current[index] = el)}
          type="text"
          className="code-input"
          value={digit}
          onChange={(e) => handleChange(index, e)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          disabled={disabled}
          maxLength={1}
        />
      ))}
    </div>
  );
}

function SimpleRegister() {
    const [email, setEmail] = useState('');
    const [login, setLogin] = useState('');
    const [pass, setPass] = useState('');
    const [confirmPass, setConfirmPass] = useState('');
    const [code, setCode] = useState('');
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [step, setStep] = useState('login');

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
            
            setMessage('✅ Регистрация успешно завершена!');
            
            setTimeout(() => {
                setEmail('');
                setLogin('');
                setPass('');
                setConfirmPass('');
                setCode('');
                setStep('login');
                setMessage('');
            }, 2000);
            
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
                <h2 className="title">
                    {step === 'login' ? 'Вход/Регистрация' : 'Подтверждение кода'}
                </h2>
                
                {step === 'login' ? (
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
                            {isLoading ? 'Загрузка...' : 'Зарегистрироваться'}
                        </button>
                    </form>
                ) : (
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
                            onClick={() => setStep('login')}
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