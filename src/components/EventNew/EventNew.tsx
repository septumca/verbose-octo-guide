import {
  Form,
  redirect,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { getUserData, isLoggedIn } from "../../utils/auth";
import { CreateEvent, createEvent } from '../../utils/service';
import { getFormData } from "../../utils/utils";


export async function action({ request, _params }: any) {
  let data = await getFormData(request, { removeEmptyString: true });
  data.creator = getUserData().id;
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
      <div>
        <span>Name</span>
        <input
          placeholder="Event Name"
          aria-label="Event name"
          type="text"
          name="name"
        />
      </div>
      <div>
        <div>Description</div>
        <textarea
          name="description"
          rows={6}
        />
      </div>
      <div>
        <button type="submit">Save</button>
        <button type="button" onClick={handleCancel}>Cancel</button>
      </div>
    </Form>
  )
}

export default EventNew;
