import { Navigate, useLocation, useRouteError } from "react-router-dom";
import { getAuthData } from "../utils/auth";

export default function ErrorPage() {
  const error = useRouteError() as any;
  const { pathname } = useLocation();
  const { isLoggedIn } = getAuthData();
  console.error(error);

  if(error.status === 401 && !isLoggedIn) {
    return <Navigate to="/login" state={{ from: pathname }} />
  }

  return (
    <div>
      <h1>Uh oh, something went terribly wrong 😩</h1>
      <pre>{error.message || JSON.stringify(error)}</pre>
      <button onClick={() => (window.location.href = "/events")}>
        Click here to reload the app
      </button>
    </div>
  );
}