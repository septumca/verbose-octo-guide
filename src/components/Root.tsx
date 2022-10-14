import {
  Link,
  useLoaderData,
  useNavigate,
} from "react-router-dom";
import { EventSummary, fetchEventList, fetchUserList, User } from '../utils/service';
import { isLoggedIn, removeToken } from "../utils/auth";

type LoaderResponse = [EventSummary[], User[]];

export async function loader() {
  return Promise.all([
    fetchEventList(),
    fetchUserList(),
  ]);
}

function Root() {
  const [ events, users ]: LoaderResponse = useLoaderData() as LoaderResponse;
  const loggedIn = isLoggedIn();
  const navigate = useNavigate();

  const handleLogout = () => {
    removeToken();
    navigate('/');
  }

  return (
    <>
      <div>
        {loggedIn && <button onClick={handleLogout} >Logout</button>}
        {!loggedIn && <Link to="/login">Login</Link>}
      </div>
      <div>
        Events:
        <pre>
          {JSON.stringify(events)}
        </pre>
      </div>
      <div>
        Users:
        <pre>
          {JSON.stringify(users)}
        </pre>
      </div>
    </>
  )
}

export default Root
