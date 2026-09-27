import { AlertTriangle, X } from 'lucide-react';
import PropTypes from 'prop-types';

export const ConfirmDialog = ({ open, title, message, confirmLabel, onConfirm, onCancel, isBusy }) => {
  if (!open) return null;
  return <div className='confirm-backdrop' role='presentation' onMouseDown={(event) => { if (event.target === event.currentTarget) onCancel(); }}><section className='confirm-dialog' role='alertdialog' aria-modal='true' aria-labelledby='confirm-dialog-title' aria-describedby='confirm-dialog-message'><button className='confirm-close' type='button' onClick={onCancel} aria-label='Cerrar confirmación'><X size={18} aria-hidden='true' /></button><div className='confirm-icon'><AlertTriangle size={22} aria-hidden='true' /></div><h2 id='confirm-dialog-title'>{title}</h2><p id='confirm-dialog-message'>{message}</p><div className='confirm-actions'><button className='goal-secondary-button' type='button' onClick={onCancel} disabled={isBusy}>Cancelar</button><button className='confirm-danger-button' type='button' onClick={onConfirm} disabled={isBusy}>{isBusy ? 'Procesando...' : confirmLabel}</button></div></section></div>;
};

ConfirmDialog.propTypes = { open: PropTypes.bool, title: PropTypes.string.isRequired, message: PropTypes.string.isRequired, confirmLabel: PropTypes.string, onConfirm: PropTypes.func.isRequired, onCancel: PropTypes.func.isRequired, isBusy: PropTypes.bool };
ConfirmDialog.defaultProps = { open: false, confirmLabel: 'Confirmar', isBusy: false };
