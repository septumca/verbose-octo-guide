import {
  Link,
  Outlet,
  useNavigate,
} from "react-router-dom";
import { isLoggedIn, removeToken } from "../../utils/auth";
import "./Root.css";

function Root() {
  const loggedIn = isLoggedIn();
  const navigate = useNavigate();

  const handleLogout = () => {
    removeToken();
    navigate('/events');
  }

  return (
    <div className="parent">
      <div>
        {loggedIn && <button onClick={handleLogout} >Logout</button>}
        {!loggedIn && <Link to="/login">Login</Link>}
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
