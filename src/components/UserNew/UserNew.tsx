import sha256 from 'crypto-js/sha256';
import { auth, register, verifyCaptcha } from '../../utils/service';
import ReCAPTCHA from "react-google-recaptcha";
import { useState } from "react";
import { useInputData } from "../../utils/utils";
import { saveToken } from '../../utils/auth';
import { useNavigate } from 'react-router-dom';


function UserNew() {
  const navigate = useNavigate();
  const [token, setToken] = useState<string | null>(null);
  const { data: registerData, handleInputChange } = useInputData({ login: '', password: '' });

  const onChange = (value: string | null) => {
    setToken(value);
  }

  const onCreate = async () => {
    if(token === null) {
      alert('Please fill out the captcha');
      return;
    }
    const isValid = await verifyCaptcha(token);
    if (!isValid) {
      alert('Captcha token is not valid');
      return;
    }

    const hashedPassword = sha256(registerData.password).toString();
    await register(registerData.login, hashedPassword)
    const data = await auth(registerData.login, hashedPassword);
    if(data) {
      saveToken(data.token);
      navigate('/events');
    }
  }

  return (
    <div>
      <div>
        <span>Name</span>
        <input
          placeholder="Login"
          aria-label="login"
          type="text"
          name="login"
          onChange={handleInputChange}
          required={true}
        />
      </div>
      <div>
        <span>Password</span>
        <input
          placeholder="Password"
          aria-label="Password"
          type="password"
          name="password"
          onChange={handleInputChange}
          required={true}
        />
      </div>
      <ReCAPTCHA
        onChange={onChange}
        sitekey={import.meta.env.VITE_CAPTCHA_SITE_KEY}
      />
      <div>
        <button disabled={registerData.login === '' || registerData.password === '' || token === null} onClick={onCreate}>Register</button>
      </div>
    </div>
  )
}

export default UserNew;
