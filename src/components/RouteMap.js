/* eslint-disable no-undef */
import React from "react";
import { compose, withStateHandlers, withProps } from "recompose";
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
  InfoWindow,
  Polyline
} from "react-google-maps";

const enhance = compose(
  withProps({
    googleMapURL:
      "https://maps.googleapis.com/maps/api/js?key=AIzaSyCKzbdK1wXzCIQf7UAMxpTgV6S5l2AjRGc&v=3.exp&libraries=geometry,drawing,places",
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div style={{ height: `1000px` }} />,
    mapElement: <div style={{ height: `100%` }} />
  }),
  withScriptjs,
  withGoogleMap
);

const colours = [
  "FF851B",
  "01FF70",
  "0074D9",
  "FF4136",
  "a52a2a",
  "00ffff",
  "00008b",
  "a9a9a9",
  "006400",
  "bdb76b",
  "8b008b",
  "556b2f",
  "ff8c00",
  "9932cc",
  "8b0000",
  "e9967a",
  "ff00ff",
  "4b0082",
  "f0e68c",
  "add8e6",
  "e0ffff",
  "90ee90",
  "d3d3d3",
  "ffb6c1",
  "ffffe0",
  "00ff00",
  "800000",
  "808000",
  "ffa500",
  "ffc0cb",
  "800080",
  "800080",
  "ff0000"
];

const SingleRoute = props => (
  <GoogleMap defaultZoom={15} defaultCenter={{ ...props.tour[0].location }}>
    <PointsComponent
      key={`tour${props.n}`}
      name={`tour${props.n}`}
      color={colours[props.n]}
      tour={props.tour}
    />

    {props.restaurants.map((restaurant, i) => (
      <CustomMarker
        key={`restaurant${i}`}
        {...restaurant}
        position={{ ...restaurant.location }}
        icon={process.env.PUBLIC_URL + "restaurant.png"}
      />
    ))}
  </GoogleMap>
);

const MultipleRoutes = props => (
  <GoogleMap
    defaultZoom={15}
    defaultCenter={{ ...props.data[0].tour[0].location }}
  >
    {props.data
      .reduce((tours, { tour }) => [...tours, tour], [])
      .map((tour, i) => (
        <PointsComponent
          key={`tour${i}`}
          name={`tour${i}`}
          color={colours[i]}
          tour={tour}
        />
      ))}

    {props.data
      .reduce((all, { restaurants }) => [...all, ...restaurants], [])
      .map((restaurant, i) => (
        <CustomMarker
          key={`restaurant${i}`}
          {...restaurant}
          position={{ ...restaurant.location }}
          icon={process.env.PUBLIC_URL + "restaurant.png"}
        />
      ))}
  </GoogleMap>
);

export const SingleRouteMap = enhance(SingleRoute);
export const MultipleRoutesMap = enhance(MultipleRoutes);

const PointsComponent = ({ name, tour, color }) => {
  let n = 0;

  return (
    <>
      {tour.map((elem, i) => {
        switch (elem.type) {
          case "poi":
            n++;
            return (
              <CustomMarker
                key={`${name}-${i}`}
                position={{ ...elem.location }}
                {...elem}
                icon={`http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=${n}|${color}`}
              />
            );

          case "route":
            return (
              <Polyline
                key={`${name}-${i}`}
                path={google.maps.geometry.encoding.decodePath(elem.points)}
                options={{ strokeColor: `#${color}` }}
              />
            );

          case "home":
            return (
              <Marker
                key={`${name}-${i}`}
                position={elem.location}
                icon={process.env.PUBLIC_URL + "home.png"}
              >
                {" "}
              </Marker>
            );

          default:
            return null;
        }
      })}
    </>
  );
};

const CustomMarker = compose(
  withStateHandlers(
    () => ({
      isOpen: false
    }),
    {
      onToggleOpen: ({ isOpen }) => () => ({
        isOpen: !isOpen
      })
    }
  )
)(props => (
  <Marker
    position={props.position}
    onClick={props.onToggleOpen}
    icon={props.icon}
  >
    {props.isOpen && (
      <InfoWindow onCloseClick={props.onToggleOpen}>
        <div>
          <h6>{props.name}</h6>
          <p>
            <b>Inicio: </b>
            {props.schedule.start}
          </p>
          <p>
            <b>Fin: </b>
            {props.schedule.end}
          </p>
          <p>
            <b>Sitio web: </b>
            <a href={props.website} target="_blank" rel="noopener noreferrer">
              {props.website}
            </a>
          </p>
          <p>
            <a href={props.url} target="_blank" rel="noopener noreferrer">
              Más detalles
            </a>
          </p>
        </div>
      </InfoWindow>
    )}
  </Marker>
));
