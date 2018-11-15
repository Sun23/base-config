import React from 'react'
import { Link } from 'react-router-dom'

class Page1 extends React.Component {
  constructor(props) {
    super(props)
    console.log(props)
  }

  render() {
    return (
      <div>
        <Link to="/page2">to page2</Link>
      </div>
    )
  }
}

export default Page1
