import {Line as LineChart} from "react-chartjs"
import { Container, Row } from "react-grid-system"

export default ({ data }) => {
  let be_bw = data.slice(1).map(r => ({ x: r[0], y: r[1] }))
  let hp_bw = data.slice(1).map(r => ({ x: r[0], y: r[2] }))
  return (
    <Container>
      <Row>
        <LineChart
          data={{
            datasets: [ {label: "be_bw", data: be_bw} ]
          }}
          options={{
            scales: { xAxes: [{type: "time"}] }
          }} />
      </Row>
      <Row>
        <LineChart
          data={{
            datasets: [ {label: "hp_bw", data: hp_bw} ]
          }}
          options={{
            scales: { xAxes: [{type: "time", time: {displayFormats: {second: "HH:mm:ss"}}, unit: "second"}] }
          }} />
      </Row>
    </Container>
  )
}
