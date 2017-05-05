import { Component } from "react"
import Router from "next/router"
import _ from "lodash"

import Layout from "../components/Layout"
import RefreshIndicator from "material-ui/RefreshIndicator"

export default class LayoutContainer extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedItem: Router.router && `${Router.pathname}/${Router.query.id}`,
      loading: false
    }
  }

  componentWillMount() {
    Router.onRouteChangeStart = () => this.setState({loading: true})
    Router.onRouteChangeComplete = () => this.setState({loading: false})
  }

  componentWillUnmount() {
    Router.onRouteChangeStart = null
    Router.onRouteChangeComplete = null
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
      {..._.omit(this.props, "children")}>

      {this.state.loading ?
        <RefreshIndicator size={60} left={200} top={100} status="loading" />
        : this.props.children}

    </Layout>
  )
}
