import { useState } from 'react';
import PropTypes from 'prop-types';
import { LoaderCircle, LogIn } from 'lucide-react';
import { useLogin } from '../shared/hooks/useLogin';
import { validateEmail } from '../shared/validators';

export const Login = ({ switchAuthHandler }) => {
  const { loginUser, isLoading } = useLogin();
  const [emailOrName, setEmailOrName] = useState('');
  const [password, setPassword] = useState('');
  const [showError, setShowError] = useState(false);

  const handleLogin = async (event) => {
    event.preventDefault();
    if (!emailOrName.trim() || !password) { setShowError(true); return; }
    setShowError(false);
    await loginUser(validateEmail(emailOrName.trim()) ? { email: emailOrName.trim(), password } : { name: emailOrName.trim(), password });
  };

  return (
    <main className='auth-page'>
      <section className='auth-panel auth-panel-login'>
        <div className='auth-intro'><span className='eyebrow'>Qué bueno verte</span><h1>Tu próximo paso empieza aquí.</h1><p>Entra a tu espacio y sigue construyendo las metas que importan.</p><div className='auth-mark'><LogIn size={20} aria-hidden='true' /></div></div>
        <form className='auth-form' onSubmit={handleLogin} noValidate>
          <div className='form-heading'><h2>Iniciar sesión</h2><p>Usa tu correo o nombre.</p></div>
          <label className='field-label'>Correo o nombre<input type='text' value={emailOrName} onChange={(event) => { setEmailOrName(event.target.value); setShowError(false); }} autoComplete='name' aria-invalid={showError} />{showError && <span className='field-error'>Ingresa tu correo o nombre.</span>}</label>
          <label className='field-label'>Contraseña<input type='password' value={password} onChange={(event) => { setPassword(event.target.value); setShowError(false); }} autoComplete='current-password' aria-invalid={showError} />{showError && <span className='field-error'>Ingresa tu contraseña.</span>}</label>
          <button className='submit-button' type='submit' disabled={isLoading}>{isLoading ? <><LoaderCircle className='spin' size={18} aria-hidden='true' /> Iniciando sesión...</> : 'Iniciar sesión'}</button>
          <p className='auth-switch'>¿Todavía no tienes una cuenta? <button type='button' onClick={switchAuthHandler}>Regístrate</button></p>
        </form>
      </section>
    </main>
  );
};

Login.propTypes = { switchAuthHandler: PropTypes.func.isRequired };
