import ControllersView from "../components/ControllersView"
import Router from "next/router"
import { Component } from "react"
import _ from "lodash"


export default class ControllersContainer extends Component {

  constructor(props) {
    super(props)
    this.state = {
      selectedController: props.selected
    }
  }

  handleSelectController(controller) {
    this.setState({ selectedController: controller })
    let path = {
      pathname: Router.pathname,
      query: _.extend({}, Router.query, { controller })
    }
    let as = `/node/${Router.query.id}?controller=${controller}`
    Router.push(path, as, { shallow: true })
  }

  render = () => (
    <ControllersView
      controllers={this.props.controllers}
      selectedController={this.state.selectedController}
      select={this.handleSelectController.bind(this)} />
  )

}
