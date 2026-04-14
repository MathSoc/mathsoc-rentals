import React from "react";
import "./drawer-form.scss";

export const DrawerForm: React.FC<{
  className?: string;
  children: React.ReactNode;
  onSubmit: (e: React.SubmitEvent) => void;
}> = ({ children, className, onSubmit }) => {
  return (
    <form className={`drawer-form ${className}`} onSubmit={onSubmit}>
      {children}
    </form>
  );
};
