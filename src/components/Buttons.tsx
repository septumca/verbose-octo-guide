export function IconButton({ children, title, onClick }: any) {
  return (
    <button className="bg-sky-500 hover:bg-sky-600 active:bg-sky-700 p-1 rounded" title={title} onClick={onClick}>
      {children}
    </button>
  );
}