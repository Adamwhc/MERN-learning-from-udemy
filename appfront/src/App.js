import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Users from './user/pages/Users';
import NewPlace from './places/pages/NewPlace';
import MainNav from './shared/components/Navigation/MainNav';
import UserPlaces from './places/pages/UserPlaces';
import UpdatePlace from './places/pages/UpdatePlace';
import Auth from './user/pages/Auth';
import { AuthContext } from './shared/context/auth-context';
import { useAuth } from './shared/hooks/auth-hook';

const App = () => {
  const { token, login, logout, userId } = useAuth();

  let routes;

  if (token) {
    routes = (
      <Routes>
        <Route path="/" exact element={<Users />} />
        <Route path="/:userId/places" exact element={<UserPlaces />} />
        <Route path="/places/new" exact element={<NewPlace />} />
        <Route path="/places/:placeId" element={<UpdatePlace />} />
        {/* <Navigate to="/" /> */}
      </Routes>
    );
  } else {
    routes = (
      <Routes>
        <Route path="/" exact element={<Users />} />
        <Route path="/:userId/places" element={<UserPlaces />} />
        <Route path='/auth' element={<Auth />} />
        {/* <Navigate to='/auth' /> */}
      </Routes>
    );
  }

  return (
    <AuthContext.Provider 
      value={{ 
        isLoggedIn: !!token, 
        token: token,
        userId: userId,
        login: login, 
        logout: logout 
      }}
    >
      <Router>
        <MainNav />
          <main>
              {routes}
          </main>
      </Router>
    </AuthContext.Provider>
  );
};

export default App;
