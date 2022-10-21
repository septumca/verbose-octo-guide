import {
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { getAuthData } from "../../utils/auth";
import { CreateEvent, createEvent } from '../../utils/service';
import { removeEmptyStrings, useInputData } from "../../utils/utils";


function EventNew() {
  const { isLoggedIn, authData } = getAuthData();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { data: eventData, handleInputChange } = useInputData({ name: '', description: '' });

  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: pathname }} />
  }

  const handleCreate = async () => {
    removeEmptyStrings(eventData);
    eventData.creator = authData?.id;
    const event = await createEvent(eventData as CreateEvent);
    return navigate(`/events/${event.id}`);
  }

  const handleCancel = () => {
    navigate("/events");
  }

  return (
    <div>
      <div>
        <span>Name</span>
        <input
          placeholder="Event Name"
          aria-label="Event name"
          type="text"
          name="name"
          required={true}
          onChange={handleInputChange}
        />
      </div>
      <div>
        <div>Description</div>
        <textarea
          name="description"
          rows={6}
          onChange={handleInputChange}
        />
      </div>
      <div>
        <button onClick={handleCreate}>Save</button>
        <button onClick={handleCancel}>Cancel</button>
      </div>
    </div>
  )
}

export default EventNew;
