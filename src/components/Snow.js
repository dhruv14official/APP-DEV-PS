import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents
} from "react-leaflet";
import "leaflet/dist/leaflet.css";

const uttarakhandBounds = [
  [28.7, 77.5],
  [31.5, 81.1]
];

function MapClick({ setRoadInfo }) {

  useMapEvents({
    click(e) {

      const lat = e.latlng.lat;
      const lon = e.latlng.lng;

      console.log("Clicked:", lat, lon);

      axios.get("http://localhost:5000/snow", {
        params: { lat: lat, lon: lon }
      })
      .then(res => {

        console.log("Snow API:", res.data);

        const data = res.data;

        setRoadInfo({
          lat,
          lon,
          name: data.name,
          status: data.status,
          elevation: data.elevation,
          slope: data.slope,
          aspect: data.aspect,
          risk: data.risk
        });

      })
      .catch(err => console.log(err));

    }
  });

  return null;
}

export default function Snow() {

  const [roadInfo, setRoadInfo] = useState(null);
  const [date, setDate] = useState("2024-01-15");

  const markerRef = useRef();

  useEffect(() => {
    if (markerRef.current) {
      markerRef.current.openPopup();
    }
  }, [roadInfo]);

  return (

    <div>

      <h3>❄️ Uttarakhand Winter Road Monitor</h3>

      <div style={{marginBottom:"10px"}}>
        <label>Select Date: </label>

        <input
          type="date"
          value={date}
          onChange={(e)=>setDate(e.target.value)}
        />
      </div>

      <MapContainer
        center={[30.1,79]}
        zoom={8}
        maxBounds={uttarakhandBounds}
        style={{height:"500px",width:"100%"}}
      >

        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapClick setRoadInfo={setRoadInfo}/>

        {roadInfo && (

          <Marker
            ref={markerRef}
            position={[roadInfo.lat, roadInfo.lon]}
          >

            <Popup>

              <b>{roadInfo.name}</b>

              <br/>

              Status: {roadInfo.status}

              <br/>

              Elevation: {roadInfo.elevation} m

              <br/>

              Slope: {roadInfo.slope}°

              <br/>

              Aspect: {roadInfo.aspect}°

              <br/>

              <b>Risk Level:</b> {roadInfo.risk}

            </Popup>

          </Marker>

        )}

      </MapContainer>

    </div>

  );
}