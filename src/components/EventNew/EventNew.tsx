import {
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { getAuthData } from "../../utils/auth";
import { CreateEvent, createEvent } from '../../utils/service';
import { removeEmptyStrings, useInputData } from "../../utils/utils";
import { Input, TextArea, TIME_FORMAT } from "../Input/Input";
import moment from 'moment';
import { Button } from "../Button/Button";


function EventNew() {
  const { isLoggedIn, authData } = getAuthData();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { data: eventData, handleInputChange } = useInputData({ name: '', time: '', description: '' });

  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: pathname }} />
  }

  const handleCreate = async () => {
    removeEmptyStrings(eventData);
    eventData.creator = authData?.id;
    eventData.time = moment(eventData.time, TIME_FORMAT).unix();
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
        <Input
          placeholder="Event Name"
          aria-label="Event name"
          type="text"
          name="name"
          required={true}
          onChange={handleInputChange}
        />
      </div>
      <div>
        <span>Time</span>
        <Input
          placeholder="Event Time"
          aria-label="Event time"
          type="datetime-local"
          name="time"
          required={true}
          onChange={handleInputChange}
        />
      </div>
      <div>
        <div>Description</div>
        <TextArea
          name="description"
          rows={6}
          onChange={handleInputChange}
        />
      </div>
      <div>
        <Button className="mr-1" onClick={handleCreate}>💾 Save</Button>
        <Button onClick={handleCancel}>❌ Cancel</Button>
      </div>
    </div>
  )
}

export default EventNew;
