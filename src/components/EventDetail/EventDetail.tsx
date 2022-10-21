import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Fragment, useState } from "react";
import {
  Link,
  useParams,
} from "react-router-dom";
import { getAuthData } from "../../utils/auth";
import {
  createParticipant,
  deleteParticipant,
  EventDetailData,
  fetchEvent
} from '../../utils/service';
import Loader from "../Loader";
import NewRequirement from "../Requirement/NewRequirement";
import Requirement from "../Requirement/Requirement";


type EventDetailsMutator = (d: EventDetailData) => EventDetailData;

export const QUERY_TAG = ['event', 'single'];
export const useEventDetailsSuccess = (QUERY_TAG: string[]) => {
  const qc = useQueryClient();

  return (mutator: EventDetailsMutator) => {
    qc.setQueryData<EventDetailData>(QUERY_TAG, d => {
      if (d !== undefined) {
        return mutator(d)
      }
      return d;
    })
  };
}

const useEventDetailQueries = (event_id: number) => {
  const onSuccessHandler = useEventDetailsSuccess(QUERY_TAG);
  const { data, isLoading } = useQuery(QUERY_TAG, () => fetchEvent(event_id), { refetchOnWindowFocus: false });

  const addParticipantMut = useMutation(
    createParticipant,
    {
      onSuccess: (data) => {
        onSuccessHandler(d => ({ ...d, participants: [...d.participants, { id: data.user, username: data.username }] }));
      }
    }
  );
  const removeParticipantMut = useMutation(
    (userId: number) => deleteParticipant(userId, event_id),
    {
      onSuccess: (_data, userId) => {
        onSuccessHandler(d => ({ ...d, participants: d.participants.filter(p => p.id !== userId)}));
      }
    }
  );

  return {
    data,
    isLoading,
    addParticipantMut,
    removeParticipantMut
  }
}

function EventDetail() {
  const { id }: any = useParams();
  const eventId = parseInt(id, 10);
  const [newRequirement, setNewRequirement] = useState(false);
  const {
    data,
    isLoading,
    addParticipantMut,
    removeParticipantMut
  } = useEventDetailQueries(eventId);

  if (isLoading) {
    return <Loader />
  }

  if(data === undefined) {
    return <div>Error placeholder</div>
  }

  const { isLoggedIn, authData } = getAuthData();
  const userId = authData?.id;
  const { name, description, participants, creator, requirements, fullfillments } = data;
  const isOwner = userId !== null && userId === creator.id;
  const isPariticipating = userId !== null && (participants.some(({ id }) => id === userId));

  const handleToggleNewRequirement = () => {
    setNewRequirement(r => !r);
  }

  const handleAddParticipation = async () => {
    if (userId !== undefined) {
      addParticipantMut.mutate({ event: eventId, user: userId });
    }
  }

  const handleRemoveParticipation = async () => {
    if (userId !== undefined) {
      removeParticipantMut.mutate(userId);
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
      {isLoggedIn && !isPariticipating && !isOwner && <div><button onClick={handleAddParticipation}>Participate</button></div>}
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
              id={id}
              name={name}
              description={description}
              size={size}
              fullfillments={fullfillments.filter(({ requirement }) => requirement === id)}
              isOwner={isOwner}
            />
          </Fragment>
        )}
        {isOwner && !newRequirement && <button onClick={handleToggleNewRequirement}>Add new requirement</button>}
        {newRequirement && <NewRequirement eventId={eventId} onSaveRequirement={handleToggleNewRequirement} />}
      </div>
    </div>
  )
}

export default EventDetail;
