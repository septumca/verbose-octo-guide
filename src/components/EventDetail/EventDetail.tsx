import { Fragment, useId, useRef, useState } from "react";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import {
  Link,
  useParams,
} from "react-router-dom";
import { getUserId, isLoggedIn } from "../../utils/auth";
import {
  createParticipant,
  createRequirement,
  deleteParticipant,
  deleteRequirement,
  fetchEvent
} from '../../utils/service';
import { getSynthenticEventFormData, useInvalidateMutation } from "../../utils/utils";
import Requirement from "./Requirement";
import Loader from "../Loader";

const QUERY = 'event-details';

function EventDetail() {
  const { id }: any = useParams();
  const userId = getUserId();
  const loggedIn = isLoggedIn();
  const { isLoading, data } = useQuery([QUERY], () => fetchEvent(id), {
    refetchOnWindowFocus: false
  });
  const [newRequirement, setNewRequirement] = useState(false);
  const addRequirement = useInvalidateMutation(createRequirement, QUERY);
  const removeRequirement = useInvalidateMutation(deleteRequirement, QUERY);
  const addParticipation = useInvalidateMutation(createParticipant, QUERY);
  const removeParticipation = useInvalidateMutation((userId: number) => deleteParticipant(userId, parseInt(id, 10)), QUERY);

  if (isLoading) {
    return <Loader />
  }

  if (!data) {
    return null;
  }

  const { name, description, participants, creator, requirements, fullfillments } = data;
  const isOwner = userId && userId === creator.id;
  const isPariticipating = userId && (participants.some(({ id }) => id === userId));

  const handleToggleNewRequirement = () => {
    setNewRequirement(r => !r);
  }

  const handleAddRequirement = (event: React.SyntheticEvent) => {
    event.preventDefault();
    const target = getSynthenticEventFormData(event);
    let data = {
      event: parseInt(id, 10),
      name: target.name.value,
      description: target.description.value || undefined,
      size: parseInt(target.size.value, 10) || 1,
    };

    addRequirement.mutate(data);
  }

  const handleRemoveRequirement = (id: number) => () => {
    removeRequirement.mutate(id);
  }

  const handleAddParticipation = async () => {
    if (userId) {
      addParticipation.mutate({ user: userId, event: parseInt(id, 10) });
    }
  }

  const handleRemoveParticipation = async () => {
    if (userId) {
      removeParticipation.mutate(userId);
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
            />
            {isOwner && <button onClick={handleRemoveRequirement(id)}>Remove</button>}
          </Fragment>
        )}
        <div>
          {isOwner && !newRequirement && <button onClick={handleToggleNewRequirement}>Add new requirement</button>}
          {newRequirement && <form method="post" id="requirement-form" onSubmit={handleAddRequirement}>
            <p>
              <span>Name</span>
              <input
                placeholder="Requirement Name"
                aria-label="Requirement name"
                type="text"
                name="name"
              />
            </p>
            <p>
              <span>Size</span>
              <input
                placeholder="1"
                aria-label="Requirement size"
                type="number"
                name="size"
              />
            </p>
            <div>
              <div>Description</div>
              <textarea
                name="description"
                rows={6}
              />
            </div>
            <p>
              <button type="submit">Save</button>
              <button onClick={handleToggleNewRequirement}>Cancel</button>
            </p>
          </form>}
        </div>
      </div>
    </div>
  )
}

export default EventDetail;
