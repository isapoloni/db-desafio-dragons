import React from "react";
import styles from "./Button.module.css";

type ButtonProps = {
    children: React.ReactNode;
    onClick?: () => void;
    variant?: "primary" | "secondary" | "danger" | "edit" | "delete";
    disabled?: boolean;
    type?: "button" | "submit" | "reset";
    className?: string;
};

export function Button({
    children,
    onClick,
    variant = "primary",
    disabled = false,
    type = "button",
    className = "",
}: ButtonProps) {
    const buttonClass = [
        styles.button,
        styles[variant],
        disabled ? styles.disabled : "",
        className,
    ]
        .filter(Boolean)
        .join(" ");

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={buttonClass}
        >
            {children}
        </button>
    );
}
