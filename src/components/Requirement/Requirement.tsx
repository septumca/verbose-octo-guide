import { useMutation } from "@tanstack/react-query";
import {
  Link,
} from "react-router-dom";
import { getAuthData } from "../../utils/auth";
import { createFullfillment, deleteFullfillment, deleteRequirement, updateRequirement, UpdateRequirement, User } from "../../utils/service";
import { useToggler } from "../../utils/utils";
import { IconButton } from "../Button/IconButton";
import { QUERY_TAG, useEventDetailsSuccess } from "../EventDetail/EventDetail";
import { Input, TextArea } from "../Input/Input";

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
      <Input
        label="name"
        value={name}
        onSetValue={handleUpdateRequirement((value: string) => ({ name: value }))}
        readonly={isOwner}
      />
      <div></div>
      {isOwner && <div><IconButton onClick={handleDelete} title="delete requirement">🗑️</IconButton></div>}
      <div>
        {isLoggedIn && !hadFullfilled && size > fullfillments.length && <IconButton onClick={handleAddFullfillment} title="fullfill">✔️</IconButton>}
        <IconButton title="see details" onClick={toggleDetailsVisible}>👁️‍🗨️</IconButton>
        <span>{fullfillments.length}/{size}</span>
      </div>
      {detailsVisible && <TextArea
        label="description"
        value={description ?? ''}
        onSetValue={handleUpdateRequirement((value: string) => ({ description: value }))}
        readonly={isOwner}
      />}
      {detailsVisible && <div>Fullfilled by:
        {fullfillments.map(({ user: { id, username } }) =>
          <div key={id}>
            <Link to={`/users/${id}`}>{username}</Link>
            {id === userId && <IconButton onClick={handleRemoveFullfillment} title="leave">🏃💨</IconButton>}
          </div>
        )}
      </div>}
    </div>
  )
}

export default Requirement;
