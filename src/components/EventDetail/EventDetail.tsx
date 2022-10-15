import { useState } from "react";
import {
  Link,
  useFetcher,
  useLoaderData,
} from "react-router-dom";
import { getUserId, isLoggedIn } from "../../utils/auth";
import { createRequirement, CreateRequirement, EventDetailData, fetchEvent } from '../../utils/service';
import { getFormData } from "../../utils/utils";
import Requirement from "./Requirement";

type LoaderResponse = EventDetailData;

export async function loader({ params }: any) {
  return await fetchEvent(params.id);
}

export async function action({ request, params }: any) {
  console.info(request, request.id);
  let data = await getFormData(request, { removeEmptyString: true });
  data.event = parseInt(params.id, 10);
  //how to identify form id and how to set state to som evalue, e.g. newRequirement
  await createRequirement(data as CreateRequirement);
}

function EventDetail() {
  const { creator, fullfillments, name, description, participants, requirements } = useLoaderData() as LoaderResponse;
  const loggedIn = isLoggedIn();
  const userId = getUserId();
  const isPariticipating = userId && (participants.some(({ id }) => id === userId) || userId === creator.id);
  const fetcher = useFetcher();
  const [newRequirement, setNewRequirement] = useState(false);

  const handleToggleNewRequirement = () => {
    setNewRequirement(r => !r);
  }

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
        <div>
          {!newRequirement && <button onClick={handleToggleNewRequirement}>Add new requirement</button>}
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
    </div>
  )
}

export default EventDetail;
