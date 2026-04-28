export type ButtonProps = {
  children: React.ReactNode;
  variant?: "primary" | "secondary";
  subvariant?: "destructive";
  size?: "small" | "default";
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
};

export const constructButtonClassName = (props: ButtonProps): string => {
  return `button ${props.variant ?? "secondary"} ${props.subvariant ?? ""} ${props.size ?? ""}`;
};
