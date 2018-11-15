import React from 'react'
import Loadable from 'react-loadable'
import { hot } from 'react-hot-loader'
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

export default hot(module)(App)
