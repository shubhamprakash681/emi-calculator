import React, { useState } from "react";

interface EMIParameterProps {
  label: string;
  valueToDisplay: string;
  minValue: number;
  maxValue: number;
  value: number;
  step: number;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
}

const EMIParameter: React.FC<EMIParameterProps> = ({
  label,
  valueToDisplay,
  minValue,
  maxValue,
  value,
  step,
  onChange,
}) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);

  return (
    <div className="space-y-2 py-2">
      <div className="flex items-center justify-between">
        <label onClick={() => setIsEditing(true)} htmlFor={`${label}-input`}>
          {label}
        </label>
        {isEditing ? (
          <span className="p-1">
            <input
              autoFocus
              id={`${label}-input`}
              type="text"
              value={value}
              onChange={(e) => {
                if (Number(e.target.value) <= maxValue && Number(e.target.value) >= minValue) {
                  onChange(e);
                }
              }}
              onBlur={() => setIsEditing(false)}
              className="w-30 px-2 py-1 rounded-sm bg-green-100 text-green-600 dark:bg-green-800 dark:text-green-100"
            />
          </span>
        ) : (
          <span
            onClick={() => setIsEditing(true)}
            className="px-3 py-2 rounded-sm bg-green-100 text-green-600 dark:bg-green-800 dark:text-green-100 cursor-pointer prevent-select whitespace-nowrap hover:scale-105 transition-all duration-300 ease-in-out"
          >
            {valueToDisplay}
          </span>
        )}
      </div>

      <div className="py-1.5 px-2 sm:px-3 lg:px-6 2xl:px-9">
        <input
          step={step}
          type="range"
          min={minValue}
          max={maxValue}
          value={value}
          className="w-full slider hover:scale-105 transition-all duration-300 ease-in-out"
          onChange={onChange}
        />
      </div>
    </div>
  );
};

export default EMIParameter;
