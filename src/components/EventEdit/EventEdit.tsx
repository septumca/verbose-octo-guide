import { Fragment, useId, useRef, useState } from "react";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import {
  Link,
  redirect,
  useFetcher,
  useLoaderData,
  useNavigate,
  useParams,
} from "react-router-dom";
import { getUserId, isLoggedIn } from "../../utils/auth";
import {
  createParticipant,
  createRequirement,
  deleteParticipant,
  deleteRequirement,
  EventDetailData,
  fetchEvent,
  UpdateEvent,
  updateEvent
} from '../../utils/service';
import { getFormData, getSynthenticEventFormData, useInvalidateMutation } from "../../utils/utils";
import Requirement from "../Requirement/Requirement";

export async function loader({ params }: any) {
  return fetchEvent(params.id);
}

export async function action({ request, params }: any) {
  let data = await getFormData(request, { removeEmptyString: true });
  await updateEvent(data as UpdateEvent);
  return redirect(`/events/${params.id}`);
}

function EventEdit() {
  const navigate = useNavigate();
  const data = useLoaderData() as EventDetailData
  const { id }: any = useParams();
  const userId = getUserId();
  const [newRequirement, setNewRequirement] = useState(false);
  const fetcher = useFetcher();

  const loggedIn = isLoggedIn();
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

    // addRequirement.mutate(data);
  }

  const handleRemoveRequirement = (id: number) => () => {
    // removeRequirement.mutate(id);
  }

  const handleAddParticipation = async () => {
    if (userId) {
      // addParticipation.mutate({ user: userId, event: parseInt(id, 10) });
    }
  }

  const handleRemoveParticipation = async () => {
    if (userId) {
      // removeParticipation.mutate(userId);
    }
  }

  const handleCancel = () => {
    navigate(`/events/${id}`);
  }

  return (
    <div>
      <div>
        <span>Name</span>
        <input
          placeholder="Event Name"
          aria-label="Event name"
          type="text"
          name="name"
          defaultValue={name}
        />
      </div>
      <Link to={`/users/${creator.id}`}>
        <div>
          {creator.username}
        </div>
      </Link>
      <div>
        <div>Description</div>
        <textarea
          name="description"
          rows={6}
          defaultValue={description}
        />
      </div>
      <div>Participants:
        {participants.map(({ id, username }) =>
          <div key={id}>
            <Link  to={`/users/${id}`}>{username}</Link>
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
              showControls={false}
            />
            {isOwner && <button onClick={handleRemoveRequirement(id)}>Remove</button>}
          </Fragment>
        )}
        <div>
        {isOwner && !newRequirement && <button onClick={handleToggleNewRequirement}>Add new requirement</button>}
          {newRequirement && <fetcher.Form method="post" id="requirement-form">
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
          </fetcher.Form>}
        </div>
      </div>
      <div>
        <button type="submit">Save</button>
        <button type="button" onClick={handleCancel}>Cancel</button>
      </div>
    </div>
  )
}

export default EventEdit;
