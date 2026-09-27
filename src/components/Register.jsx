import { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { ArrowLeft, ImagePlus, LoaderCircle, UserRound, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useRegister } from '../shared/hooks/useRegister';
import { validateEmail, validateEmailMessage, validateName, validateNameMessage, validatePassword, validatePasswordMessage, validateSurname, validateSurnameMessage } from '../shared/validators';
import './AuthControls.css';

const initialFormState = {
  name: { value: '', isValid: false, showError: false },
  surname: { value: '', isValid: false, showError: false },
  email: { value: '', isValid: false, showError: false },
  password: { value: '', isValid: false, showError: false },
  profilePicture: { value: null, isValid: true, showError: false },
};

export const Register = ({ switchAuthHandler }) => {
  const navigate = useNavigate();
  const { registerUser, isLoading } = useRegister();
  const fileInputRef = useRef(null);
  const [formState, setFormState] = useState(initialFormState);
  const [previewImage, setPreviewImage] = useState(null);
  const validators = { name: validateName, surname: validateSurname, email: validateEmail, password: (value) => validatePassword(value).isValid };
  const messages = { name: validateNameMessage, surname: validateSurnameMessage, email: validateEmailMessage, password: validatePasswordMessage };

  const updateField = (field, value) => setFormState((previous) => ({ ...previous, [field]: { ...previous[field], value, showError: false } }));
  const handleBlur = (field) => setFormState((previous) => { const isValid = validators[field](previous[field].value); return { ...previous, [field]: { ...previous[field], isValid, showError: !isValid } }; });

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const isValid = ['image/jpeg', 'image/png', 'image/jpg'].includes(file.type) && file.size <= 5 * 1024 * 1024;
    setFormState((previous) => ({ ...previous, profilePicture: { ...previous.profilePicture, value: isValid ? file : null, showError: !isValid } }));
    if (isValid) setPreviewImage(URL.createObjectURL(file));
  };

  const removeImage = () => { updateField('profilePicture', null); setPreviewImage(null); if (fileInputRef.current) fileInputRef.current.value = ''; };

  const handleRegister = async (event) => {
    event.preventDefault();
    const requiredFields = ['name', 'surname', 'email', 'password'];
    const nextState = { ...formState };
    let isValid = true;
    requiredFields.forEach((field) => { const fieldIsValid = validators[field](formState[field].value); nextState[field] = { ...nextState[field], isValid: fieldIsValid, showError: !fieldIsValid }; if (!fieldIsValid) isValid = false; });
    setFormState(nextState);
    if (!isValid || isLoading) return;
    await registerUser({ name: formState.name.value.trim(), surname: formState.surname.value.trim(), email: formState.email.value.trim(), password: formState.password.value, profilePicture: formState.profilePicture.value });
  };

  return (
    <main className='auth-page'>
      <section className='auth-panel'>
        <div className='auth-intro'><span className='eyebrow'>Empieza hoy</span><h1>Haz espacio para tus metas.</h1><p>Registra tu cuenta y comienza a darle una dirección concreta a tu ahorro.</p><div className='auth-mark'><UserRound size={20} aria-hidden='true' /></div></div>
        <form className='auth-form' onSubmit={handleRegister} noValidate>
          <div className='form-heading'><div><h2>Crear cuenta</h2><p>Completa tus datos para continuar.</p></div><button className='back-home-button' type='button' onClick={() => navigate('/')}><ArrowLeft size={15} aria-hidden='true' /> Regresar al inicio</button></div>
          <div className='form-grid'>
            {['name', 'surname'].map((field) => <label className='field-label' key={field}>{field === 'name' ? 'Nombre' : 'Apellido'}<input type='text' value={formState[field].value} onChange={(event) => updateField(field, event.target.value)} onBlur={() => handleBlur(field)} aria-invalid={formState[field].showError} autoComplete={field === 'name' ? 'given-name' : 'family-name'} />{formState[field].showError && <span className='field-error'>{messages[field]}</span>}</label>)}
          </div>
          <label className='field-label'>Correo electrónico<input type='email' value={formState.email.value} onChange={(event) => updateField('email', event.target.value)} onBlur={() => handleBlur('email')} aria-invalid={formState.email.showError} autoComplete='email' />{formState.email.showError && <span className='field-error'>{messages.email}</span>}</label>
          <label className='field-label'>Contraseña<input type='password' value={formState.password.value} onChange={(event) => updateField('password', event.target.value)} onBlur={() => handleBlur('password')} aria-invalid={formState.password.showError} autoComplete='new-password' />{formState.password.showError && <span className='field-error'>{messages.password}</span>}</label>
          <div className='upload-row'><div className='avatar-preview'>{previewImage ? <img src={previewImage} alt='Vista previa de perfil' /> : <UserRound size={24} aria-hidden='true' />}</div><div><strong>Foto de perfil <span>(opcional)</span></strong><p>JPG o PNG, máximo 5 MB.</p><button className='upload-button' type='button' onClick={() => fileInputRef.current?.click()}><ImagePlus size={16} aria-hidden='true' /> Elegir imagen</button><input ref={fileInputRef} className='visually-hidden' type='file' accept='image/jpeg,image/png' onChange={handleFileChange} />{previewImage && <button className='remove-image' type='button' onClick={removeImage}><X size={15} aria-hidden='true' /> Quitar</button>}{formState.profilePicture.showError && <span className='field-error'>Selecciona una imagen válida de máximo 5 MB.</span>}</div></div>
          <button className='submit-button' type='submit' disabled={isLoading}>{isLoading ? <><LoaderCircle className='spin' size={18} aria-hidden='true' /> Creando cuenta...</> : 'Crear mi cuenta'}</button>
          <p className='auth-switch'>¿Ya tienes una cuenta? <button type='button' onClick={switchAuthHandler}>Inicia sesión</button></p>
        </form>
      </section>
    </main>
  );
};

Register.propTypes = { switchAuthHandler: PropTypes.func.isRequired };
