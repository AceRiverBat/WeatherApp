import React from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useTemp } from "../provider/TemperatureContext";

const Home = () => {
  const date = new Date();
  const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const Full_Date = date.toLocaleDateString('fr-FR', dateOptions).replace(/^\w/, (c) => c.toUpperCase());

  const { tempMode, weatherData, forecastData } = useTemp();

  if (weatherData && forecastData) {
    const { weather, dt } = weatherData;
    const { main } = weather[0];
    const days = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
    const daysData = [];
    const tempData = [];
    let temp = weatherData.main.temp;
    weather.map((e, index) => {
      if (index >= 1) {
        const dd = new Date(e.dt * 1000).getDay();
        daysData.push(days[dd]);
        tempData.push(e.temp["day"]);
      }
    });

    const morningData = forecastData.list.filter((data) =>
      data.dt_txt.includes("09:00:00")
    );

    const afternoonData = forecastData.list.filter((data) =>
      data.dt_txt.includes("15:00:00")
    );

    const dailyData = morningData.map((morning, index) => {
      return {
        morning,
        afternoon: afternoonData[index],
      };
    });

    return (
      <View style={styles.main}>
        {/* Date du jour */}
        <View style={styles.date}>
          <Text style={styles.dateText}>{Full_Date}</Text>
        </View>

        {/* Icône météo */}
        <View style={[styles.weatherIconView]}>
          {weatherData && (
            <Image
              style={{ height: 200, width: 250 }}
              source={{
                uri: `http://openweathermap.org/img/wn/${weatherData.weather[0].icon}.png`,
              }}
            />
          )}
        </View>

        {/* Température */}
        <View>
          <Text style={styles.tempText}>
            {parseInt(temp)}
            <Text style={styles.tempmodeText}>{tempMode} °C</Text>
          </Text>
        </View>

        {/* Condition météo */}
        <View>
          <Text style={styles.weatherState}>{main}</Text>
        </View>

        {/* Prévision météo sur 5 jours */}
        <ScrollView style={styles.dailyScroll} horizontal={true}>
          {dailyData.map((data) => (
            <View style={styles.dailyView} key={data.morning.dt}>
              <Text style={styles.dailyDayText}>
                {days[new Date(data.morning.dt_txt).getDay()]}
              </Text>
              <Image
                style={{ height: 70, width: 70 }}
                source={{
                  uri: `http://openweathermap.org/img/wn/${data.morning.weather[0].icon}.png`,
                }}
              />
              <Text style={styles.dailyTempText}>
                {parseInt(data.morning.main.temp)}
                <Text style={styles.dailyTempmodeText}>{tempMode} °C</Text>
              </Text>
              <Text style={styles.dailyTempText}>
                {parseInt(data.afternoon.main.temp)}
                <Text style={styles.dailyTempmodeText}>{tempMode} °C</Text>
              </Text>
            </View>
          ))}
        </ScrollView>
      </View>
    );
  }
};
const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: "#101010",
  },
  date: {
    marginTop: "15%",
    alignSelf: "center",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  dateText: {
    color: "white",
    fontSize: 30,
    fontWeight: "bold",
  },
  weatherIconView: {
    display: "flex",
    alignItems: "center",
    marginVertical: 30,
  },
  tempText: {
    color: "white",
    fontSize: 60,
    alignSelf: "center",
  },
  tempmodeText: {
    color: "rgba(256,256,256,0.4)",
  },
  weatherState: {
    color: "rgba(256,256,256,0.4)",
    marginTop: 10,
    fontSize: 20,
    alignSelf: "center",
    textTransform: "uppercase",
    fontWeight: "bold",
  },
  dailyScroll: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    marginHorizontal: 10,
    marginBottom: 50,
  },
  dailyView: {
    marginRight: 10,
    alignItems: "center",
  },
  dailyDayText: {
    color: "rgba(256,256,256,0.55)",
    fontSize: 20,
    fontWeight: "600",
    textTransform: "uppercase",
  },
  dailyTempText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 5,
    marginBottom: 2,
  },
  dailyTempmodeText: {
    color: "rgba(256,256,256,0.4)",
    fontWeight: "normal",
  },
});

export default Home;
