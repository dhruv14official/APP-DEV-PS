import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

import Tab from "./components/Tab";

import HomeTab from "./components/HomeTab";
import Landslide from "./components/Landslide";
import Flood from "./components/Flood";
import Fog from "./components/Fog";
import Snow from "./components/Snow";
import DangerZone from "./components/DangerZone";
import logo from "./assets/logo.png";


function App(){

  // Default tab = Home
  const [activeTab, setActiveTab] = useState("home");

  return(

    <div className="container mt-3">
      <img src={logo} alt="logo" className="logo"/><h1 className="text-center mb-4">
        Uttarakhand Road Hazard Monitoring Dashboard
      </h1>

      <Tab activeTab={activeTab} setActiveTab={setActiveTab} />

      {activeTab === "home" && <HomeTab />}
      {activeTab === "landslide" && <Landslide />}
      {activeTab === "flood" && <Flood />}
      {activeTab === "fog" && <Fog />}
      {activeTab === "snow" && <Snow />}
      {activeTab === "danger" && <DangerZone />}

    </div>

  );
}

export default App;