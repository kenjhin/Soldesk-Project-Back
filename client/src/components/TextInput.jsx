/* eslint-disable */
import React, { useState } from 'react';

function TextInput({type = 'text', label, onInputChange, onKeyDown}) {
  const [value, setValue] = useState('');

  function handleChange(e) {
    const newValue = e.target.value;
    setValue(e.target.value);

    if(onInputChange){
      onInputChange(newValue);
    }
  }

  return (
    <div className="input-container">
      <input type={type} value={value} onChange={handleChange} spellCheck="false" onKeyDown={onKeyDown}/>
      <label className={value && 'filled'}>
        {label}
      </label>
    </div>
  );
}

export default TextInput;