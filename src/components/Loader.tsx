export default function Loader({ msg }: { msg?: string }) {
  return <div>{msg ?? 'Loading...'}</div>
}