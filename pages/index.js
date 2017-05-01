import React, { Component } from "react"
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider"
import RaisedButton from "material-ui/RaisedButton"
import AppBar from "material-ui/AppBar"
import Paper from "material-ui/Paper"
import Subheader from "material-ui/Subheader"
import { Tabs, Tab } from "material-ui/Tabs"
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn
} from "material-ui/Table"
import { Container, Row, Col } from "react-grid-system"
import fetch from "isomorphic-fetch"
import _ from "lodash"
import "../components/tap_event"

let stylesheet = {
  appBar: {
    width: "100%",
    position: "fixed",
    top: 0,
    left: 0
  },
  container: {
    top: "100px"
  },
  nodeRow: {
    marginBottom: "15px"
  }
}


class ControlledNode extends Component {
  constructor(props) {
    super(props)
    this.state = {
      tab: "cpu_quota"
    }
  }

  handleChange(tab) {
    this.setState({ tab })
  }

  render() {
    const fieldsByController = {
      cpu_quota: ["cycle", "qos_app", "action", "slack", "cpu_usage", "hp_shares", "hp_cont", "be_shares", "be_cont"],
      net: ["cycle", "total_bw", "hp_bw", "be_bw"]
    }
    return (
      <Tabs value={this.state.tab} onChange={this.handleChange.bind(this)}>
        {_.map(fieldsByController, (fields, controller) => (
          <Tab key={controller} label={controller} value={controller}>
            <Table height="300px">
              <TableHeader adjustForCheckbox={false} displaySelectAll={false}>
                <TableRow>
                  <TableHeaderColumn>time</TableHeaderColumn>
                  {fields.map(field => <TableHeaderColumn key={field}>{field}</TableHeaderColumn> )}
                </TableRow>
              </TableHeader>
              <TableBody displayRowCheckbox={false}>
                {(this.props.data[controller] || {rows: []}).rows.map(({ time, value }) => (
                  <TableRow key={time}>
                    <TableRowColumn>{time.toString()}</TableRowColumn>
                    {fields.map(field => (
                      <TableRowColumn key={field}>{value[field]}</TableRowColumn>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Tab>
        ))}
      </Tabs>
    )
  }
}

class ControlledCluster extends Component {

  constructor(props) {
    super(props)
    this.state = {
      data: props.data
    }
  }

  async refreshData() {
    let res = await fetch("/apis/controller-log")
    let data = await res.json()
    this.setState({ data })
  }

  render() {
    const byHostname = _.groupBy(this.state.data, "hostname");
    return <Container style={stylesheet.container}>
      {_.map(byHostname, (controllers, hostname) => (
        <Row style={stylesheet.nodeRow} key={hostname}>
          <Col sm={12}>
            <Paper zDepth={2}>
              <Subheader>Node: {hostname}</Subheader>
              <ControlledNode data={_.keyBy(controllers, "controller")} />
            </Paper>
          </Col>
        </Row>
      ))}
    </Container>
  }

}

const App = ({ data }) => (
  <MuiThemeProvider>
    <div>
      <AppBar title="Controller UI" style={stylesheet.appBar} />
      <ControlledCluster data={data} />
    </div>
  </MuiThemeProvider>
)

App.getInitialProps = async ({ req }) => {
  if (req !== undefined) {
    const controllerLogApi = require("../apis/controller-log")
    let context = { body: null };
    await controllerLogApi(context)
    return { data: context.body }
  }
}

export default App
