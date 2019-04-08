import React, { Component } from "react";
import { TimePicker } from "antd";
import "antd/dist/antd.css";
import moment from "moment";
import SimpleReactValidator from "simple-react-validator";
import MapComponent from "./Map";

class PreferencesComponent extends Component {
  constructor(props) {
    super(props);
    this.validator = new SimpleReactValidator({
      element: message => <div style={{ color: "red" }}>{message}</div>,
      messages: {
        required: "Campo obligatorio",
        size: "Debes seleccionar al menos 1 categoría"
      }
    });
    this.myRef = React.createRef();
  }

  state = {
    categories: [],
    totalDays: null,
    startDate: null,
    travelSchedule: {
      start: "0900",
      end: "1800"
    },
    lunchTime: {
      start: "1300",
      end: "1400"
    }
  };

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
        <form className="form-horizontal center_form" onSubmit={this.submit}>
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
                value={this.state.totalDays}
                onChange={this.handleDays}
              />
              {this.validator.message(
                "totalDays",
                this.state.totalDays,
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
                onChange={this.handleStartDate}
                min={moment()
                  .add(1, "d")
                  .format("YYYY-MM-DD")}
              />
              {this.validator.message(
                "startDate",
                this.state.startDate,
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
            wtf={this.state.travelSchedule}
          />

          <Schedule
            title="Hora deseada de almuerzo"
            scheduleType="lunchTime"
            start="13:00"
            end="14:00"
            onTimeChange={this.onTimeChange}
            validator={this.validator}
            wtf={this.state.lunchTime}
          />

          <h5>Selecciona los sitios que te gustaría visitar:</h5>
          {this.validator.message(
            "categories",
            this.state.categories,
            "size:1"
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
          <button
            type="submit"
            className="btn btn-primary btn-block"
            ref={this.myRef}
          >
            Siguiente
          </button>
        </form>
      </div>
    );
  }
  submit = e => {
    e.preventDefault();
    if (this.validator.allValid()) {
      alert("You submitted the form and stuff!");
    } else {
      this.validator.showMessages();
      this.myRef.current.disabled = false;
      this.forceUpdate();
    }
  };

  handleSelectCategory = e => {
    const { checked, value } = e.target;

    if (checked) {
      this.setState(prevState => ({
        categories: [...prevState.categories, value]
      }));
    } else {
      this.setState(prevState => ({
        categories: prevState.categories.filter(v => v !== value)
      }));
    }
  };

  handleDays = e => {
    const new_number = Number(e.target.value);

    this.setState({
      totalDays: new_number > 0 ? new_number : 1
    });
  };

  handleStartDate = e => {
    this.setState({
      startDate: e.target.value
    });
  };

  onTimeChange = (ev, scheduleType, time) => {
    this.setState(prevState => ({
      [`${scheduleType}`]: {
        ...prevState[`${scheduleType}`],
        [`${time}`]: ev === null ? ev : ev.format("HHmm")
      }
    }));
  };
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

export default PreferencesComponent;
