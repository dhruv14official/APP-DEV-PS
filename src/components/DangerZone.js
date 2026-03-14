import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  GeoJSON,
  useMapEvents
} from "react-leaflet";
import "leaflet/dist/leaflet.css";

const uttarakhandBounds = [
  [28.7, 77.5],
  [31.5, 81.1]
];

// ------------------------------
// MAP CLICK HANDLER
// ------------------------------
function MapClick({ setDangerInfo }) {

  useMapEvents({
    click(e) {

      const lat = e.latlng.lat;
      const lon = e.latlng.lng;

      axios.get("http://localhost:5000/danger", {
        params: { lat, lon }
      })
      .then(res => {

        const data = res.data;

        setDangerInfo({
          lat,
          lon,
          slope: data.slope,
          rainfall: data.rainfall,
          cliffRisk: data.cliffRisk,
          rainRisk: data.rainRisk,
          riskScore: data.riskScore,
          status: data.status
        });

      })
      .catch(err => console.log(err));

    }
  });

  return null;
}

// ------------------------------
// ROAD STYLE FUNCTION
// ------------------------------
function roadStyle(feature){

  const risk = feature.properties.risk_score;

  let color = "green";

  if(risk > 50){
    color = "red";
  }
  else if(risk > 30){
    color = "yellow";
  }

  return {
    color: color,
    weight: 4,
    opacity: 0.9
  };

}

// ------------------------------
// MAIN COMPONENT
// ------------------------------
export default function DangerZone() {

  const [dangerInfo, setDangerInfo] = useState(null);
  const [roads, setRoads] = useState(null);

  const markerRef = useRef();

  // load highway risk layer
  useEffect(() => {

    axios.get("http://localhost:5000/highwayRisk")
      .then(res => {
        setRoads(res.data);
      })
      .catch(err => console.log(err));

  }, []);

  useEffect(() => {
    if (markerRef.current) {
      markerRef.current.openPopup();
    }
  }, [dangerInfo]);

  return (

    <div>

      <h3>⚠️ Uttarakhand Highway Danger Zones</h3>

      <MapContainer
        center={[30.1,79]}
        zoom={8}
        maxBounds={uttarakhandBounds}
        style={{height:"550px",width:"100%"}}
      >

        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Highway risk layer */}
        {roads && (
          <GeoJSON
            data={roads}
            style={roadStyle}
          />
        )}

        {/* Map click */}
        <MapClick setDangerInfo={setDangerInfo}/>

        {/* Popup */}
        {dangerInfo && (

          <Marker
            ref={markerRef}
            position={[dangerInfo.lat, dangerInfo.lon]}
          >

            <Popup>

              <b>Danger Zone Analysis</b>

              <br/>

              Slope: {dangerInfo.slope}°

              <br/>

              Rainfall: {dangerInfo.rainfall} mm

              <br/>

              Cliff Risk: {dangerInfo.cliffRisk}

              <br/>

              Rain Risk: {dangerInfo.rainRisk}

              <br/>

              <b>Total Risk Score:</b> {dangerInfo.riskScore}

              <br/>

              <b>Status:</b> {dangerInfo.status}

            </Popup>

          </Marker>

        )}

      </MapContainer>

    </div>

  );
}