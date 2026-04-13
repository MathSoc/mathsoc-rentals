import "./close-button.scss";

export function CloseButton({ className, ...props }: { className?: string }) {
  return (
    <button
      className={["close-button", className].filter(Boolean).join(" ")}
      {...props}
    >
      ×
    </button>
  );
}
