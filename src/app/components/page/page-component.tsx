import "./page.scss";

export const Page: React.FC<{
  id: string;
  children: React.ReactNode;
  wide: boolean;
}> = ({ children, id, wide }) => {
  return (
    <div className={`page ${wide ? "wide" : ""}`} id={id}>
      {children}
    </div>
  );
};
