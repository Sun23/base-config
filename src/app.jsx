import React from 'react'
import ReactDOM from 'react-dom'
import Loadable from 'react-loadable'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

import Loading from './component/Loading'

const Page1 = Loadable({
  loader: () => import(
    /* webpackChunkName: "Page1" */
    './page/Page1',
  ),
  loading: Loading,
})

const Page2 = Loadable({
  loader: () => import(
    /* webpackChunkName: "Page2" */
    './page/Page2',
  ),
  loading: Loading,
})

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
