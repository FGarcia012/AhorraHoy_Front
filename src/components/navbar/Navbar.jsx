import { useEffect, useRef, useState } from 'react';
import { BarChart3, BriefcaseBusiness, ChevronDown, CreditCard, History, LogIn, LogOut, Menu, UserRound, Wallet, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../contexts/userContext.js';
import { getProfilePictureUrl } from '../../utils/files.js';
import './Navbar.css';

export const Navbar = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useUser();
  const menuRef = useRef(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleOutsideClick = (event) => { if (menuRef.current && !menuRef.current.contains(event.target)) setIsMenuOpen(false); };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const goTo = (path) => { setIsMenuOpen(false); navigate(path); };
  const handleLogout = () => { logout(); setIsMenuOpen(false); navigate('/', { replace: true }); };
  const displayName = user?.name || 'Mi perfil';

  return (
    <header className='navbar'>
      <div className='navbar-container'>
        <button className='navbar-brand' type='button' onClick={() => goTo('/')} aria-label='Ir al inicio'>
          <span className='brand-mark'>FG</span><span className='navbar-title'>ahorra<span>Hoy</span></span>
        </button>
        <nav className='navbar-nav' aria-label='Navegación principal'>
          <button type='button' className='nav-link active' onClick={() => goTo('/')}>Inicio</button>
          <button type='button' className='nav-link' onClick={() => document.getElementById('beneficios')?.scrollIntoView({ behavior: 'smooth' })}>Cómo funciona</button>
        </nav>
        <div className='navbar-actions' ref={menuRef}>
          {isAuthenticated ? <>
            <button className='profile-trigger' type='button' onClick={() => setIsMenuOpen((open) => !open)} aria-expanded={isMenuOpen}><span className='profile-avatar'>{user?.profilePicture ? <img src={getProfilePictureUrl(user.profilePicture)} alt='' /> : <UserRound size={17} aria-hidden='true' />}</span><span>{displayName}</span><ChevronDown size={16} className={isMenuOpen ? 'rotate-icon' : ''} aria-hidden='true' /></button>
            {isMenuOpen && <div className='profile-menu'><button type='button' onClick={() => goTo('/profile')}><UserRound size={16} aria-hidden='true' /> Mi perfil</button><button type='button' onClick={() => goTo('/goal')}><UserRound size={16} aria-hidden='true' /> Mi espacio</button><button type='button' onClick={() => goTo('/goals')}><UserRound size={16} aria-hidden='true' /> Mis metas</button><button type='button' onClick={() => goTo('/transactions')}><History size={16} aria-hidden='true' /> Transacciones</button><button type='button' onClick={() => goTo('/financial')}><BriefcaseBusiness size={16} aria-hidden='true' /> Situación financiera</button><button type='button' onClick={() => goTo('/income')}><Wallet size={16} aria-hidden='true' /> Ingresos</button><button type='button' onClick={() => goTo('/expenses')}><CreditCard size={16} aria-hidden='true' /> Gastos</button><button type='button' onClick={() => goTo('/statistics')}><BarChart3 size={16} aria-hidden='true' /> Estadísticas</button><button type='button' onClick={handleLogout} className='logout-action'><LogOut size={16} aria-hidden='true' /> Cerrar sesión</button></div>}
          </> : <><button className='login-link' type='button' onClick={() => goTo('/auth')}><LogIn size={16} aria-hidden='true' /> Iniciar sesión</button><button className='signup-link' type='button' onClick={() => goTo('/register')}>Crear cuenta</button></>}
          <button className='mobile-menu-button' type='button' onClick={() => setIsMenuOpen((open) => !open)} aria-label={isMenuOpen ? 'Cerrar menú' : 'Abrir menú'}>{isMenuOpen ? <X size={22} /> : <Menu size={22} />}</button>
        </div>
      </div>
    </header>
  );
};