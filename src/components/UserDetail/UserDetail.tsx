import {
  useLoaderData,
} from "react-router-dom";
import { fetchUser, User } from '../../utils/service';

type LoaderResponse = User;

export async function loader({ params }: any) {
  return await fetchUser(params.id);
}

function UserDetail() {
  const { id, username } = useLoaderData() as LoaderResponse;

  return (
    <div>
      <div>User details:</div>
      <div>{id}</div>
      <div>{username}</div>
    </div>
  )
}

export default UserDetail;
