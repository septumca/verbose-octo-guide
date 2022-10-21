import { getAuthData } from "../../utils/auth";

function UserToolbarInfo() {
  const { authData } = getAuthData();

  if (authData === undefined) {
    return null;
  }

  return (
    <div>You are logged in as {authData.username}</div>
  )
}

export default UserToolbarInfo;
