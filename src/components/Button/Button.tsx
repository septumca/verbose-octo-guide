export function Button({ children, className, ...props }: any) {
  return (
    <button className={`bg-sky-500 hover:bg-sky-600 active:bg-sky-700 p-1 rounded text-slate-100 ${className ?? ''}`}{...props}>
      {children}
    </button>
  );
}
