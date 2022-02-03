import { StyleSheet, Text, View, TouchableOpacity, TextInput, Keyboard } from 'react-native';
import React from 'react';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Feather';
import IconFont from 'react-native-vector-icons/FontAwesome';
import LocationIcon from 'react-native-vector-icons/MaterialIcons';
import CloudIcon from 'react-native-vector-icons/AntDesign';
import DropIcon from 'react-native-vector-icons/SimpleLineIcons';
import SunIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useState, useEffect } from 'react';

const days = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednsday',
  'Thursday',
  'Friday',
  'Saturday',
];

const month = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'Jule',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export default function App() {
  const [query, setQuery] = useState('');
  const [isInput, setIsInput] = useState(false);
  const [allData, setAllData] = useState(null);
  const [pastData, setPastData] = useState(null);

  function pastDate() {
    const date = new Date();
    const dateNumber = date.getUTCDate();
    const getMonth = date.getUTCMonth();
    console.log(getMonth);
    const month = getMonth + 1;
    const monthWithNull = month < 10 ? '0' + month : month;
    const year = date.getUTCFullYear();
    const yesterday = dateNumber === 1 ? dateNumber : dateNumber - 1;
    const yesterdayWithNull = yesterday < 10 ? '0' + yesterday : yesterday;
    const message = `${year}-${monthWithNull}-${yesterdayWithNull}`;
    console.log(message)
    return message;
  }


  function currentDate() {
    const date = new Date();
    const day = date.getUTCDay();
    const dateNumber = date.getUTCDate();
    const getMonth = date.getUTCMonth();
    const dayOfWeek = days[day];
    const currentMonth = month[getMonth];
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'pm' : 'am';
    const hourse = hours % 12;
    const hourses = hourse ? hourse : 12; // the hour '0' should be '12'
    const minutese = minutes < 10 ? '0' + minutes : minutes;
    const strTime = hourses + ':' + minutese + ' ' + ampm;
    const message = `${dayOfWeek} ${dateNumber} ${currentMonth} ${strTime} `;
    return message;
  }

  function heightTemp() {
    { allData ? allData.forecast.forecastday[0].hour[8].cloud : 0 }
  }

  async function fetchApi() {
    try {
      const response = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=6d476c46b92048debf3123354220102&q=${query}&days=1&aqi=yes`);
      const data = await response.json();
      await setAllData(data);
    } catch (error) {
      console.log(error)
    }
  }
  async function fetchApiYesterday() {
    try {
      const response = await fetch(`https://api.weatherapi.com/v1/history.json?key=6d476c46b92048debf3123354220102&q=${query}&dt=${pastDate()}`);
      const data = await response.json();
      await setPastData(data);
    } catch (error) {
      console.log(error)
    }
  }
  function onSubmit() {
    currentDate();
    setQuery(query);
    Keyboard.dismiss();
    fetchApi();
    fetchApiYesterday();
    console.log(pastData);
    setQuery('');
  }

  return (
    <View style={s.container}>
      <LinearGradient colors={['#6a5acd', '#afeeee']} style={s.linear}>
        <View style={s.top}>
          <Text style={s.textLoc}>Locations</Text>
          {isInput &&
            <>
              <TouchableOpacity style={s.submitBtn} onPress={onSubmit}>
                <Text style={{ ...s.text, marginBottom: 0 }}>
                  Search
                </Text>
              </TouchableOpacity>
              <TextInput
                style={s.textInput}
                value={query}
                onChangeText={(value) => setQuery(value)}>
              </TextInput>
            </>}
          <TouchableOpacity onPress={() => setIsInput(!isInput)}>
            <Icon name="search" size={20} color="#dcdcdc" style={s.iconSearch} />
          </TouchableOpacity>
          <IconFont name="ellipsis-v" size={24} color="#dcdcdc" />
        </View>
        <View style={s.heroWrap}>
          <View style={s.location}>
            <LocationIcon name="location-on" size={14} color="#fff" style={{ marginRight: 5 }} />
            <Text style={s.text}>
              {allData ? allData.location.name : "London"}
            </Text>
          </View>
          <Text style={s.textData}>{currentDate()} </Text>
          <View style={s.temp}>
            <CloudIcon name="cloud" size={50} color="#fff" />
            <Text style={s.textTemp}>
              {allData ? Math.round(allData.current.temp_c) : "7"}°
            </Text>
          </View>
          <Text style={s.text}>
            {allData ? Math.round(allData.forecast.forecastday[0].day.maxtemp_c) : "12"}°/{allData ? Math.round(allData.forecast.forecastday[0].day.mintemp_c) : "6"}° Feels like {allData ? Math.round(allData.current.feelslike_c) : "3"}°
          </Text>
          <Text style={{ ...s.text, marginBottom: 0 }}>{allData ? allData.current.condition.text : "Cloudy"}</Text>
        </View>
        <View style={s.yesterdayWrap}>
          <Text style={{ ...s.text, marginBottom: 5 }}>Yesterday:
            {pastData ? Math.round(pastData.forecast.forecastday[0].day.maxtemp_c) : "12"}°/{pastData ? Math.round(pastData.forecast.forecastday[0].day.mintemp_c) : "6"}°
            {/* 12°/6° */}
          </Text>
        </View>
        <View style={s.firstWrap}>
          <View style={{ ...s.precpitation, paddingRight: 30 }}>
            <View>
              <DropIcon name="drop" size={20} color="#fff" style={{ marginRight: 10 }} />
            </View>
            <View>
              <Text style={s.precpitationText}>Precipitation</Text>
              <Text style={s.precpitationText}>{allData ? allData.current.precip_mm : 0}%</Text>
            </View>
          </View>
          <View style={{
            ...s.precpitation,
            borderStyle: "solid",
            borderLeftColor: "#fff",
            borderLeftWidth: 2,
            paddingLeft: 30
          }}>
            <View>
              <SunIcon name="white-balance-sunny" size={20} color="yellow" style={{ marginRight: 10 }} />
            </View>
            <View>
              <View>
                <Text style={s.precpitationText}>UV index</Text>
                <Text style={s.precpitationText}>{allData ? Math.round(allData.current.uv) : "Low"}°</Text>
              </View>
            </View>
          </View>
        </View>
        <Text style={{ ...s.text, marginBottom: 5, marginTop: 20, marginLeft: 20, }}>Hourly</Text>
        <View style={s.hourly}>
          <View style={{ alignItems: "center" }}>
            <Text style={s.text}> 8:00 am</Text>
            <CloudIcon name="cloud" size={30} color="#fff" />
            <Text style={s.text}>{allData ? allData.forecast.forecastday[0].hour[8].cloud : 0}%</Text>
            <Text style={{ ...s.text, marginBottom: 10, marginTop: 10 }}>{allData ? Math.round(allData.forecast.forecastday[0].hour[8].temp_c) : 30}</Text>
            <View style={{ justifyContent: 'flex-end', height: 50 }}>
              <View style={{ ...s.scale, height: allData ? 2 * allData.forecast.forecastday[0].hour[8].temp_c : 2 * 20 }}></View>
            </View>
          </View>
          <View style={{ alignItems: "center" }}>
            <Text style={s.text}>11:00 am</Text>
            <CloudIcon name="cloud" size={30} color="#fff" />
            <Text style={s.text}>{allData ? allData.forecast.forecastday[0].hour[11].cloud : 0}%</Text>
            <Text style={{ ...s.text, marginBottom: 10, marginTop: 10 }}>{allData ? Math.round(allData.forecast.forecastday[0].hour[11].temp_c) : 30}</Text>
            <View style={{ justifyContent: 'flex-end', height: 50 }}>
              <View style={{ ...s.scale, height: allData ? 2 * allData.forecast.forecastday[0].hour[11].temp_c : 2 * 20 }}></View>
            </View>
          </View>
          <View style={{ alignItems: "center" }}>
            <Text style={s.text}>2:00 pm</Text>
            <CloudIcon name="cloud" size={30} color="#fff" />
            <Text style={s.text}>{allData ? allData.forecast.forecastday[0].hour[14].cloud : 0}%</Text>
            <Text style={{ ...s.text, marginBottom: 10, marginTop: 10 }}>{allData ? Math.round(allData.forecast.forecastday[0].hour[14].temp_c) : 30}</Text>
            <View style={{ justifyContent: 'flex-end', height: 50 }}>
              <View style={{ ...s.scale, height: allData ? 2 * allData.forecast.forecastday[0].hour[14].temp_c : 2 * 20 }}></View>
            </View>
          </View>
          <View style={{ alignItems: "center" }}>
            <Text style={s.text}>5:00 pm</Text>
            <CloudIcon name="cloud" size={30} color="#fff" />
            <Text style={s.text}>{allData ? allData.forecast.forecastday[0].hour[17].cloud : 0}%</Text>
            <Text style={{ ...s.text, marginBottom: 10, marginTop: 10 }}>{allData ? Math.round(allData.forecast.forecastday[0].hour[17].temp_c) : 30}</Text>
            <View style={{ justifyContent: 'flex-end', height: 50 }}>
              <View style={{ ...s.scale, height: allData ? 2 * allData.forecast.forecastday[0].hour[17].temp_c : 2 * 20 }}></View>
            </View>
          </View>
        </View>
      </LinearGradient >
    </View >
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#4169e1',
    justifyContent: "center",

  },
  linear: {
    flex: 1,
  },
  top: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginRight: 20,
    marginTop: 10,
  },

  textLoc: {
    fontWeight: "500",
    fontFamily: "Roboto-Medium",
    fontWeight: "500",
    fontSize: 16,
    lineHeight: 19,
    letterSpacing: 0.01,
    color: "#212121",
    fontStyle: "normal",
    color: "#fff",
    marginRight: 30,
    marginBottom: 20,
  },

  iconSearch: {
    marginRight: 20,
  },
  heroWrap: {
    alignItems: "center"
  },
  location: {
    flexDirection: "row"
  },
  temp: {
    flexDirection: "row",
    alignItems: "center"
  },
  yesterdayWrap: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginRight: 20,
    marginTop: 40,
  },
  text: {
    fontWeight: "500",
    fontFamily: "Roboto-Medium",
    fontWeight: "500",
    fontSize: 16,
    lineHeight: 19,
    letterSpacing: 0.01,
    color: "#212121",
    fontStyle: "normal",
    color: "#fff",
    marginBottom: 20,
  },
  textData: {
    fontWeight: "500",
    fontFamily: "Roboto-Medium",
    fontWeight: "500",
    fontSize: 16,
    lineHeight: 19,
    letterSpacing: 0.01,
    color: "#212121",
    fontStyle: "normal",
    color: "#c0c0c0",
    marginBottom: 20,
  },
  textTemp: {
    fontWeight: "500",
    fontFamily: "Roboto-Medium",
    fontWeight: "500",
    fontSize: 60,
    lineHeight: 75,
    letterSpacing: 0.01,
    color: "#212121",
    fontStyle: "normal",
    color: "#fff",
  },
  firstWrap: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 10,
    backgroundColor: "#87cefa",
    height: 100,
    borderRadius: 10,
  },
  precpitation: {
    flexDirection: "row",
    alignItems: "center",
  },
  precpitationText: {
    fontWeight: "500",
    fontFamily: "Roboto-Medium",
    fontWeight: "500",
    fontSize: 16,
    lineHeight: 19,
    letterSpacing: 0.01,
    color: "#212121",
    fontStyle: "normal",
    color: "#fff",
  },
  hourly: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    backgroundColor: "#87cefa",
    height: 220,
    borderRadius: 10,
    marginHorizontal: 10,
    paddingTop: 20,
  },
  scale: {
    borderWidth: 3,
    borderStyle: "solid",
    borderColor: "#fff",
    marginTop: 15,
    marginBottom: 10,
  },
  textInput: {
    height: 20,
    width: 120,
    color: "#fff",
    borderColor: "#fff",
    paddingTop: -20,
    paddingBottom: -20,
    borderWidth: 1,
    fontSize: 13,
    lineHeight: 17,
    letterSpacing: 0.01,
    marginRight: 10,
  },
  submitBtn: {
    backgroundColor: "#87cefa",
    width: 60,
    height: 20,
    marginRight: 10,
    alignItems: "center"
  }
});
