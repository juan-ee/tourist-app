/* eslint-disable no-undef */
import React from "react";
const _ = require("lodash");
const { compose, withProps, lifecycle } = require("recompose");
const {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker
} = require("react-google-maps");
const {
  SearchBox
} = require("react-google-maps/lib/components/places/SearchBox");

export const SearchMapComponent = compose(
  withProps({
    googleMapURL:
      "https://maps.googleapis.com/maps/api/js?key=AIzaSyCKzbdK1wXzCIQf7UAMxpTgV6S5l2AjRGc&v=3.exp&libraries=geometry,drawing,places",
    loadingElement: <div style={{ height: `90%` }} />,
    containerElement: <div style={{ height: `500px` }} />,
    mapElement: <div style={{ height: `90%` }} />
  }),
  lifecycle({
    componentWillMount() {
      const refs = {};

      this.setState({
        center: {
          lat: 41.9,
          lng: -87.624
        },
        markers: [],
        onMapMounted: ref => {
          refs.map = ref;
        },
        onSearchBoxMounted: ref => {
          refs.searchBox = ref;
        },
        onPlacesChanged: (ev, setLocation) => {
          const places = refs.searchBox.getPlaces();

          const nextMarkers = places.map(place => ({
            position: place.geometry.location
          }));
          const nextCenter = _.get(
            nextMarkers,
            "0.position",
            this.state.center
          );

          if (nextMarkers.length[0] !== undefined)
            setLocation(nextMarkers[0].position.toJSON());

          this.setState({
            center: nextCenter,
            markers: nextMarkers
          });
        },
        onMapClicked: (new_marker, setLocation) => {
          this.setState({
            markers: [{ position: new_marker.latLng }]
          });
          setLocation(new_marker.latLng.toJSON());
          // dispatch(setLocationAction(new_marker.latLng.toJSON()));
        }
      });
    }
  }),
  withScriptjs,
  withGoogleMap
)(props => (
  <GoogleMap
    ref={props.onMapMounted}
    defaultZoom={15}
    center={props.center}
    onClick={ev => props.onMapClicked(ev, props.setLocation)}
    options={{ mapTypeControl: false }}
  >
    <SearchBox
      ref={props.onSearchBoxMounted}
      controlPosition={google.maps.ControlPosition.TOP_CENTER}
      onPlacesChanged={ev => props.onPlacesChanged(ev, props.setLocation)}
    >
      <input
        type="text"
        placeholder="¿A dónde quieres ir de viaje?"
        style={{
          boxSizing: `border-box`,
          border: `1px solid transparent`,
          width: `240px`,
          height: `32px`,
          marginTop: `27px`,
          padding: `0 12px`,
          borderRadius: `3px`,
          boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
          fontSize: `14px`,
          outline: `none`,
          textOverflow: `ellipses`
        }}
      />
    </SearchBox>
    {props.markers.map((marker, index) => (
      <Marker
        key={index}
        position={marker.position}
        icon={process.env.PUBLIC_URL + "home-address.png"}
      />
))}
</GoogleMap>
));
