import { auth } from '../../utils/service';
import { saveToken } from "../../utils/auth";

import sha256 from 'crypto-js/sha256';
import { useLocation, useNavigate } from 'react-router-dom';
import { useInputData } from '../../utils/utils';

function Login() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { data: loginData, handleInputChange } = useInputData({ login: '', password: '' });

  const handleLogin = async () => {
    const data = await auth(loginData.login, sha256(loginData.password).toString());
    if(data) {
      saveToken(data.token);
      navigate(state?.from ?? '/events');
    }
  }

  return (
    <>
      <div>
        User:
        <input name="login" type="text" onChange={handleInputChange} />
      </div>
      <div>
        Password:
        <input name="password" type="password" onChange={handleInputChange} />
      </div>
      <button disabled={loginData.login === '' || loginData.password === ''} onClick={handleLogin}>Login</button>
    </>
  )
}

export default Login;
