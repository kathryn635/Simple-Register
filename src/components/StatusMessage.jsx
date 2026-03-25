import React from 'react';

function StatusMessage({ message }) {
    if (!message) return null;
    
    return (
        <div className={`message ${message.includes('✅') ? 'success' : ''}`}>
            {message}
        </div>
    );
}

export default StatusMessage;