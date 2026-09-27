export const validateProfileForm = ({ name, surname, email }) => {
  const errors = {};
  if (!name.trim()) errors.name = 'Ingresa tu nombre.';
  if (!surname.trim()) errors.surname = 'Ingresa tu apellido.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) errors.email = 'Ingresa un correo electrónico válido.';
  return errors;
};

export const validatePasswordChangeForm = ({ currentPassword, newPassword, confirmPassword }) => {
  const errors = {};
  if (!currentPassword) errors.currentPassword = 'Ingresa tu contraseña actual.';
  if (newPassword.length < 8) errors.newPassword = 'La nueva contraseña debe tener al menos 8 caracteres.';
  if (newPassword !== confirmPassword) errors.confirmPassword = 'Las contraseñas no coinciden.';
  return errors;
};