import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Orders from './pages/Orders';
import Menu from './pages/Menu';
import Analytics from './pages/Analytics';

function App() {
  return (
    <Router>
      <div className="container mx-auto">
        <nav className="flex space-x-4 mb-4">
          <a href="/orders" className="text-blue-500">Заказы</a>
          <a href="/menu" className="text-blue-500">Меню</a>
          <a href="/analytics" className="text-blue-500">Аналитика</a>
        </nav>
        <Switch>
          <Route path="/orders" component={Orders} />
          <Route path="/menu" component={Menu} />
          <Route path="/analytics" component={Analytics} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;