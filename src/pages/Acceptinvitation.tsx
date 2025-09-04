import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

// ✅ replace with your real API call
const acceptInvitationApi = async (token: string) => {
  // Example: call backend to accept invitation
  const res = await fetch(`/api/invitations/accept/${token}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) throw new Error("Failed to accept invitation");
  return await res.json();
};

const Acceptinvitation: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [invitationData, setInvitationData] = useState<{
    workspaceName: string;
    inviterName: string;
    role: string;
    workspaceId: string;
  } | null>(null);
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    if (token) {
      try {
        // Normally decode token or fetch details
        setInvitationData({
          workspaceName: "Your Team Workspace",
          inviterName: "Team Member",
          role: "Member",
          workspaceId: "pending",
        });

        // Check if user is authenticated
        const authToken = localStorage.getItem("authToken"); // replace with real auth logic
        if (!authToken) {
          setShowAuthPrompt(true);
        } else {
          setShowAuthPrompt(false);
        }
      } catch (error) {
        console.error("Error processing invitation token:", error);
        alert("Invalid invitation link");
        navigate("/dashboard");
      }
    }
  }, [token, navigate]);

  const handleAcceptInvitation = async () => {
    if (!token || isLoading) return;
    setIsLoading(true);

    try {
      await acceptInvitationApi(token);
      alert("Invitation accepted successfully! 🎉 Welcome to the workspace!");
      localStorage.removeItem("pendingInvitationToken");
      localStorage.setItem("justAcceptedInvitation", "true");
      navigate("/dashboard");
    } catch (error: any) {
      console.error("Failed to accept invitation:", error.message);

      // Example: handle redirect reason
      const redirectReason = localStorage.getItem("redirectReason");
      if (redirectReason === "user-not-found") {
        localStorage.removeItem("redirectReason");
        setIsRedirecting(true);
        setTimeout(() => {
          navigate("/signup");
        }, 1500);
      } else {
        alert("Failed to accept invitation. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeclineInvitation = () => {
    alert("Invitation declined 👋");
    navigate("/dashboard");
  };

  const handleLoginRedirect = () => {
    localStorage.setItem("pendingInvitationToken", token || "");
    navigate("/signin");
  };

  const handleRegisterRedirect = () => {
    localStorage.setItem("pendingInvitationToken", token || "");
    navigate("/signup");
  };

  if (!invitationData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading invitation...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
            <svg
              className="h-8 w-8 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            You're Invited! 🎉
          </h1>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-left">
            <p className="text-gray-700 mb-2">
              <span className="font-medium text-gray-900">
                {invitationData.inviterName}
              </span>{" "}
              has invited you to join{" "}
              <span className="font-medium text-blue-600">
                {invitationData.workspaceName}
              </span>
            </p>
            <p className="text-sm text-gray-600">
              Role:{" "}
              <span className="font-medium text-gray-900 capitalize">
                {invitationData.role}
              </span>
            </p>
          </div>

          {isRedirecting ? (
            <p className="text-green-600 font-medium text-sm">
              Redirecting to signup...
            </p>
          ) : showAuthPrompt ? (
            <div className="space-y-3">
              <p className="text-red-600 font-medium text-sm">
                To accept this invitation, you need to have an account.
              </p>
              <button
                onClick={handleLoginRedirect}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-md transition-colors"
              >
                Log In to Existing Account
              </button>
              <button
                onClick={handleRegisterRedirect}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-md transition-colors"
              >
                Create New Account
              </button>
              <p className="text-xs text-gray-500 mt-2">
                After logging in or registering, you'll be automatically added
                to the workspace.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <button
                onClick={handleAcceptInvitation}
                disabled={isLoading}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-md transition-colors disabled:opacity-50"
              >
                {isLoading ? "Accepting..." : "Accept Invitation"}
              </button>

              <button
                onClick={handleDeclineInvitation}
                disabled={isLoading}
                className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-3 px-4 rounded-md transition-colors"
              >
                Decline
              </button>
            </div>
          )}

          <div className="mt-6 text-xs text-gray-500 space-y-1">
            <p>By accepting this invitation, you'll be able to:</p>
            <ul className="text-left list-disc list-inside space-y-1">
              <li>Collaborate with your team on this workspace</li>
              <li>Create and manage boards, lists, and cards</li>
              <li>Invite other team members</li>
              <li>Create your own workspaces</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Acceptinvitation;
















//for thunkk
// import React, { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { useAppDispatch, useAppSelector } from "../store/hook";
// import { acceptInviteThunk } from "../store/appslice";

// const Acceptinvitation: React.FC = () => {
//   const { token } = useParams<{ token: string }>();
//   const navigate = useNavigate();
//   const dispatch = useAppDispatch();

//   const { loading, error } = useAppSelector((state) => state.app);

//   const [invitationData, setInvitationData] = useState<{
//     workspaceName: string;
//     inviterName: string;
//     role: string;
//     workspaceId: string;
//   } | null>(null);
//   const [showAuthPrompt, setShowAuthPrompt] = useState(false);
//   const [isRedirecting, setIsRedirecting] = useState(false);

//   useEffect(() => {
//     if (token) {
//       try {
//         // Dummy invitation details (replace if backend gives details)
//         setInvitationData({
//           workspaceName: "Your Team Workspace",
//           inviterName: "Team Member",
//           role: "Member",
//           workspaceId: "pending",
//         });

//         // Check auth
//         const authToken = localStorage.getItem("authToken");
//         setShowAuthPrompt(!authToken);
//       } catch (error) {
//         console.error("Error processing invitation token:", error);
//         alert("Invalid invitation link");
//         navigate("/dashboard");
//       }
//     }
//   }, [token, navigate]);

//   const handleAcceptInvitation = async () => {
//     if (!token || loading) return;

//     try {
//       await dispatch(acceptInviteThunk(token)).unwrap(); // ✅ thunk instead of direct API
//       alert("Invitation accepted successfully! 🎉 Welcome to the workspace!");
//       localStorage.removeItem("pendingInvitationToken");
//       localStorage.setItem("justAcceptedInvitation", "true");
//       navigate("/dashboard");
//     } catch (error: any) {
//       console.error("Failed to accept invitation:", error);

//       const redirectReason = localStorage.getItem("redirectReason");
//       if (redirectReason === "user-not-found") {
//         localStorage.removeItem("redirectReason");
//         setIsRedirecting(true);
//         setTimeout(() => {
//           navigate("/signup");
//         }, 1500);
//       } else {
//         alert("Failed to accept invitation. Please try again.");
//       }
//     }
//   };

//   const handleDeclineInvitation = () => {
//     alert("Invitation declined 👋");
//     navigate("/dashboard");
//   };

//   const handleLoginRedirect = () => {
//     localStorage.setItem("pendingInvitationToken", token || "");
//     navigate("/signin");
//   };

//   const handleRegisterRedirect = () => {
//     localStorage.setItem("pendingInvitationToken", token || "");
//     navigate("/signup");
//   };

//   if (!invitationData) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
//           <p className="mt-4 text-gray-600">Loading invitation...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen flex items-center justify-center p-4">
//       <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
//         <div className="text-center">
//           <h1 className="text-2xl font-bold mb-2">You're Invited! 🎉</h1>

//           <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-left">
//             <p className="mb-2">
//               <span className="font-medium">{invitationData.inviterName}</span>{" "}
//               has invited you to join{" "}
//               <span className="font-medium text-blue-600">
//                 {invitationData.workspaceName}
//               </span>
//             </p>
//             <p className="text-sm">
//               Role:{" "}
//               <span className="font-medium capitalize">
//                 {invitationData.role}
//               </span>
//             </p>
//           </div>

//           {isRedirecting ? (
//             <p className="text-green-600 font-medium text-sm">
//               Redirecting to signup...
//             </p>
//           ) : showAuthPrompt ? (
//             <div className="space-y-3">
//               <p className="text-red-600 font-medium text-sm">
//                 To accept this invitation, you need to have an account.
//               </p>
//               <button onClick={handleLoginRedirect} className="w-full btn">
//                 Log In to Existing Account
//               </button>
//               <button onClick={handleRegisterRedirect} className="w-full btn">
//                 Create New Account
//               </button>
//             </div>
//           ) : (
//             <div className="space-y-3">
//               <button
//                 onClick={handleAcceptInvitation}
//                 disabled={loading}
//                 className="w-full btn btn-green"
//               >
//                 {loading ? "Accepting..." : "Accept Invitation"}
//               </button>

//               <button
//                 onClick={handleDeclineInvitation}
//                 disabled={loading}
//                 className="w-full btn btn-gray"
//               >
//                 Decline
//               </button>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Acceptinvitation;

