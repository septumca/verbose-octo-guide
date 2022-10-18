import {
  Link,
  useLoaderData,
  useNavigate,
} from "react-router-dom";
import { EventSummary, fetchEventList, User } from '../../utils/service';
import "./Events.css";

type EventCardProps = {
  id: number,
  name: string,
  description?: string,
  creator: User,
};

export async function loader() {
  return fetchEventList();
}

function EventCard({ id, name, description, creator }: EventCardProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/events/${id}`);
  }

  return <div className="card" onClick={handleClick}>
    <div>{name}</div>
    <div>{creator.username}</div>
    {description && <div>{description}</div>}
  </div>
}

function Events() {
  const events = useLoaderData() as EventSummary[];

  return (
    <div className="container">
      {events.map(({ id, name, description, creator }) =>
        <EventCard
          key={id}
          id={id}
          name={name}
          description={description}
          creator={creator}
        />
      )}
      <div>
        <Link to="/events/new">New Event</Link>
      </div>
    </div>
  )
}

export default Events;
