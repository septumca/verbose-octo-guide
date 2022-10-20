import { Fragment, useState } from "react";
import {
  Link,
  useLoaderData,
  useParams,
} from "react-router-dom";
import { getUserId, isLoggedIn } from "../../utils/auth";
import {
  createFullfillment,
  createParticipant,
  createRequirement,
  deleteFullfillment,
  deleteParticipant,
  deleteRequirement,
  EventDetailData,
  fetchEvent
} from '../../utils/service';
import { getSynthenticEventFormData } from "../../utils/utils";
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
  const [newRequirement, setNewRequirement] = useState(false);

  const { name, description, participants, creator, requirements, fullfillments } = data;
  const isOwner = userId !== null && userId === creator.id;
  const isPariticipating = userId !== null && (participants.some(({ id }) => id === userId));

  const handleToggleNewRequirement = () => {
    setNewRequirement(r => !r);
  }

  const handleAddRequirement = async (event: React.SyntheticEvent) => {
    event.preventDefault();
    const target = getSynthenticEventFormData(event);
    let data = {
      event: parseInt(id, 10),
      name: target.name.value,
      description: target.description.value || undefined,
      size: parseInt(target.size.value, 10) || 1,
    };

    let requirement = await createRequirement(data);
    setData(d => ({ ...d, requirements: [...d.requirements, requirement]}));
    setNewRequirement(false);
  }

  const handleRemoveRequirement = async (id: number) => {
    await deleteRequirement(id);
    setData(d => ({ ...d, requirements: d.requirements.filter(r => r.id !== id)}));
  }

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

  const handleAddFullfillment = async (requirement_id: number) => {
    if (userId) {
      let new_fullfillment = await createFullfillment({ user: userId, requirement: requirement_id });
      setData(d => ({ ...d, fullfillments: [...d.fullfillments, new_fullfillment] }));
    }
  }

  const handleRemoveFullfillment = async (requirement_id: number) => {
    if (userId) {
      await deleteFullfillment(userId, requirement_id);
      setData(d => ({ ...d, fullfillments: d.fullfillments.filter(p => p.requirement !== requirement_id || p.user.id !== userId )}));
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
              id={id}
              name={name}
              description={description}
              size={size}
              fullfillments={fullfillments.filter(({ requirement }) => requirement === id)}
              isOwner={isOwner}
              onDelete={handleRemoveRequirement}
              onAddFullfillment={handleAddFullfillment}
              onRemoveFullfillment={handleRemoveFullfillment}
            />
          </Fragment>
        )}
        {isOwner && !newRequirement && <button onClick={handleToggleNewRequirement}>Add new requirement</button>}
        {newRequirement && <form id="requirement-form" onSubmit={handleAddRequirement}>
            <div>
              <span>Name</span>
              <input
                placeholder="Requirement Name"
                aria-label="Requirement name"
                type="text"
                name="name"
                required={true}
              />
            </div>
            <div>
              <span>Size</span>
              <input
                placeholder="1"
                aria-label="Requirement size"
                type="number"
                name="size"
              />
            </div>
            <div>
              <div>Description</div>
              <textarea
                name="description"
                rows={6}
              />
            </div>
            <div>
              <button type="submit">Save</button>
              <button type="button" onClick={handleToggleNewRequirement}>Cancel</button>
            </div>
          </form>}
      </div>
    </div>
  )
}

export default EventDetail;
