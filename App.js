import React from "react";
import { StyleSheet} from "react-native";
import Temp from "./provider/TemperatureContext";
import Home from "./screens/Home";

export default function App() {
  return (
    <Temp>
      <Home />
    </Temp>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});