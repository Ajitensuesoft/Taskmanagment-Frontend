// import React from 'react';
// import { useForm } from 'react-hook-form';
// import './Log.css'; // optional styling
// import {handleSignin} from '../services/api';
// type FormData = {
//   email: string;
//   password: string;
//   confirmPassword: string;
// };


// const Log = () => {
//   const {
//     register,
//     handleSubmit,
//     watch,
//     formState: { errors }
//   } = useForm<FormData>();

//   const onSubmit = async(data: FormData) => {
//     let wish=await handleSignin(data);
//     console.log("wish",wish);
//     console.log('Login data:', data);
//     // You can send this to your backend here
//   };

//   const password = watch('password');

//   return (
//     <form onSubmit={handleSubmit(onSubmit)} className="login-form">
//       <h2>Login</h2>

//       <div>
//         <label>Email:</label>
//         <input
//           type="email"
//           {...register('email', {
//             required: 'Email is required',
//             pattern: {
//               value: /^\S+@\S+$/i,
//               message: 'Invalid email address'
//             }
//           })}
//         />
//         {errors.email && <p className="error">{errors.email.message}</p>}
//       </div>

//       <div>
//         <label>Password:</label>
//         <input
//           type="password"
//           {...register('password', {
//             required: 'Password is required',
//             minLength: {
//               value: 6,
//               message: 'Password must be at least 6 characters'
//             }
//           })}
//         />
//         {errors.password && <p className="error">{errors.password.message}</p>}
//       </div>

//       <div>
//         <label>Confirm Password:</label>
//         <input
//           type="password"
//           {...register('confirmPassword', {
//             required: 'Please confirm your password',
//             validate: value =>
//               value === password || 'Passwords do not match'
//           })}
//         />
//         {errors.confirmPassword && <p className="error">{errors.confirmPassword.message}</p>}
//       </div>

//       <button type="submit">Login</button>
//     </form>
//   );
// };

// export default Log;



import  { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import './Log.css';
// import { handleSignin } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { Signup } from '../services/Apl';
import { acceptinvite } from '../services/Apl';

type FormData = {
  email: string,
  password: string,
  confirmPassword: string,
};

// type Props = {
//   setNormal: (value: boolean) => void;
// };

const Log = ( ) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>();

  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const password = watch('password');
  const [hasPendingInvitation, setHasPendingInvitation] = useState(false);
  useEffect(() => {
    // Check if user is signing up to accept an invitation
    const pendingToken = localStorage.getItem('pendingInvitationToken');
    if (pendingToken) {
      setHasPendingInvitation(true);
    }
  }, []);

  useEffect(() => {
    if (token) {
      // Check if there's a pending invitation
      const pendingToken = localStorage.getItem('pendingInvitationToken');
      if (pendingToken) {
        handlePendingInvitation(pendingToken);
      } else {
        navigate('/signup');
      }
    }
  }, [token, navigate]);

  const handlePendingInvitation = async (invitationToken: string) => {
    try {

      // await dispatch(acceptInvitation(invitationToken)).unwrap();
      let data = await acceptinvite(invitationToken);
      console.log("hitted api", data);
      localStorage.removeItem('pendingInvitationToken');
      // Set flag to show welcome message in dashboard
      localStorage.setItem('justAcceptedInvitation', 'true');
      navigate('/dashboard');
    } catch (error: any) {

      localStorage.removeItem('pendingInvitationToken');
      navigate('/dashboard');
    }
  };

  const onSubmit = async (data: FormData) => {
    debugger
    console.log('Login data:', data);
    try {
      // const wish:any = await handleSignin(data);
      const wish: any = await Signup(data);
      console.log('wish', wish);


      if (wish) {

        navigate('/signin');
      }

      // ✅ Optional: Redirect to dashboard or home

    } catch (error) {
      console.error('Login failed:', error);
      // Optionally show error to user
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="login-form">
      {hasPendingInvitation && (
        <div >
          <p>
            🎉 You're signing up to accept a workspace invitation!
          </p>
        </div>
      )}
      <h2>Singup</h2>

      <div>
        <label>Email:</label>
        <input
          type="email"
          {...register('email', {
            required: 'Email is required',
            pattern: {
              value: /^\S+@\S+$/i,
              message: 'Invalid email address',
            },
          })}
        />
        {errors.email && <p className="error">{errors.email.message}</p>}
      </div>

      <div>
        <label>Password:</label>
        <input
          type="password"
          {...register('password', {
            required: 'Password is required',
            minLength: {
              value: 6,
              message: 'Password must be at least 6 characters',
            },
          })}
        />
        {errors.password && <p className="error">{errors.password.message}</p>}
      </div>

      <div>
        <label>Confirm Password:</label>
        <input
          type="password"
          {...register('confirmPassword', {
            required: 'Please confirm your password',
            validate: value =>
              value === password || 'Passwords do not match',
          })}
        />
        {errors.confirmPassword && (
          <p className="error">{errors.confirmPassword.message}</p>
        )}
      </div>

      <button type="submit">Singup</button>
    </form>
  );
};

export default Log;



























//for using thunk

// import React, { useEffect, useState } from "react";
// import { useForm } from "react-hook-form";
// import "./Log.css";
// import { useNavigate } from "react-router-dom";
// import { useAppDispatch, useAppSelector } from "../store/hook";
// import { signupThunk, acceptInviteThunk } from "../store/appslice";

// type FormData = {
//   email: string;
//   password: string;
//   confirmPassword: string;
// };

// type Props = {
//   setNormal: (value: boolean) => void;
// };

// const Log = ({ setNormal }: Props) => {
//   const {
//     register,
//     handleSubmit,
//     watch,
//     formState: { errors },
//   } = useForm<FormData>();

//   const navigate = useNavigate();
//   const dispatch = useAppDispatch();

//   const { loading, error, token } = useAppSelector((state) => state.app);

//   const password = watch("password");
//   const [hasPendingInvitation, setHasPendingInvitation] = useState(false);

//   // Check if user is signing up via invitation
//   useEffect(() => {
//     const pendingToken = localStorage.getItem("pendingInvitationToken");
//     if (pendingToken) {
//       setHasPendingInvitation(true);
//     }
//   }, []);

//   // Auto-accept invite if token exists after signup
//   useEffect(() => {
//     if (token) {
//       const pendingToken = localStorage.getItem("pendingInvitationToken");
//       if (pendingToken) {
//         dispatch(acceptInviteThunk(pendingToken))
//           .unwrap()
//           .then(() => {
//             localStorage.removeItem("pendingInvitationToken");
//             localStorage.setItem("justAcceptedInvitation", "true");
//             navigate("/dashboard");
//           })
//           .catch(() => {
//             localStorage.removeItem("pendingInvitationToken");
//             navigate("/dashboard");
//           });
//       } else {
//         navigate("/signup");
//       }
//     }
//   }, [token, dispatch, navigate]);

//   const onSubmit = (data: FormData) => {
//     dispatch(signupThunk(data))
//       .unwrap()
//       .then(() => {
//         navigate("/signin");
//       })
//       .catch((err) => console.error("Signup failed:", err));
//   };

//   return (
//     <form onSubmit={handleSubmit(onSubmit)} className="login-form">
//       {hasPendingInvitation && (
//         <div>
//           <p>🎉 You're signing up to accept a workspace invitation!</p>
//         </div>
//       )}
//       <h2>Signup</h2>

//       <div>
//         <label>Email:</label>
//         <input
//           type="email"
//           {...register("email", {
//             required: "Email is required",
//             pattern: {
//               value: /^\S+@\S+$/i,
//               message: "Invalid email address",
//             },
//           })}
//         />
//         {errors.email && <p className="error">{errors.email.message}</p>}
//       </div>

//       <div>
//         <label>Password:</label>
//         <input
//           type="password"
//           {...register("password", {
//             required: "Password is required",
//             minLength: {
//               value: 6,
//               message: "Password must be at least 6 characters",
//             },
//           })}
//         />
//         {errors.password && <p className="error">{errors.password.message}</p>}
//       </div>

//       <div>
//         <label>Confirm Password:</label>
//         <input
//           type="password"
//           {...register("confirmPassword", {
//             required: "Please confirm your password",
//             validate: (value) =>
//               value === password || "Passwords do not match",
//           })}
//         />
//         {errors.confirmPassword && (
//           <p className="error">{errors.confirmPassword.message}</p>
//         )}
//       </div>

//       <button type="submit" disabled={loading}>
//         {loading ? "Signing up..." : "Signup"}
//       </button>

//       {error && <p className="error">{error}</p>}
//     </form>
//   );
// };

// export default Log;
