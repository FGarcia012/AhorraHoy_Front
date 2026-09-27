import { GoogleLogin } from '@react-oauth/google';
import toast from 'react-hot-toast';
import { useGoogleAuth } from '../shared/hooks/useGoogleAuth';

export const GoogleAuthButton = () => {
  const { loginWithGoogle } = useGoogleAuth();

  const handleSuccess = (credentialResponse) => {
    if (!credentialResponse?.credential) {
      toast.error('No se recibió la credencial de Google');
      return;
    }
    loginWithGoogle(credentialResponse.credential);
  };

  const handleError = () => {
    toast.error('No se pudo iniciar sesión con Google');
  };

  return (
    <div className='google-auth-wrapper'>
      <div className='auth-divider'><span>o continúa con</span></div>
      <GoogleLogin onSuccess={handleSuccess} onError={handleError} theme='outline' size='large' width='100%' locale='es' />
    </div>
  );
};