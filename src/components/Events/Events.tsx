import { useQuery } from "@tanstack/react-query";
import {
  Link,
  useNavigate,
} from "react-router-dom";
import { fetchEventList, User } from '../../utils/service';
import { timeToStrPretty } from "../../utils/utils";
import Loader from "../Loader";
type EventCardProps = {
  id: number,
  name: string,
  time: number,
  description?: string,
  creator: User,
};

function EventCard({ id, name, time, description, creator }: EventCardProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/events/${id}`);
  }

  return <div  className="container cursor-pointer w-full items-left p-4 justify-center bg-white dark:bg-gray-800 rounded-lg shadow my-2 border border-gray-700" onClick={handleClick}>
    <div>{name}</div>
    <div>{timeToStrPretty(time)}</div>
    <div>
      {creator.username}
    </div>
    {description && <div>{description}</div>}
  </div>
}

function Events() {
  const { data: events, isLoading } = useQuery(
    ['event', 'all'],
    fetchEventList,
    { initialData: [], refetchOnWindowFocus: false }
  );

  if (isLoading) {
    return <Loader />
  }

  return (
    <div className="grid grid-cols-1 gap-8">
      <div className="container flex flex-col mx-auto w-full items-center justify-center bg-white dark:bg-gray-800">
        <Link to="/events/new">New Event</Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mx-8">
        {events.map(({ id, name, description, time, creator }) =>
          <EventCard
            key={id}
            id={id}
            time={time}
            name={name}
            description={description}
            creator={creator}
          />
        )}
      </div>
    </div>
  )
}

export default Events;
