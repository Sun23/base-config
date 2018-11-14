import React from 'react'
import { Link } from 'react-router-dom'

class Page2 extends React.Component {
  constructor(props) {
    super(props)
    console.log(props)
  }

  render() {
    return (
      <div>
        <Link to="/">to page1</Link>
      </div>
    )
  }
}

export default Page2
