export type ButtonProps = {
  children: React.ReactNode;
  variant: "pink" | "white" | "destructive";
  size?: "small" | "default";
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
};

export const constructButtonClassName = (props: ButtonProps): string => {
  return `button ${props.variant} ${props.size ?? ""}`;
};
