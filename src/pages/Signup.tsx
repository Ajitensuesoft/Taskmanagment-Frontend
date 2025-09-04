// import React from 'react';
import Sigup from './Sigup';
import './Signin.css';
// import { Link } from 'react-router-dom';

type Props = {
  setNormal: (value: boolean) => void;
};

const Signup = ({ setNormal }: Props) => {
  // const handleClerkSignup = () => {
  //   // This function isn't needed unless you're triggering Clerk modal manually
  //   // You're using a <Link> to /clerkSignup, which is fine
  // };

  return (
    <div className="signin-page">
      <div className="signin-box">
        <h2>Login</h2>

        {/* ✅ Pass setNormal to Sigup */}
        <Sigup setNormal={setNormal} />

        {/* <div className="divider">or</div>

        <button className="clerk-login-btn">
          <Link to="/clerkSignup">Signup with Clerk</Link>
        </button> */}
      </div>
    </div>
  );
};

export default Signup;
