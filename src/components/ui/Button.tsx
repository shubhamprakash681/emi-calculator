import React from "react";

type buttonClass = {
  [key in "primary" | "secondary" | "outlined" | "destructive" | "ghost" | "link"]: string;
};

const buttonClass: buttonClass = {
  primary: "bg-accent hover:bg-accent text-accentForeground transition-all duration-300 hover:shadow-lg",
  secondary:
    "bg-secondary text-secondaryForeground shadow-sm hover:bg-secondary/80 transition-all duration-300 hover:shadow-lg",
  outlined:
    "border border-input bg-background shadow-sm hover:bg-accent hover:text-accentForeground transition-all duration-300 hover:shadow-lg",
  destructive:
    "bg-destructive text-destructiveForeground shadow-sm hover:bg-destructive/90 transition-all duration-300 hover:shadow-lg",
  ghost: "hover:bg-accent hover:text-accentForeground transition-all duration-300 hover:shadow-lg",
  link: "underline-offset-4 hover:underline hover:text-primary transition-all duration-300 hover:shadow-lg",
};

interface ButtonProps extends React.AllHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  type?: "submit" | "reset" | "button";
  variant?: "primary" | "secondary" | "outlined" | "destructive" | "ghost" | "link";
}

const Button: React.FC<ButtonProps> = ({ children, type = "button", variant = "primary", ...props }) => {
  return (
    <button {...props} className={`${props.className} ${buttonClass[variant]} cursor-pointer`} type={type}>
      {children}
    </button>
  );
};

export default Button;
