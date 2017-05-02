import { Component } from "react"
import _ from "lodash"
import { Tabs, Tab } from "material-ui/Tabs"
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn
} from "material-ui/Table"


export default class ControlledNode extends Component {
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
