import React from "react";

export default function Tab({ activeTab, setActiveTab }) {

  return (

    <ul className="nav nav-pills nav-justified mb-4">

      <li className="nav-item">
        <button
          className={`nav-link ${activeTab === "home" ? "active" : ""}`}
          onClick={() => setActiveTab("home")}
        >
          Home
        </button>
      </li>

      <li className="nav-item">
        <button
          className={`nav-link ${activeTab === "landslide" ? "active" : ""}`}
          onClick={() => setActiveTab("landslide")}
        >
          Landslide
        </button>
      </li>

      <li className="nav-item">
        <button
          className={`nav-link ${activeTab === "flood" ? "active" : ""}`}
          onClick={() => setActiveTab("flood")}
        >
          Flood
        </button>
      </li>

      <li className="nav-item">
        <button
          className={`nav-link ${activeTab === "fog" ? "active" : ""}`}
          onClick={() => setActiveTab("fog")}
        >
          Fog
        </button>
      </li>

      <li className="nav-item">
        <button
          className={`nav-link ${activeTab === "snow" ? "active" : ""}`}
          onClick={() => setActiveTab("snow")}
        >
          Snow
        </button>
      </li>

      <li className="nav-item">
        <button
          className={`nav-link ${activeTab === "danger" ? "active" : ""}`}
          onClick={() => setActiveTab("danger")}
        >
          Danger Zones
        </button>
      </li>

    </ul>

  );
}