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
import './App.css';

//Redux
//Connect app with store
import { Provider } from 'react-redux';
import store from './store';

const routes = [
  { path: 'register', component: Register },
  { path: 'login', component: Login },
];

const ContainerRoute = ({ component: Component }) => (
  <section className='container'>
    <Component />
  </section>
);

const App = () => (
  <Provider store={store}>
    <Navbar />
    <Alert />
    <Routes>
      <Route path='/' element={<Landing />} />
      {/* Every page has a class of container that will push everything into middle except Landing Page */}
      {routes.map(({ path, component }) => (
        <Route
          key={path}
          path={path}
          element={<ContainerRoute component={component} />}
        />
      ))}
    </Routes>
  </Provider>
);

export default App;
