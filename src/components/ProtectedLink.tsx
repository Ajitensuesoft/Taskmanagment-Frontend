// src/components/ProtectedLink.tsx
import { useUser, RedirectToSignIn } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';

type Props = {
  to: string;
  children: React.ReactNode;
};

const ProtectedLink = ({ to, children }: Props) => {
  const { isSignedIn } = useUser();
  const navigate = useNavigate();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isSignedIn) {
      navigate(to);
    } else {
      RedirectToSignIn({ redirectUrl: to });
    }
  };

  return (
    <a href={to} onClick={handleClick}>
      {children}
    </a>
  );
};

export default ProtectedLink;
