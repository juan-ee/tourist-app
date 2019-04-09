import React, { Component } from "react";
import "antd/dist/antd.css";
import { connect } from "react-redux";
import Loader from "react-loader-spinner";
import { SingleRouteMap, MultipleRoutesMap } from "./RouteMap";
import axios from "axios";
import { setFetchedDataAction } from "../redux/actions";

class ToursComponent extends Component {
  state = {
    loading: false,
    selected: -1
  };

  componentDidMount() {
    if (this.props.data.length === 0) {
      this.setState({ loading: true });

      axios
        .post("/ttdp", this.props.request)
        .then(response => {
          this.setState({ loading: false });
          this.props.setFetchedData(response.data);
        })
        .catch(err => {
          this.setState({ loading: false });
          alert(err.message);
        });
    }
  }

  toRender = () => {
    if (this.state.selected === -1) {
      return this.props.data.length > 0 ? (
        <MultipleRoutesMap data={this.props.data} />
      ) : null;
    } else
      return (
        <>
          <SingleRouteMap
            {...this.props.data[this.state.selected]}
            n={this.state.selected}
          />
          <br />
          <h5>Detalles</h5>
          <TourDetails tour={this.props.data[this.state.selected].tour} />
        </>
      );
  };

  render() {
    return (
      <>
        {this.state.loading ? (
          <div className="override">
            <Loader type="CradleLoader" />
          </div>
        ) : (
          <div className="container center_form">
            <div className="card" style={{ backgroundColor: "#FDFCF9" }}>
              <h1 className="card-title text-center">Resultados TTDP</h1>
              <div className="card-body">
                <div className="form-group">
                  <label htmlFor="toursSelect">
                    <h5>Selecciona el tour:</h5>
                  </label>
                  <select
                    className="form-control"
                    id="toursSelect"
                    style={{ cursor: "pointer" }}
                    onChange={this.handleSelected}
                  >
                    <option defaultValue={-1} value={-1}>
                      Todos
                    </option>
                    {this.props.data.map((_, i) => (
                      <option key={i} value={i}>
                        Día {i + 1}
                      </option>
                    ))}
                  </select>
                </div>
                {this.toRender()}
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  handleSelected = ev => {
    this.setState({ selected: Number(ev.target.value) });
  };
}

const TourDetails = props => (
  <div>
    <table className="table table-striped">
      <thead className="thead-dark">
        <tr>
          <th scope="col">Horario</th>
          <th scope="col">Evento</th>
        </tr>
      </thead>
      <tbody>
        {props.tour.slice(1).map((elem, i, tour) => {
          switch (elem.type) {
            case "route":
              return (
                <tr>
                  <th scope="row">
                    {elem.schedule.start} - {elem.schedule.end}
                  </th>
                  <td>Salida hacia {tour[i + 1].name}</td>
                </tr>
              );
            case "poi":
              return (
                <tr>
                  <th scope="row">
                    {elem.schedule.start} - {elem.schedule.end}
                  </th>
                  <td>Visita de {elem.name}</td>
                </tr>
              );

            case "lunch":
              return (
                <tr>
                  <th scope="row">
                    {elem.schedule.start} - {elem.schedule.end}
                  </th>
                  <td>Hora de almuerzo</td>
                </tr>
              );

            default:
              return null;
          }
        })}
      </tbody>
    </table>
  </div>
);

const mapStateToProps = state => {
  const { fetchedData, ...request } = state;

  return {
    request,
    data: fetchedData
  };
};

const mapDispatchToProps = dispatch => ({
  setFetchedData: data => dispatch(setFetchedDataAction(data))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ToursComponent);
