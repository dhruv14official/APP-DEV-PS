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

function MapClick({ setFloodInfo, date }) {

  useMapEvents({
    click(e) {

      const lat = e.latlng.lat;
      const lon = e.latlng.lng;

      console.log("Clicked:", lat, lon);

      axios.get("http://localhost:5000/flood", {
        params: {
          lat: lat,
          lon: lon,
          date: date
        }
      })
      .then(res => {

        console.log("Flood API:", res.data);

        const data = res.data;

        setFloodInfo({
          lat,
          lon,
          name: data.name,
          status: data.status,
          floodFrac: data.floodFrac,
          slope: data.slope,
          riverDist: data.riverDist,
          risk: data.risk
        });

      })
      .catch(err => console.log(err));

    }
  });

  return null;
}

export default function Flood() {

  const [floodInfo, setFloodInfo] = useState(null);
  const [date, setDate] = useState("2023-08-15");

  const markerRef = useRef();

  useEffect(() => {
    if (markerRef.current) {
      markerRef.current.openPopup();
    }
  }, [floodInfo]);

  return (

    <div>

      <h3>🌊 Uttarakhand Flood Risk Monitor</h3>

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

        <MapClick setFloodInfo={setFloodInfo} date={date}/>

        {floodInfo && (

          <Marker
            ref={markerRef}
            position={[floodInfo.lat, floodInfo.lon]}
          >

            <Popup>

              <b>{floodInfo.name}</b>

              <br/>

              Status: {floodInfo.status}

              <br/>

              Flood Coverage: {floodInfo.floodFrac} %

              <br/>

              Avg Slope: {floodInfo.slope}°

              <br/>

              Distance to River: {floodInfo.riverDist} m

              <br/>

              <b>Risk Level:</b> {floodInfo.risk}

            </Popup>

          </Marker>

        )}

      </MapContainer>

    </div>

  );
}