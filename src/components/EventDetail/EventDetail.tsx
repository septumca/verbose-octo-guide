import {
  json,
  Link,
  useLoaderData,
} from "react-router-dom";
import { EventDetailData, fetchEvent } from '../../utils/service';

type LoaderResponse = EventDetailData;

export async function loader({ params }: any) {
  return await fetchEvent(params.id);
}

function EventDetail() {
  const { creator, fullfillments, name, description, participants, requirements } = useLoaderData() as LoaderResponse;

  return (
    <div>
      <div>{name}</div>
      <Link to={`/users/${creator.id}`}>
        <div>
          {creator.username}
        </div>
      </Link>
      <div>{description}</div>
      <div>Participants:
        {participants.map(({ id, username }) =>
          <Link key={id} to={`/users/${id}`}>
            <div>{username}</div>
          </Link>
        )}
      </div>
      <div>
        Requirements:
        {requirements.map(({ id, name, description }) =>
          <div key={id}>
            <div>{name}</div>
            <div>{description}</div>
          </div>
        )}
      </div>
    </div>
  )
}

export default EventDetail;
