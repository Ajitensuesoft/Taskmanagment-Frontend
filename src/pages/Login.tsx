// import React from 'react';
import Log from './Log';
import './Signin.css';
// import { Link } from 'react-router-dom';

// type Props = {
//   setNormal: (value: boolean) => void;
// };

const Login = () => {
  

  return (
    <div className="signin-page">
      <div className="signin-box">
        {/* <h2>Sign In</h2> */}

        {/* ✅ Pass setNormal to Log */}
        <Log  />

        {/* <div className="divider">or</div>

        <button className="clerk-login-btn">
          <Link to="/clerk">Login with Clerk</Link>
        </button> */}
      </div>
    </div>
  );
};

export default Login;
