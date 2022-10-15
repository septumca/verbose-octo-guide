import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from "react-router-dom";
import './App.css';

import Root from './components/Root/Root';
import Login from './components/Login/Login';
import Events, { loader as eventsLoader } from './components/Events/Events';
import EventDetail, { loader as eventDetailLoader, action as eventDetailAction } from './components/EventDetail/EventDetail';
import UserDetail, { loader as userLoader } from "./components/UserDetail/UserDetail";
import ErrorPage from "./components/ErrorPage";
import EventNew, { action as createEventAction } from "./components/EventNew/EventNew";

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Root />} >
        <Route errorElement={<ErrorPage />} >
          <Route path="events/new" action={createEventAction} element={<EventNew />} />
          <Route path="events/:id" action={eventDetailAction} element={<EventDetail />} loader={eventDetailLoader} />
          <Route path="events" element={<Events />} loader={eventsLoader} />
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
