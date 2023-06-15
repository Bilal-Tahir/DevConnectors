import { useEffect } from 'react';
import {
  // BrowserRouter as Router,
  Routes,
  Route,
} from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Landing from './components/layout/Landing';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import Alert from './components/layout/Alert';
import Dashboard from './components/dashboard/Dashboard';
import CreateProfile from './components/profile-form/CreateProfile';
import EditProfile from './components/profile-form/EditProfile';
import PrivateRoute from './components/routing/PrivateRoute';
import './App.css';

//Redux
//Connect app with store
import { Provider } from 'react-redux';
import { loadUser } from './actions/auth';
import setAuthToken from './utils/setAuthToken';
import store from './store';

if (localStorage.token) {
  setAuthToken(localStorage.token);
}

const routes = [
  { path: '/register', component: Register },
  { path: '/login', component: Login },
  { path: '/dashboard', component: Dashboard, isProtected: true },
  { path: '/create-profile', component: CreateProfile, isProtected: true },
  { path: '/edit-profile', component: EditProfile, isProtected: true },
];

const ContainerRoute = ({ component: Component }) => (
  <section className='container'>
    <Component />
  </section>
);

const App = () => {
  useEffect(() => {
    store.dispatch(loadUser());
  }, []);

  return (
    <Provider store={store}>
      <Navbar />
      <Alert />
      <Routes>
        <Route path='/' element={<Landing />} />
        {/* Every page has a class of container that will push everything into middle except Landing Page */}
        {routes.map(({ path, component, isProtected }) => (
          <>
            <Route
              key={path}
              path={path}
              element={
                <PrivateRoute isProtectedRoute={isProtected}>
                  <ContainerRoute component={component} />
                </PrivateRoute>
              }
            />
          </>
        ))}
      </Routes>
    </Provider>
  );
};

export default App;
