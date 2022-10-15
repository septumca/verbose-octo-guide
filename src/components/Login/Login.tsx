import { auth } from '../../utils/service';
import { saveToken } from "../../utils/auth";
import { useState } from "react";

import sha256 from 'crypto-js/sha256';
import { useLocation, useNavigate } from 'react-router-dom';

function Login() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [loginData, setLoginData] = useState<{[x: string]: string }>({ login: '', password: '' });

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLoginData(ld => ({
      ...ld,
      [event.target.name]: event.target.value
    }));
  }

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
