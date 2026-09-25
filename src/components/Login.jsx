import { useState } from 'react';
import PropTypes from 'prop-types';
import { ArrowLeft, LoaderCircle, LogIn } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLogin } from '../shared/hooks/useLogin';
import { validateEmail } from '../shared/validators';
import './AuthControls.css';

export const Login = ({ switchAuthHandler }) => {
  const navigate = useNavigate();
  const { loginUser, isLoading } = useLogin();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState({ email: false, password: false });

  const handleLogin = async (event) => {
    event.preventDefault();
    const nextErrors = { email: !validateEmail(email.trim()), password: !password };
    setFieldErrors(nextErrors);
    if (nextErrors.email || nextErrors.password) return;
    await loginUser({ email: email.trim(), password });
  };

  return (
    <main className='auth-page'>
      <section className='auth-panel auth-panel-login'>
        <div className='auth-intro'><span className='eyebrow'>Qué bueno verte</span><h1>Tu próximo paso empieza aquí.</h1><p>Entra a tu espacio y sigue construyendo las metas que importan.</p><div className='auth-mark'><LogIn size={20} aria-hidden='true' /></div></div>
        <form className='auth-form' onSubmit={handleLogin} noValidate>
          <div className='form-heading'><h2>Iniciar sesión</h2><button className='back-home-button' type='button' onClick={() => navigate('/')}><ArrowLeft size={15} aria-hidden='true' /> Regresar al inicio</button></div>
          <label className='field-label'>Correo electrónico<input type='email' value={email} onChange={(event) => { setEmail(event.target.value); setFieldErrors((previous) => ({ ...previous, email: false })); }} autoComplete='email' aria-invalid={fieldErrors.email} />{fieldErrors.email && <span className='field-error'>Ingresa un correo válido.</span>}</label>
          <label className='field-label'>Contraseña<input type='password' value={password} onChange={(event) => { setPassword(event.target.value); setFieldErrors((previous) => ({ ...previous, password: false })); }} autoComplete='current-password' aria-invalid={fieldErrors.password} />{fieldErrors.password && <span className='field-error'>Ingresa tu contraseña.</span>}</label>
          <button className='submit-button' type='submit' disabled={isLoading}>{isLoading ? <><LoaderCircle className='spin' size={18} aria-hidden='true' /> Iniciando sesión...</> : 'Iniciar sesión'}</button>
          <p className='auth-switch'>¿Todavía no tienes una cuenta? <button type='button' onClick={switchAuthHandler}>Regístrate</button></p>
        </form>
      </section>
    </main>
  );
};

Login.propTypes = { switchAuthHandler: PropTypes.func.isRequired };
