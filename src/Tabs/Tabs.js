import * as React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import SportsBarIcon from "@mui/icons-material/SportsBar";
import SignalCellularAltIcon from "@mui/icons-material/SignalCellularAlt";
import SettingsInputAntennaIcon from "@mui/icons-material/SettingsInputAntenna";
import WifiIcon from "@mui/icons-material/Wifi";
import MicrowaveIcon from "@mui/icons-material/Microwave";
import "./Tabs.css";
import { useEffect, useState } from "react";

const menuItems = [
  { title: "Statistics", icon: <SignalCellularAltIcon /> },
  { title: "Live data", icon: <SettingsInputAntennaIcon /> },
  { title: "Recipes", icon: <SportsBarIcon /> },
  { title: "Wifi", icon: <WifiIcon /> },
  { title: "Instructions", icon: <MicrowaveIcon /> },
];

export default function IconTabs({ setSelectedItem }) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    const prevTab = window.localStorage.getItem("tab");
    if (prevTab) {
      const tab = parseInt(prevTab);
      setValue(tab);
      setSelectedItem(menuItems[tab].title);
    }
  }, [setSelectedItem]);
  const handleChange = (event, newValue) => {
    window.localStorage.setItem("tab", newValue);
    setValue(newValue);
  };

  return (
    <div className="tabs_container">
      <Tabs
        variant="scrollable"
        value={value}
        onChange={handleChange}
        aria-label="icon tabs example"
      >
        {menuItems.map((menuItem) => (
          <Tab
            style={{ maxWidth: "20%", minWidth: "20%" }}
            key={`tab_${menuItem.title}_index`}
            icon={menuItem.icon}
            aria-label={menuItem.title}
            onClick={() => setSelectedItem(menuItem.title)}
          />
        ))}
      </Tabs>
    </div>
  );
}
