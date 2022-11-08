import { useMutation } from "@tanstack/react-query";
import {
  Link,
} from "react-router-dom";
import { getAuthData } from "../../utils/auth";
import { createFullfillment, deleteFullfillment, deleteRequirement, EventDetailData, updateRequirement, UpdateRequirement, User } from "../../utils/service";
import { useMutatorSuccess, useToggler } from "../../utils/utils";
import { Button } from "../Button/Button";
import { QUERY_TAG } from "../EventDetail/EventDetail";
import { InputWithControls, TextAreaWithControls } from "../Input/Input";

const useRequirementQueries = (requirement_id: number) => {
  const onSuccessHandler = useMutatorSuccess<EventDetailData>(QUERY_TAG);

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
  const updateRequirementMut = useMutation(
    (data: UpdateRequirement) => updateRequirement(requirement_id, data),
    {
      onSuccess: (_data, variables) => {
        onSuccessHandler(d => ({ ...d, requirements: d.requirements.map(r => r.id === requirement_id ? { ...r, ...variables } : r)}));
      }
    }
  );

  return {
    addFullfillmentMut,
    removeFullfillmentMut,
    removeRequirementMut,
    updateRequirementMut,
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
    removeRequirementMut,
    updateRequirementMut,
  } = useRequirementQueries(id);
  const [detailsVisible, toggleDetailsVisible] = useToggler(false);

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

  const handleUpdateRequirement = (transform: (value: string) => UpdateRequirement) => (value: string) => {
    let payload = transform(value);
    updateRequirementMut.mutate(payload);
  }

  return (
    <div>
      <InputWithControls
        label="name"
        value={name}
        onSetValue={handleUpdateRequirement((value: string) => ({ name: value }))}
        readonly={isOwner}
      />
      <div></div>
      {isOwner && <div><Button onClick={handleDelete} title="delete requirement">🗑️</Button></div>}
      <div>
        {isLoggedIn && !hadFullfilled && size > fullfillments.length && <Button onClick={handleAddFullfillment} title="fullfill">👍</Button>}
        <Button title="see details" onClick={toggleDetailsVisible}>👁️‍🗨️</Button>
        <span>{fullfillments.length}/{size}</span>
      </div>
      {detailsVisible && <TextAreaWithControls
        label="description"
        value={description ?? ''}
        onSetValue={handleUpdateRequirement((value: string) => ({ description: value }))}
        readonly={isOwner}
      />}
      {detailsVisible && <div>Fullfilled by:
        {fullfillments.map(({ user: { id, username } }) =>
          <div key={id}>
            <Link to={`/users/${id}`}>{username}</Link>
            {id === userId && <Button onClick={handleRemoveFullfillment} title="leave">🏃💨</Button>}
          </div>
        )}
      </div>}
    </div>
  )
}

export default Requirement;
