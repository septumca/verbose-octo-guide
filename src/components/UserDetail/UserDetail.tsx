import { useQuery } from "@tanstack/react-query";
import {
  useParams,
} from "react-router-dom";
import { fetchUser } from '../../utils/service';
import Loader from "../Loader";

export const QUERY_TAG = ['user', 'single'];

function UserDetail() {
  const { id: userId }: any = useParams();
  const { data, isLoading } = useQuery(QUERY_TAG, () => fetchUser(userId), { refetchOnWindowFocus: false });

  if (isLoading) {
    return <Loader />
  }

  return (
    <div>
      <div>User details:</div>
      <div>{data?.id}</div>
      <div>{data?.username}</div>
    </div>
  )
}

export default UserDetail;
