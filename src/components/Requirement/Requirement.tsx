import {
  Link,
} from "react-router-dom";
import { getUserId, isLoggedIn } from "../../utils/auth";
import { User } from "../../utils/service";

type RequirementProps = {
  id: number,
  name: string,
  description?: string,
  size: number,
  fullfillments: { requirement: number, user: User }[],
  isOwner: boolean,
  onDelete: (id: number) => {},
  onAddFullfillment: (id: number) => {},
  onRemoveFullfillment: (id: number) => {},
}

function Requirement({
  id,
  name,
  description,
  size,
  fullfillments,
  isOwner,
  onDelete,
  onAddFullfillment,
  onRemoveFullfillment
}: RequirementProps) {
  const loggedIn = isLoggedIn();
  const userId = getUserId();
  const hadFullfilled = userId && fullfillments.some(({ user: { id } }) => id === userId);

  const handleAddFullfillment = () => {
    onAddFullfillment(id);
  }

  const handleRemoveFullfillment = () => {
    onRemoveFullfillment(id);
  }

  const handleDelete = () => {
    onDelete(id);
  }

  return (
    <div>
      <div>{name}</div>
      <div>{description}</div>
      {isOwner && <div><button onClick={handleDelete}>Delete</button></div>}
      {loggedIn && !hadFullfilled && size > fullfillments.length && <div><button onClick={handleAddFullfillment}>Fullfull</button></div>}
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
