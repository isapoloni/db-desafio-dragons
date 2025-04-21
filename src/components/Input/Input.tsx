import React from "react";
import styles from "./Input.module.css";

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
    error?: string;
    className?: string;
    rightElement?: React.ReactNode;
};

export function Input({ error, className = "", rightElement, ...props }: InputProps) {
    const inputClass = [
        styles.input,
        error ? styles.error : "",
        className,
    ]
        .filter(Boolean)
        .join(" ");

    return (
        <div className={styles.inputGroup} style={{ position: "relative" }}>
            <input className={inputClass} {...props} />
            {rightElement && (
                <span className={styles.inputRightElement}>{rightElement}</span>
            )}
            {error && <span className={styles.inputError}>{error}</span>}
        </div>
    );
}