import React from "react";

interface TextAreaProps {
  value: string;
  onChange: (val: string) => void;
  label: string;
  minLength?: number;
}

const TextArea: React.FC<TextAreaProps> = ({
  value,
  onChange,
  label,
  minLength,
}) => {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-[var(--text-secondary)]">
        {label}
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="input-surface ring-accent h-64 resize-y"
        placeholder={`Enter ${label.toLowerCase()}...`}
      />
      {minLength && value.length > 0 && value.length < minLength && (
        <p className="text-xs text-[var(--warning)] mt-1">
          Minimum {minLength} characters required
        </p>
      )}
    </div>
  );
};

export default TextArea;
