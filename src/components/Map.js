import React, { Component } from "react";
import { Map, GoogleApiWrapper } from "google-maps-react";

const mapStyles = {
  width: "100%",
  height: "100%"
};

class MapContainer extends Component {
  render() {
    return (
      <Map
        google={this.props.google}
        zoom={14}
        style={mapStyles}
        initialCenter={{
          lat: -1.2884,
          lng: 36.8233
        }}
      />
    );
  }
}

const MapComponent = GoogleApiWrapper({
  apiKey: "AIzaSyCKzbdK1wXzCIQf7UAMxpTgV6S5l2AjRGc"
})(MapContainer);

export default MapComponent;