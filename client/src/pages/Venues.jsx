import { Navigate } from 'react-router-dom';

/** Legacy route — redirects to /halls */
function Venues() {
  return <Navigate to="/halls" replace />;
}

export default Venues;
