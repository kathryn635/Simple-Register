import React, { useState, useRef, useEffect } from 'react';

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

export default CodeInput;