// import { SignInButton, SignUpButton, UserButton, useUser } from '@clerk/clerk-react';
// import { Link } from 'react-router-dom';
// import ProtectedLink from './ProtectedLink'; // 👈 import it
// import './Nabar.css';
// import { useState } from 'react';

// const Navbar = () => {
//   const { isSignedIn } = useUser();
//   const[normal, setNormal] = useState<any>(false);
//   const [cler,setcler]=useState<any>(false);

//   return (
//     <nav className="navbar">
//       <div className="navbar-logo">📝 ToDoApp</div>

//       <ul className="navbar-links">
//         <li><Link to="/">Home</Link></li>
//         <li><Link to="/create">create</Link></li>
//         <li><Link to="/dahboard">Dashboard</Link></li>
//       </ul>

//       <div className="navbar-auth">
//         {/* {isSignedIn ? (
//           <UserButton afterSignOutUrl="/" />
//         ) : (
//           <>
//             <SignInButton mode="modal">
//               <button className="btn">Login</button>
//             </SignInButton>
//             <SignUpButton mode="modal">
//               <button className="btn btn-outline">Signup</button>
//             </SignUpButton>
//           </>
//         )} */

//                {
//   normal ? (
//     <div><button>Logout</button></div> // Normal logout
//   ) : cler ? (
//     <div><button>Clerk Logout</button></div> // Clerk logout
//   ) : (
//     <ul>
//       <li><Link to="/signin">Signin</Link></li>
//       <li><Link to="/signup">Signup</Link></li>
//     </ul>
//   )
// }

       

        
//         }

//       </div>
//     </nav>
//   );
// };

// export default Navbar;



// import {
//   SignInButton,
//   SignUpButton,
//   UserButton,
//   useUser,
// } from '@clerk/clerk-react';
// import { Link } from 'react-router-dom';
// import './Nabar.css';
// import { useState } from 'react';

// const Navbar = () => {
//   const { isSignedIn } = useUser();
//   const [normal, setNormal] = useState(false);
//   const [cler, setCler] = useState(false);

//   const showNormalLogout = normal;
//   const showClerkLogout = cler || isSignedIn;

//   return (
//     <nav className="navbar">
//       <div className="navbar-logo">📝 ToDoApp</div>

//       <ul className="navbar-links">
//         <li><Link to="/">Home</Link></li>
//         <li><Link to="/create">Create</Link></li>
//         <li><Link to="/dashboard">Dashboard</Link></li>
//       </ul>

//       <div className="navbar-auth">
//         {showNormalLogout ? (
//           <button className="btn" onClick={() => setNormal(false)}>Logout</button>
//         ) : showClerkLogout ? (
//           <UserButton afterSignOutUrl="/" />
//         ) : (
//           <>
//             <Link to="/signin">
//               <button className="btn">Login</button>
//             </Link>
//             <Link to="/signup">
//               <button className="btn btn-outline">Signup</button>
//             </Link>
//           </>
//         )}
//       </div>
//     </nav>
//   );
// };

// export default Navbar;



import {
  // SignInButton,
  // SignUpButton,
  UserButton,
  useUser,
} from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import './Nabar.css';
import ThemeSwitcher from './ThemeSwitcher';
import { Logout } from '../services/Apl';
import "../theme.css";
type NavbarProps = {
  normal: boolean;
  setNormal: (value: boolean) => void;
  cler: boolean;
  setCler: (value: boolean) => void;
};

const Navbar = ({ normal, setNormal, cler }: NavbarProps) => {
  const { isSignedIn } = useUser();
const navigate=useNavigate();
  const showNormalLogout = normal;
  const showClerkLogout = cler || isSignedIn;

  const handler=()=>{
// let data:any=handleLogout();
let data:any=Logout();
//remove 
localStorage.removeItem("email");
if(data){
  setNormal(false);
}
  navigate('/');
  }
  return (
    <nav className="navbar">
      <div className="navbar-logo">📝 ToDoApp</div>

<ThemeSwitcher/>
      <ul className="navbar-links">
        
        <li><Link to="/">Home</Link></li>
        {/* <li><Link to="/create/:workspaceId">Create</Link></li> */}
        {/* <li><Link to="/dashboard/:workspaceId">Dashboard</Link></li> */}
        {/* <li><Link to="/shared/:workspaceId">Shared</Link></li>
        <li><Link to="/notification/:workspaceId">Notification</Link></li>
        <li><Link to="/history/:workspaceId">History</Link></li>
        <li><Link to="/archiev/:workspaceId">Archiev</Link></li> */}

      </ul>

      <div className="navbar-auth">
        {showNormalLogout ? (
          <button className="btn" onClick={() =>handler()}>Logout</button>
        ) : showClerkLogout ? (
          <UserButton afterSignOutUrl="/" />
        ) : (
          <>
            <Link to="/signup">
              <button className="btn">Signup</button>
            </Link>
            <Link to="/signin">
              <button className="btn btn-outline">Login</button>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
