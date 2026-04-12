import { ButtonProps, constructButtonClassName } from "./button-util";
import "./button.scss";

export const Button: React.FC<
  ButtonProps & {
    onClick: () => void;
  }
> = (props) => {
  const { onClick, children, disabled, type } = props;
  return (
    <button
      className={constructButtonClassName(props)}
      disabled={disabled}
      onClick={onClick}
      type={type}
    >
      {children}
    </button>
  );
};
