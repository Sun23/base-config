import React from 'react'
import ReactDOM from 'react-dom'
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom'

import Page1 from 'Page/Page1'
import Page2 from 'Page/Page2'

const Index = () => <Router>
  <Switch>
    <Route path="/" component={Page1} exact />
    <Route path="/page2" component={Page2} />
  </Switch>
</Router>

ReactDOM.render(<Index />, document.getElementById('root'))
