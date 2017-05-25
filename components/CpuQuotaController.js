import Dygraph, { WithSyncedDygraphs } from "./Dygraph"
import Subheader from "material-ui/Subheader"
import { grey500, fullWhite } from "material-ui/styles/colors"
import { Container, Row } from "react-grid-system"
import _ from "lodash"


let stylesheet = {
  subHeader: {
    color: fullWhite,
    background: grey500,
    fontSize: 18
  },
  graphContainer: {
    marginLeft: -20,
    marginTop: 20
  }
}

export default class CpuQuotaController extends WithSyncedDygraphs {
  render = () => (
    <Container fluid={true}>
      <Row>
        <Subheader style={stylesheet.subHeader}>CPU QUOTA CONTROLLER</Subheader>
      </Row>
      <Row>
        <Dygraph
          style={stylesheet.graphContainer}
          ref="graph.usage"
          data={_.get(this.props.data, 0, [])}
          title="CPU Utilization %"
          labels={["x", "HP", "BE", "Total"]} />
      </Row>
      <Row>
        <Dygraph
          style={stylesheet.graphContainer}
          ref="graph.be_quota"
          data={_.get(this.props.data, 1, [])}
          title="BE CPU Quota"
          labels={["x", "quota", "action"]}
          axes={{
            x: {
              valueFormatter: function (ts) {
                let action = [
                  "none",
                  "disable_be",
                  "reset_be",
                  "shrink_be",
                  "enable_be",
                  "grow_be"
                ][this.getValue(this.getRowForX(ts), 2)]

                let d = new Date(ts)
                let timeStrs = ["getHours", "getMinutes", "getSeconds"]
                  .map( f => _.padStart(d[f](), 2, "0") )

                return `${_.join(timeStrs, ":")} ( <b>${action}</b> )`
              }
            }
          }}
          visibility={[ true, false ]} />
      </Row>
    </Container>
  )
}
