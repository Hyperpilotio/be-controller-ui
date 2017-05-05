import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn
} from "material-ui/Table"

import _ from "lodash"


export default ({settings, omit}) => (
  <Table>
    <TableHeader adjustForCheckbox={false} displaySelectAll={false}>
      <TableRow>
        <TableHeaderColumn>Option</TableHeaderColumn>
        <TableHeaderColumn>Value</TableHeaderColumn>
      </TableRow>
    </TableHeader>
    <TableBody displayRowCheckbox={false}>
      {_.map(
        _.omit(settings, omit),
        (val, key) => (
          <TableRow key={key}>
            <TableRowColumn>{key}</TableRowColumn>
            <TableRowColumn>{_.toString(val)}</TableRowColumn>
          </TableRow>
        )
      )}
    </TableBody>
  </Table>
)
