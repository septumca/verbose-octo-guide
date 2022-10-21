import { useMutation } from "@tanstack/react-query";
import {
  Link,
} from "react-router-dom";
import { getAuthData } from "../../utils/auth";
import { createFullfillment, deleteFullfillment, deleteRequirement, User } from "../../utils/service";
import { QUERY_TAG, useEventDetailsSuccess } from "../EventDetail/EventDetail";

const useRequirementQueries = (requirement_id: number) => {
  const onSuccessHandler = useEventDetailsSuccess(QUERY_TAG);

  const addFullfillmentMut = useMutation(
    createFullfillment,
    {
      onSuccess: (data) => {
        onSuccessHandler(d => ({ ...d, fullfillments: [...d.fullfillments, data] }));
      }
    }
  );
  const removeFullfillmentMut = useMutation(
    (userId: number) => deleteFullfillment(userId, requirement_id),
    {
      onSuccess: (_data, userId) => {
        onSuccessHandler(d => ({ ...d, fullfillments: d.fullfillments.filter(p => p.requirement !== requirement_id || p.user.id !== userId )}));
      }
    }
  );
  const removeRequirementMut = useMutation(
    deleteRequirement,
    {
      onSuccess: (_data, id) => {
        onSuccessHandler(d => ({ ...d, requirements: d.requirements.filter(r => r.id !== id)}));
      }
    }
  );

  return {
    addFullfillmentMut,
    removeFullfillmentMut,
    removeRequirementMut
  }
}

type RequirementProps = {
  id: number,
  name: string,
  description?: string,
  size: number,
  fullfillments: { requirement: number, user: User }[],
  isOwner: boolean,
}

function Requirement({
  id,
  name,
  description,
  size,
  fullfillments,
  isOwner,
}: RequirementProps) {
  const { isLoggedIn, authData } = getAuthData();
  const userId = authData?.id;
  const hadFullfilled = userId !== null && fullfillments.some(({ user: { id } }) => id === userId);
  const {
    addFullfillmentMut,
    removeFullfillmentMut,
    removeRequirementMut
  } = useRequirementQueries(id);

  const handleAddFullfillment = () => {
    if (userId !== undefined) {
      addFullfillmentMut.mutate({ user: userId, requirement: id });
    }
  }

  const handleRemoveFullfillment = () => {
    if (userId !== undefined) {
      removeFullfillmentMut.mutate(userId);
    }
  }

  const handleDelete = () => {
    removeRequirementMut.mutate(id);
  }

  return (
    <div>
      <div>{name}</div>
      <div>{description}</div>
      {isOwner && <div><button onClick={handleDelete}>Delete</button></div>}
      {isLoggedIn && !hadFullfilled && size > fullfillments.length && <div><button onClick={handleAddFullfillment}>Fullfull</button></div>}
      <div>{fullfillments.length}/{size}</div>
      <div>Fullfilled by:
        {fullfillments.map(({ user: { id, username } }) =>
          <div key={id}>
            <Link to={`/users/${id}`}>{username}</Link>
            {id === userId && <button onClick={handleRemoveFullfillment}>Leave</button>}
          </div>
        )}
      </div>
    </div>
  )
}

export default Requirement;
