import {
  useLoaderData,
  useNavigate,
} from "react-router-dom";
import { EventSummary, fetchEventList, User } from '../../utils/service';
import "./Events.css";

type LoaderResponse = EventSummary[];

export async function loader() {
  return await fetchEventList();
}

type EventCardProps = {
  id: number,
  name: string,
  description?: string,
  creator: User,
};

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
  const events = useLoaderData() as LoaderResponse;

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
    </div>
  )
}

export default Events;
