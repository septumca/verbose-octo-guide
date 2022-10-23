import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from "react-router-dom";
import './App.css';
import Root from './components/Root/Root';
import Login from './components/Login/Login';
import Events from './components/Events/Events';
import EventDetail from './components/EventDetail/EventDetail';
import UserDetail from "./components/UserDetail/UserDetail";
import ErrorPage from "./components/ErrorPage";
import EventNew from "./components/EventNew/EventNew";
import UserNew from "./components/UserNew/UserNew";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<UserNew />} />
      <Route path="/" element={<Root />} >
        <Route errorElement={<ErrorPage />} >
          <Route path="events/new" element={<EventNew />} />
          <Route path="events/:id" element={<EventDetail />} />
          <Route path="events" element={<Events />} />
          <Route path="users/:id" element={<UserDetail />} />
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
