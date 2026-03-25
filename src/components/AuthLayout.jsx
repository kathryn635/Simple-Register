import React from 'react';

function AuthLayout({ children, title }) {
    return (
        <div className="page">
            <div className="box">
                <h2 className="title">{title}</h2>
                {children}
            </div>
        </div>
    );
}

export default AuthLayout;