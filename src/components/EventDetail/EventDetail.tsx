import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AnimatePresence } from "framer-motion";
import {
  Link,
  useParams,
} from "react-router-dom";
import { getAuthData } from "../../utils/auth";
import {
  createParticipant,
  deleteParticipant,
  EventDetailData,
  fetchEvent,
  updateEvent,
  UpdateEvent
} from '../../utils/service';
import { timeToStr, timeToStrPretty, useMutatorSuccess, useToggler } from "../../utils/utils";
import { Button } from "../Button/Button";
import { FadeDiv, FadeDivWithPresence } from "../FadeDiv";
import { InputWithControls, TextAreaWithControls, TIME_FORMAT } from "../Input/Input";
import HorizontalLine from "../HorizontalLine";
import Loader from "../Loader";
import NewRequirement from "../NewRequirement/NewRequirement";
import Requirement from "../Requirement/Requirement";
import moment from "moment";

export const QUERY_TAG = ['event', 'single'];

const useEventDetailQueries = (event_id: number) => {
  const onSuccessHandler = useMutatorSuccess<EventDetailData>(QUERY_TAG);
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
  const updateEventMut = useMutation(
    (data: UpdateEvent) => updateEvent(event_id, data),
    {
      onSuccess: (_data, variables) => {
        onSuccessHandler(d => ({ ...d,  ...variables }));
      }
    }
  );

  return {
    data,
    isLoading,
    updateEventMut,
    addParticipantMut,
    removeParticipantMut
  }
}

function EventDetail() {
  const { id }: any = useParams();
  const eventId = parseInt(id, 10);
  const [newRequirement, handleToggleNewRequirement] = useToggler(false);
  const {
    data,
    isLoading,
    updateEventMut,
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
  const { name, description, time, participants, creator, requirements, fullfillments } = data;
  const isOwner = userId !== null && userId === creator.id;
  const isPariticipating = userId !== null && (participants.some(({ id }) => id === userId));

  const handleUpdateEvent = (transform: (value: string) => UpdateEvent) => (value: string) => {
    let payload = transform(value);
    updateEventMut.mutate(payload);
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
    <div className="mx-2 my-4">
      <InputWithControls
        label="name"
        value={name}
        onSetValue={handleUpdateEvent((value: string) => ({ name: value }))}
        readonly={!isOwner}
      />
      <InputWithControls
        label="time"
        type="datetime-local"
        value={timeToStr(time)}
        displayValue={timeToStrPretty(time)}
        onSetValue={handleUpdateEvent((value: string) => ({ time: moment(value, TIME_FORMAT).unix() }))}
        readonly={!isOwner}
      />
      <HorizontalLine />
      <Link to={`/users/${creator.id}`}>
        <div>
          <div>Created by</div>
          <div>{creator.username}</div>
        </div>
      </Link>
      <HorizontalLine />
      <TextAreaWithControls
        label="description"
        value={description ?? ''}
        onSetValue={handleUpdateEvent((value: string) => ({ description: value }))}
        readonly={!isOwner}
      />
      {isLoggedIn && !isPariticipating && !isOwner && <div><button onClick={handleAddParticipation}>Participate</button></div>}
      <div className="mt-6">
        <div>Participants</div>
        <AnimatePresence>
          {participants.map(({ id, username }) =>
            <FadeDiv key={id}>
              <Link  to={`/users/${id}`}>{username}</Link>
              {id === userId && <button onClick={handleRemoveParticipation}>Leave</button>}
            </FadeDiv>
          )}
        </AnimatePresence>
      </div>
      <div className="mt-6">
        <div>Requirements</div>
        <div>
          <FadeDivWithPresence condition={newRequirement}>
            <NewRequirement eventId={eventId} onSaveRequirement={handleToggleNewRequirement} onCancel={handleToggleNewRequirement} />
          </FadeDivWithPresence>
          <AnimatePresence>
            {requirements.map(({ id, name, description, size }) =>
              <FadeDiv key={id}>
                <Requirement
                  id={id}
                  name={name}
                  description={description}
                  size={size}
                  fullfillments={fullfillments.filter(({ requirement }) => requirement === id)}
                  isOwner={isOwner}
                />
              </FadeDiv>
            )}
          </AnimatePresence>
        </div>
        {isOwner && !newRequirement && <Button onClick={handleToggleNewRequirement}>??? requirement</Button>}
      </div>
    </div>
  )
}

export default EventDetail;
