import React from "react";

export type ButtonVariant = "filled" | "outlined" | "text";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  children: React.ReactNode;
}

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  filled: "md-button-filled",
  outlined: "md-button-outlined",
  text: "md-button-text",
};

export const Button: React.FC<ButtonProps> = ({
  variant = "filled",
  children,
  className = "",
  ...props
}) => {
  const baseClass = VARIANT_CLASSES[variant];

  return (
    <button className={`${baseClass} ${className}`.trim()} {...props}>
      {children}
    </button>
  );
};
