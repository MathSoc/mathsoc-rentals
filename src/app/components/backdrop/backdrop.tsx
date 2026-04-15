import React from "react";
import "./backdrop.scss";

export const Backdrop: React.FC<{
  className?: string;
  children: React.ReactNode;
}> = ({ children, className }) => {
  return <div className={`backdrop ${className}`}>{children}</div>;
};
