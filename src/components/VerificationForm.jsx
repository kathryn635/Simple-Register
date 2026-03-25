import React from 'react';
import CodeInput from './CodeInput';

function VerificationForm({ 
    code, setCode, 
    onSubmit, 
    onBack, 
    isLoading,
    email 
}) {
    return (
        <form onSubmit={onSubmit}>
            <div className="group">
                <label className="label">Код подтверждения:</label>
                <CodeInput
                    value={code}
                    onChange={setCode}
                    disabled={isLoading}
                    onComplete={(fullCode) => {
                        if (fullCode.length === 6) {
                            onSubmit({ preventDefault: () => {} });
                        }
                    }}
                />
                <p className="hint">Введите 6-значный код из email</p>
                {email && <p className="hint">Код отправлен на {email}</p>}
                <p className="test-hint">Тестовый код: 123456</p>
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
    );
}

export default VerificationForm;