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
      cpu_quota: ["time", "cycle", "qos_app", "action", "slack", "cpu_usage", "hp_shares", "hp_cont", "be_shares", "be_cont"],
      net: ["time", "cycle", "total_bw", "hp_bw", "be_bw"]
    };

    return (
      <Tabs value={this.state.tab} onChange={this.handleChange.bind(this)}>
        {this.props.data.map(({ controller, logs }) => (
          <Tab key={controller} label={controller} value={controller}>
            <Table height="300px">
              <TableHeader adjustForCheckbox={false} displaySelectAll={false}>
                <TableRow>
                  {fieldsByController[controller].map(field => (
                    <TableHeaderColumn key={field}>{field}</TableHeaderColumn>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody displayRowCheckbox={false}>
                {logs.map((row, i) => (
                  <TableRow key={i}>
                    {fieldsByController[controller].map(field => (
                      <TableRowColumn>{_.toString(row[field])}</TableRowColumn>
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
