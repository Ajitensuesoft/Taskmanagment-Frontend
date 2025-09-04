// import React from 'react';
// import { useForm } from 'react-hook-form';
// import './Sigup.css'; // optional styling
// import { handleSignup } from '../services/api';
// type FormData = {
//   email: string;
//   password: string;
// };

// const Sigup = () => {
//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useForm<FormData>();

//   const onSubmit = (data: FormData) => {
//     const wish=handleSignup(data);
//     console.log("wish",wish);
//     console.log('Signup data:', data);
//     // TODO: Send to backend or Clerk API
//   };

//   return (
//     <div className="signup-container">
//       <form onSubmit={handleSubmit(onSubmit)} className="signup-form">
//         <h2>Create Account</h2>

//         <label>Email</label>
//         <input
//           type="email"
//           {...register('email', { required: 'Email is required' })}
//         />
//         {errors.email && <p className="error">{errors.email.message}</p>}

//         <label>Password</label>
//         <input
//           type="password"
//           {...register('password', {
//             required: 'Password is required',
//             minLength: {
//               value: 6,
//               message: 'Password must be at least 6 characters',
//             },
//           })}
//         />
//         {errors.password && <p className="error">{errors.password.message}</p>}

//         <button type="submit">Sign Up</button>
//       </form>
//     </div>
//   );
// };

// export default Sigup;




// import React, { useState } from 'react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import { acceptinvite } from '../services/Apl';
import './Sigup.css';
// import { handleSignup } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { Signin } from "../services/Apl";

type FormData = {
  email: string;
  password: string;
};

type Props = {
  setNormal: (value: boolean) => void;
};

const Sigup = ({ setNormal }: Props) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const [hasPendingInvitation, setHasPendingInvitation] = useState(false);

  useEffect(() => {
    // Check if user is logging in to accept an invitation
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
      } 
      // else {
      //   navigate('/signin');
      // }
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
      navigate('/');
    } catch (error: any) {

      localStorage.removeItem('pendingInvitationToken');
      navigate('/');
    }
  };

  const onSubmit = async (data: FormData) => {
 
    console.log("data of singup", data);
    try {

      // const wish:any = await handleSignup(data);
      const wish: any = await Signin(data);
      console.log('wish', wish);
      localStorage.setItem("email", wish.email);
      localStorage.setItem("userId", wish.id);
      // ✅ Update login state
      if (wish) {
        setNormal(true);
        navigate('/');
      }

      // ✅ Optional: Redirect after signup
    } catch (error) {
      console.error('Signup failed:', error);
      // Optionally show error to user
    }
  };

  return (
    <div className="signup-container">
      <form onSubmit={handleSubmit(onSubmit)} className="signup-form">
        {hasPendingInvitation && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800 text-center">
              🎉 You're logging in to accept a workspace invitation!
            </p>
          </div>
        )}
        <h2>Create Account</h2>

        <label>Email</label>
        <input
          type="email"
          {...register('email', { required: 'Email is required' })}
        />
        {errors.email && <p className="error">{errors.email.message}</p>}

        <label>Password</label>
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

        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Sigup;

















//for thunk

// import React, { useState, useEffect } from "react";
// import { useForm } from "react-hook-form";
// import "./Sigup.css";
// import { useNavigate } from "react-router-dom";
// import { useAppDispatch, useAppSelector } from "../store/hook";
// import { signinThunk, acceptInviteThunk } from "../store/appslice";

// type FormData = {
//   email: string;
//   password: string;
// };

// type Props = {
//   setNormal: (value: boolean) => void;
// };

// const Sigup = ({ setNormal }: Props) => {
//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useForm<FormData>();

//   const navigate = useNavigate();
//   const dispatch = useAppDispatch();

//   const { token, loading, error, user } = useAppSelector((state) => state.app);
//   const [hasPendingInvitation, setHasPendingInvitation] = useState(false);

//   // Check if user is logging in to accept an invitation
//   useEffect(() => {
//     const pendingToken = localStorage.getItem("pendingInvitationToken");
//     if (pendingToken) {
//       setHasPendingInvitation(true);
//     }
//   }, []);

//   // Auto-accept invitation if token is found
//   useEffect(() => {
//     if (token) {
//       const pendingToken = localStorage.getItem("pendingInvitationToken");
//       if (pendingToken) {
//         dispatch(acceptInviteThunk(pendingToken))
//           .unwrap()
//           .then(() => {
//             localStorage.removeItem("pendingInvitationToken");
//             localStorage.setItem("justAcceptedInvitation", "true");
//             navigate("/");
//           })
//           .catch(() => {
//             localStorage.removeItem("pendingInvitationToken");
//             navigate("/");
//           });
//       }
//     }
//   }, [token, dispatch, navigate]);

//   const onSubmit = (data: FormData) => {
//     dispatch(signinThunk(data))
//       .unwrap()
//       .then((res) => {
//         localStorage.setItem("email", res.email);
//         localStorage.setItem("userId", res.id);
//         setNormal(true);
//         navigate("/");
//       })
//       .catch((err) => {
//         console.error("Login failed:", err);
//       });
//   };

//   return (
//     <div className="signup-container">
//       <form onSubmit={handleSubmit(onSubmit)} className="signup-form">
//         {hasPendingInvitation && (
//           <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
//             <p className="text-sm text-blue-800 text-center">
//               🎉 You're logging in to accept a workspace invitation!
//             </p>
//           </div>
//         )}
//         <h2>Login</h2>

//         <label>Email</label>
//         <input
//           type="email"
//           {...register("email", { required: "Email is required" })}
//         />
//         {errors.email && <p className="error">{errors.email.message}</p>}

//         <label>Password</label>
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

//         <button type="submit" disabled={loading}>
//           {loading ? "Logging in..." : "Login"}
//         </button>

//         {error && <p className="error">{error}</p>}
//       </form>
//     </div>
//   );
// };

// export default Sigup;
