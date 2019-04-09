import React, { Component } from "react";
import { TimePicker } from "antd";
import "antd/dist/antd.css";
import moment from "moment";
import SimpleReactValidator from "simple-react-validator";
import { connect } from "react-redux";
import {
  setDaysAction,
  setLocationAction,
  setStartDateAction,
  setTimeAction,
  updateCategoriesAction
} from "../redux/actions";
import { SearchMapComponent } from "./SearchMap";
import {withRouter} from "react-router-dom"

class PreferencesFormComponent extends Component {
  constructor(props) {
    super(props);
    this.validator = new SimpleReactValidator({
      element: message => <div style={{ color: "red" }}>{message}</div>,
      messages: {
        required: "Campo obligatorio",
        min: "Debes seleccionar al menos 1 categoría"
      }
    });
  }

  render() {
    const preferences_options = [
      { text: "Museos", value: "museum" },
      { text: "Acuarios", value: "aquarium" },
      { text: "Exposiciones de arte", value: "art_gallery" },
      { text: "Parques de diversiones", value: "amusement_park" },
      { text: "Cementerios", value: "cemetery" },
      { text: "Iglesias", value: "church" },
      { text: "Palacios presidenciales", value: "city_hall" },
      { text: "Templos hindús", value: "hindu_temple" },
      { text: "Mezquitas", value: "mosque" },
      { text: "Parques", value: "park" },
      { text: "Estadios", value: "stadium" },
      { text: "Zoológicos", value: "zoo" }
    ];

    return (
      <div className="container ">
        <form className="form-horizontal center_form" onSubmit={this.handleSubmit}>
          <h1> Preferencias Turísticas</h1>

          <div className="form-group row">
            <label htmlFor="totalDays" className="col-sm-4 col-form-label">
              <h5>Días de recorrido</h5>
            </label>
            <div className="col-sm-2">
              <input
                type="number"
                className="form-control"
                id="totalDays"
                min={1}
                value={this.props.request.totalDays}
                onChange={this.handleDays}
              />
              {this.validator.message(
                "totalDays",
                this.props.request.totalDays,
                "required"
              )}
            </div>
            <div className="col-sm-6" />
          </div>

          <div className="form-group row">
            <label htmlFor="startDate" className="col-sm-4 col-form-label">
              <h5>Fecha de inicio</h5>
            </label>
            <div className="col-sm-4">
              <input
                type="date"
                className="form-control"
                id="startDate"
                onChange={ev => this.props.setStartDate(ev.target.value)}
                min={moment()
                  .add(1, "d")
                  .format("YYYY-MM-DD")}
              />
              {this.validator.message(
                "startDate",
                this.props.request.startDate,
                "required"
              )}
            </div>
            <div className="col-sm-4" />
          </div>

          <Schedule
            title="Horario deseado de los tours"
            scheduleType="travelSchedule"
            start="09:00"
            end="18:00"
            onTimeChange={this.onTimeChange}
            validator={this.validator}
            wtf={this.props.request.travelSchedule}
          />

          <Schedule
            title="Hora deseada de almuerzo"
            scheduleType="lunchTime"
            start="13:00"
            end="14:00"
            onTimeChange={this.onTimeChange}
            validator={this.validator}
            wtf={this.props.request.lunchTime}
          />

          <h5>Selecciona los sitios que te gustaría visitar:</h5>
          {this.validator.message(
            "categories",
            this.props.request.categories,
            "min:1"
          )}
          <div className="row">
            <div className="col-1" />
            <div className="row col-10">
              {preferences_options.map((option, index) => (
                <div
                  key={`wtf${index}`}
                  className="col-4 custom-control custom-checkbox"
                >
                  <input
                    id={`check${index}`}
                    type="checkbox"
                    className="custom-control-input"
                    value={option.value}
                    onChange={this.handleSelectCategory}
                  />
                  <label
                    htmlFor={`check${index}`}
                    className="custom-control-label"
                    style={{ cursor: "pointer" }}
                  >
                    {option.text}
                  </label>
                </div>
              ))}
            </div>
            <div className="col-1" />
          </div>
          <h5>Selecciona tu lugar de hospedaje</h5>
          {this.validator.message(
            "location",
            this.props.request.location,
            "required"
          )}
          <SearchMapComponent setLocation={this.props.setLocation} />
          <button
            type="submit"
            className="btn btn-primary btn-block"
          >
            Siguiente
          </button>
          <br />
          <br />
        </form>
      </div>
    );
  }
  handleSubmit = e => {
    e.preventDefault();
    if (this.validator.allValid()) {
      this.props.history.push('/tours');
    } else {
      this.validator.showMessages();
      this.forceUpdate();
    }
  };

  handleSelectCategory = e => {
    const { checked, value } = e.target;

    if (checked) {
      this.props.updateCategories([...this.props.request.categories, value]);
    } else {
      this.props.updateCategories(
        this.props.request.categories.filter(v => v !== value)
      );
    }
  };

  handleDays = e => {
    const new_number = Number(e.target.value);
    this.props.setDays(new_number > 0 ? new_number : 1);
  };

  onTimeChange = (ev, scheduleType, time) =>
    this.props.setTime(
      scheduleType,
      time,
      ev === null ? ev : ev.format("HHmm")
    );
}

const Schedule = ({
  title,
  scheduleType,
  start,
  end,
  onTimeChange,
  wtf,
  validator
}) => (
  <>
    <h5>{title}</h5>
    <div className="form-inline">
      <div className="col-1" />
      <LabelTimePicker
        className="col-12 col-lg-4 col-md-4"
        labelText="Inicio"
        defaultTime={start}
        onTimeChange={onTimeChange}
        schedule={scheduleType}
        time="start"
        validator={validator}
        wtf={wtf}
      />
      <div className="col-1" />
      <LabelTimePicker
        className="col-12 col-lg-4 col-md-4"
        labelText="Fin"
        defaultTime={end}
        onTimeChange={onTimeChange}
        schedule={scheduleType}
        time="end"
        validator={validator}
        wtf={wtf}
      />
      <div className="col-1" />
    </div>
  </>
);

const LabelTimePicker = ({
  labelText,
  defaultTime,
  onTimeChange,
  schedule,
  time,
  validator,
  wtf
}) => (
  <>
    <div className="form-group mb-2">
      <label
        htmlFor="travelStart"
        className="col-form-label"
        style={{ marginRight: "0.5rem" }}
      >
        {labelText}
      </label>
      <TimePicker
        id="travelStart"
        defaultValue={moment(defaultTime, "HH:mm")}
        format="HH:mm"
        onChange={ev => onTimeChange(ev, schedule, time)}
        placeholder="HH:mm"
      />
      {validator.message(time, wtf[time], "required")}
    </div>
  </>
);

const mapStateToProps = state => ({
  request:{...state}
});

const mapDispatchToProps = dispatch => ({
  setDays: days => dispatch(setDaysAction(days)),
  setStartDate: date => dispatch(setStartDateAction(date)),
  updateCategories: categories => dispatch(updateCategoriesAction(categories)),
  setTime: (type, time, newTime) =>
    dispatch(setTimeAction(type, time, newTime)),
  setLocation: location => dispatch(setLocationAction(location))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(PreferencesFormComponent));
