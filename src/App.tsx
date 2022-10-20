import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from "react-router-dom";
import './App.css';

import Root from './components/Root/Root';
import Login from './components/Login/Login';
import Events, { loader as eventListLoader } from './components/Events/Events';
import EventDetail, { loader as eventDetailLoader } from './components/EventDetail/EventDetail';
import UserDetail, { loader as userLoader } from "./components/UserDetail/UserDetail";
import ErrorPage from "./components/ErrorPage";
import EventNew from "./components/EventNew/EventNew";
import UserNew from "./components/UserNew/UserNew";


const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<UserNew />} />
      <Route path="/" element={<Root />} >
        <Route errorElement={<ErrorPage />} >
          <Route path="events/new" element={<EventNew />} />
          <Route path="events/:id" element={<EventDetail />} loader={eventDetailLoader} />
          <Route path="events" element={<Events />} loader={eventListLoader} />
          <Route path="users/:id" element={<UserDetail />} loader={userLoader} />
        </Route>
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
