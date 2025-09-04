// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'
// import './index.css'
// import App from './App.tsx'

// createRoot(document.getElementById('root')!).render(
//   <StrictMode>
//     <App />
//   </StrictMode>,
// )




// import { StrictMode } from 'react'
//   import { createRoot } from 'react-dom/client'
//   import './index.css'
//   import App from './App.tsx'
//   import { ClerkProvider } from '@clerk/clerk-react'
// import { BrowserRouter } from 'react-router-dom';
// import { Provider } from 'react-redux'
// import store from './redux/store.ts'
// import { ThemeProvider } from "./components/ThemeContext";
// import ThemeSwitcher from "./components/ThemeSwitcher";
// import "./themes.css";
//   // Import your Publishable Key
//   const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

//   if (!PUBLISHABLE_KEY) {
//     throw new Error('Add your Clerk Publishable Key to the .env file')
//   }

//   createRoot(document.getElementById('root')!).render(
//     <StrictMode>
//       <ClerkProvider publishableKey={PUBLISHABLE_KEY}   >
//         <BrowserRouter>
//         <Provider store={store}>
//           <ThemeProvider>
// <ThemeSwitcher>
// </ThemeSwitcher>
//         <App />
//           </ThemeProvider>

//         </Provider>
//         </BrowserRouter>
//       </ClerkProvider>
//     </StrictMode>,
//   )




import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { ClerkProvider } from "@clerk/clerk-react";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
// import store from "./redux/store.ts";
import { store } from "./store/store";
import { ThemeProvider } from "./components/ThemeContext";
// import ThemeSwitcher from "./components/ThemeSwitcher";
import "../src/theme.css";

// Import your Publishable Key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Add your Clerk Publishable Key to the .env file");
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <BrowserRouter>
        <Provider store={store}>
          <ThemeProvider>
            {/* ✅ ThemeSwitcher should be a component, not a wrapper */}
            {/* <ThemeSwitcher /> */}
            <App />
          </ThemeProvider>
        </Provider>
      </BrowserRouter>
    </ClerkProvider>
  </StrictMode>
);
