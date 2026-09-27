import { useRoutes } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { routes } from './routes.jsx';

export const App = () => {
  const element = useRoutes(routes);
  
  return (
    <div className='app-shell'>
      {element}
      <Toaster position='top-center' reverseOrder={false} />
    </div>
  );
};