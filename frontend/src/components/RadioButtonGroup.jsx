import React from 'react';
import { getRadioStyle } from '../utils/styleUtils';

function RadioButtonGroup({ selectedOption, setOption, options }) {
  return (
    <div className="flex rounded-md overflow-hidden shadow-sm">
      {options.map((option) => (
        <button
          key={option.value}
          className={getRadioStyle(option.value, selectedOption)}
          onClick={() => setOption(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

export default RadioButtonGroup;