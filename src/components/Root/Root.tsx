import {
  Link,
  Navigate,
  Outlet,
  useNavigate,
} from "react-router-dom";
import { getAuthData, removeToken } from "../../utils/auth";
import "./Root.css";
import { useLocation } from 'react-router-dom';
import UserToolbarInfo from "../UserToolbarInfo/UserToolbarInfo";

function Root() {
  const { isLoggedIn } = getAuthData();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    removeToken();
    navigate('/events');
  }

  if (location.pathname === '/') {
    return <Navigate to="/events" replace={true} />
  }

  return (
    <div className="parent">
      <div>
        <UserToolbarInfo />
        {isLoggedIn && <button onClick={handleLogout} >Logout</button>}
        {!isLoggedIn && <Link to="/login">Login</Link>}
        {!isLoggedIn && <Link to="/register">Register</Link>}
      </div>
      <div>
        <Outlet />
      </div>
      <div>
        Footer
      </div>
    </div>
  )
}

export default Root;
