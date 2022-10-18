import { Fragment, useState } from "react";
import {
  Link,
  useLoaderData,
  useParams,
} from "react-router-dom";
import { getUserId, isLoggedIn } from "../../utils/auth";
import {
  createParticipant,
  deleteParticipant,
  EventDetailData,
  fetchEvent
} from '../../utils/service';
import Requirement from "../Requirement/Requirement";

export async function loader({ params }: any) {
  return fetchEvent(params.id);
}

function EventDetail() {
  const loadedData = useLoaderData() as EventDetailData;
  const { id }: any = useParams();
  const userId = getUserId();
  const loggedIn = isLoggedIn();
  const [data, setData] = useState(loadedData);
  const { name, description, participants, creator, requirements, fullfillments } = data;
  const isOwner = userId && userId === creator.id;
  const isPariticipating = userId && (participants.some(({ id }) => id === userId));

  const handleAddParticipation = async () => {
    if (userId) {
      let { username } = await createParticipant({ user: userId, event: parseInt(id, 10) });
      setData(d => ({ ...d, participants: [...d.participants, { id: userId, username }] }));
    }
  }

  const handleRemoveParticipation = async () => {
    if (userId) {
      await deleteParticipant(userId, parseInt(id, 10));
      setData(d => ({ ...d, participants: d.participants.filter(p => p.id !== userId)}));
    }
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
      {loggedIn && !isPariticipating && !isOwner && <div><button onClick={handleAddParticipation}>Participate</button></div>}
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
          <Fragment key={id}>
            <Requirement
              name={name}
              description={description}
              size={size}
              fullfillments={fullfillments.filter(({ requirement }) => requirement === id)}
              showControls={true}
            />
          </Fragment>
        )}
      </div>
    </div>
  )
}

export default EventDetail;
