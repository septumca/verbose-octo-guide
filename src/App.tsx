import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from "react-router-dom";
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import './App.css';

import Root from './components/Root/Root';
import Login from './components/Login/Login';
import Events, { loader as eventListLoader } from './components/Events/Events';
import EventDetail, { loader as eventDetailLoader } from './components/EventDetail/EventDetail';
import UserDetail, { loader as userLoader } from "./components/UserDetail/UserDetail";
import ErrorPage from "./components/ErrorPage";
import EventNew, { action as createEventAction } from "./components/EventNew/EventNew";

const queryClient = new QueryClient();

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Root />} >
        <Route errorElement={<ErrorPage />} >
          <Route path="events/new" action={createEventAction} element={<EventNew />} />
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
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  )
}

export default App
