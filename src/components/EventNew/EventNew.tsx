import {
  Form,
  redirect,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { getUserIdRethrow, isLoggedIn } from "../../utils/auth";
import { CreateEvent, createEvent } from '../../utils/service';
import { getFormData } from "../../utils/utils";


export async function action({ request, _params }: any) {
  let data = await getFormData(request, { removeEmptyString: true });
  data.creator = getUserIdRethrow();
  await createEvent(data as CreateEvent);
  return redirect(`/events`);
}

function EventNew() {
  const loggedIn = isLoggedIn();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  if (!loggedIn) {
    return <Navigate to="/login" state={{ from: pathname }} />
  }

  const handleCancel = () => {
    navigate("/events");
  }

  return (
    <Form method="post" id="contact-form">
      <p>
        <span>Name</span>
        <input
          placeholder="Event Name"
          aria-label="Event name"
          type="text"
          name="name"
        />
      </p>
      <div>
        <div>Description</div>
        <textarea
          name="description"
          rows={6}
        />
      </div>
      <p>
        <button type="submit">Save</button>
        <button type="button" onClick={handleCancel}>Cancel</button>
      </p>
    </Form>
  )
}

export default EventNew;
