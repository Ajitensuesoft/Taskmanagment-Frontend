
import { SignIn } from '@clerk/clerk-react';

const Clerkin = () => {
  return (
    <div style={styles.container}>
     <SignIn
        path="/clerk"
        routing="path"
        redirectUrl="/dashboard"
        signUpUrl="/clerkSignup" // 👈 custom route for SignUp
      />
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
  },
};

export default Clerkin;
