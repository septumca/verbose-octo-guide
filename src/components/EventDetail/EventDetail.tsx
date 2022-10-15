import {
  Link,
  useLoaderData,
} from "react-router-dom";
import { getUserId, isLoggedIn } from "../../utils/auth";
import { EventDetailData, fetchEvent } from '../../utils/service';
import Requirement from "./Requirement";

type LoaderResponse = EventDetailData;

export async function loader({ params }: any) {
  return await fetchEvent(params.id);
}

function EventDetail() {
  const { creator, fullfillments, name, description, participants, requirements } = useLoaderData() as LoaderResponse;
  const loggedIn = isLoggedIn();
  const userId = getUserId();
  const isPariticipating = userId && (participants.some(({ id }) => id === userId) || userId === creator.id);

  const handleAddParticipation =async () => {

  }

  const handleRemoveParticipation = async () => {

  }

  return (
    <div>
      <div>{name}</div>
      <Link to={`/users/${creator.id}`}>
        <div>
          {creator.username}
        </div>
      </Link>
      <div>{description}</div>
      {loggedIn && !isPariticipating && <div><button onClick={handleAddParticipation}>Participate</button></div>}
      <div>Participants:
        {participants.map(({ id, username }) =>
          <div key={id}>
            <Link  to={`/users/${id}`}>{username}</Link>
            {id === userId && <button onClick={handleRemoveParticipation}>Leave</button>}
          </div>
        )}
      </div>
      <div>
        Requirements:
        {requirements.map(({ id, name, description, size }) =>
          <Requirement
            key={id}
            name={name}
            description={description}
            size={size}
            fullfillments={fullfillments.filter(({ requirement }) => requirement === id)}
          />
        )}
      </div>
    </div>
  )
}

export default EventDetail;
