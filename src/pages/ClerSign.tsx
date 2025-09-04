
import { SignUp } from '@clerk/clerk-react';

const ClerSign = () => {
  return (
    <div style={styles.container}>
      <SignUp path="/clerkSignup" routing="path" redirectUrl="/dashboard" />
      
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

export default ClerSign;
