import toast from 'react-hot-toast';

export const showConfirmToast = ({ title, message, confirmLabel, onConfirm }) => toast.custom((toastItem) => <div className='confirm-toast' role='alertdialog' aria-label={title}><strong>{title}</strong><span>{message}</span><div><button type='button' className='confirm-toast-cancel' onClick={() => toast.dismiss(toastItem.id)}>Cancelar</button><button type='button' className='confirm-toast-confirm' onClick={async () => { await onConfirm(); toast.dismiss(toastItem.id); }}>{confirmLabel}</button></div></div>, { duration: Infinity });
