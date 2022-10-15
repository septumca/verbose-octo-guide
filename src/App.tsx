import {
  Route,
  Navigate,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from "react-router-dom";
import './App.css';

import Root from './components/Root/Root';
import Login from './components/Login/Login';
import { isLoggedIn } from './utils/auth';
import Events, { loader as eventsLoader } from './components/Events/Events';
import EventDetail, { loader as eventDetailLoader } from './components/EventDetail/EventDetail';
import UserDetail, { loader as userLoader } from "./components/UserDetail/UserDetail";
import ErrorPage from "./components/ErrorPage";

type RequireAuthProps = {
  children: any,
  redirectTo: string,
};

function RequireAuth({ children, redirectTo }: RequireAuthProps) {
  return isLoggedIn() ? children : <Navigate to={redirectTo} />;
}

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Root />} >
        <Route path="events/:id" element={<EventDetail />} loader={eventDetailLoader} />
        <Route path="events" element={<Events />} loader={eventsLoader} />
        <Route path="users/:id" element={<UserDetail />} loader={userLoader} errorElement={<ErrorPage />} />
      </Route>
    </>
  )
);

function App() {
  return (
    <RouterProvider router={router} />
  )
}

export default App
