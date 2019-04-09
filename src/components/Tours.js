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
        .post("/test", this.props.request)
        .then(response => {
          this.setState({ loading: false });
          console.log("OK",response);
          this.props.setFetchedData(response.data);
        })
        .catch(err => {
          this.setState({ loading: false });
          console.log("ERROR",err);
        });
    }
  }

  render() {
    return (
      <>
        {this.state.loading ? (
          <div className="override">
            <Loader type="CradleLoader" />
          </div>
        ) : (
          <div className="container center_form">
            <h1>Recomendaciones</h1>
            <div className="form-group">
              <label htmlFor="toursSelect">Selecciona el tour:</label>
              <select
                className="form-control"
                id="toursSelect"
                onChange={this.handleSelected}
              >
                <option defaultValue={-1} value={-1}>
                  Todos
                </option>
                {this.props.data.map((_, i) => (
                  <option key={i} value={i}>
                    Tour {i + 1}
                  </option>
                ))}
              </select>
            </div>
            {this.state.selected === -1 ? (
              <MultipleRoutesMap data={this.props.data} />
            ) : (
              <SingleRouteMap
                {...this.props.data[this.state.selected]}
                n={this.state.selected}
              />
            )}
          </div>
        )}
      </>
    );
  }

  handleSelected = ev => {
    console.log(ev.target.value);
    this.setState({ selected: Number(ev.target.value) });
  };
}

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
