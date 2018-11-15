import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

import Page1 from './page/Page1'
import Page2 from './page/Page2'

const App = () => (
  <div>
    <Router>
      <Switch>
        <Route path="/" component={Page1} exact />
        <Route path="/page2" component={Page2} />
      </Switch>
    </Router>
  </div>
)

ReactDOM.render(<App />, document.getElementById('root'))
