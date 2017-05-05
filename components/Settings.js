import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn
} from "material-ui/Table"
import { Row, Col } from "react-grid-system"

import _ from "lodash"


export default ({settings, omit = [], cols = 1}) => {
  settings = _.omit(settings, omit)
  return <Row>
    {_.range(cols).map(i =>
      <Col md={12 / cols}>
        <Table>
          <TableHeader adjustForCheckbox={false} displaySelectAll={false}>
            <TableRow>
              <TableHeaderColumn>OPTION</TableHeaderColumn>
              <TableHeaderColumn>VALUE</TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody displayRowCheckbox={false}>
            {
              _.filter(
                _.entries(settings),
                (vals, j) => _.includes(_.range(i, _.size(settings), cols), j)
              ).map(([key, val]) =>
                <TableRow key={key}>
                  <TableRowColumn>{key}</TableRowColumn>
                  <TableRowColumn>{_.toString(val)}</TableRowColumn>
                </TableRow>
              )
            }
          </TableBody>
        </Table>
      </Col>
    )}
  </Row>
}
