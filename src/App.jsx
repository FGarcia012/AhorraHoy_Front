import { useRoutes } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Routes } from './routes.jsx'

export const App = () => {
  let element = useRoutes(Routes);
  
  return (
    <div>
      {element}
      <Toaster position='top-center' reverseOrder={false} />
    </div>
  );
};