import { Component } from "react"
import Router from "next/router"

import Layout from "../components/Layout"


export default class LayoutContainer extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedItem: Router.router && `${Router.pathname}/${Router.query.id}`
    }
  }

  render = () => (
    <Layout
      handleSelectNode={node => {
        let nodename = node.match(/\/node\/(\S+)/)[1]
        Router.push({
          pathname: "/node",
          query: { id: nodename },
        }, node)
      }}
      {...this.props}
    />
  )
}
