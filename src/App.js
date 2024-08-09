/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react';
import ClipLoader from 'react-spinners/ClipLoader';
import moment from 'moment-timezone';

import './App.css';

import WeatherBox from './components/WeatherBox.jsx';
import WeatherButton from './components/WeatherButton.jsx';

// 1. 앱이 실행되자마자 현재 위치기반의 날씨 정보가 보인다.
// 2. 날씨 정보에는 도시, 섭씨, 화씨, 날씨 상태, 아이콘
// 3. 5개의 버튼이 있다. (1개는 현재 위치, 나머지 4개는 취리히, 스톡홀름, 웰링턴, 암스테르담)
// 4. 도시 버튼을 클릭할 때 마다 도시별 날씨 정보가 보인다.
// 5. 현재 위치 버튼을 누르면 다시 현재위치 기반의 날씨가 나온다.
// 6. 데이터를 들고오는 동안 로딩 스피너가 돈다.

function App() {
  // 날씨 상태에 따른 배경 클래스네임 설정 (날씨 상태별로 다른 배경화면을 설정하기 위한 객체)
  const bgClassName = {
    'clear sky': 'sunny',
    'few clouds': 'cloud-sun',
    'scattered clouds': 'cloud',
    'broken clouds': 'cloud',
    'shower rain': 'cloud-rain',
    rain: 'rain',
    thunderstorm: 'thunderstorm',
    snow: 'snow',
    mist: 'smog',
    'overcast clouds': 'cloud',
    'light rain': 'cloud-rain',
    'moderate rain': 'cloud-rain',
    'heavy intensity rain': 'rain',
    'very heavy rain': 'rain',
    'extreme rain': 'rain',
    'freezing rain': 'rain',
    'light intensity shower rain': 'rain',
    'heavy intensity shower rain': 'rain',
    'ragged shower rain': 'rain',
    'light snow': 'snow',
    'heavy snow': 'snow',
    sleet: 'snow',
    'light shower sleet': 'snow',
    'shower sleet': 'snow',
    'light rain and snow': 'snow',
    'rain and snow': 'snow',
    'light shower snow': 'snow',
    'shower snow': 'snow',
    'heavy shower snow': 'snow',
  };

  // 도시별 타임존 설정 (도시 이름과 해당 타임존을 매칭하기 위한 객체)
  const cityTimezones = {
    Zurich: 'Europe/Zurich',
    Stockholm: 'Europe/Stockholm',
    Auckland: 'Pacific/Auckland',
    Amsterdam: 'Europe/Amsterdam',
  };

  // 상태 설정 (컴포넌트에서 사용할 상태 변수들 선언)
  // weather: 날씨 정보
  const [weather, setWeather] = useState(null);
  // forecast: 예보 정보
  const [forecast, setForecast] = useState([]);
  // weatherClass: 날씨 상태에 따른 배경 클래스네임
  const [weatherClass, setWeatherClass] = useState('sunny');
  // city: 도시
  const [city, setCity] = useState('');
  // loading: 로딩 상태
  const [loading, setLoading] = useState(false);
  // timezone: 타임존 정보
  const [timezone, setTimezone] = useState(moment.tz.guess());
  // activeCity: 현재 선택된 도시
  const [activeCity, setActiveCity] = useState('');

  // 도시 목록
  const cities = ['Zurich', 'Stockholm', 'Auckland', 'Amsterdam'];

  // API 키 (환경 변수에서 가져옴))
  const API_KEY = process.env.REACT_APP_WEATHER_KEY;

  // 에러 처리 함수 (에러 발생시 메시지를 팝업에 출력)
  const errorRender = errorMessage => {
    alert(errorMessage);
  };

  // 날씨 데이터 가져오기 (비동기로 API 호출)
  const fetchWeatherData = async url => {
    try {
      // fetch 함수를 사용하여 API 호출
      const response = await fetch(url);
      // JSON 형태로 변환
      const weatherData = await response.json();
      // 날씨 정보 반환
      return weatherData;
      // 에러 발생 시 에러 메시지 출력
    } catch (error) {
      errorRender(error.message);
      // null 반환
      return null;
    }
  };

  // 현재 위치 기반 날씨 정보 가져오기
  const getWeatherByCurrentLocation = async (lat, lon) => {
    // 로딩 상태 시작
    setLoading(true);
    try {
      // 현재 위치 기반 날씨 정보 API URL
      const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`;
      // 현재 위치 기반 예보 정보 API URL
      const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`;
      // 날씨 정보 가져오기
      const weatherData = await fetchWeatherData(weatherUrl);
      // 예보 정보 가져오기
      const forecastData = await fetchWeatherData(forecastUrl);

      // 날씨 정보 설정
      setWeather(weatherData);
      // 예보 정보 설정
      if (forecastData?.list) {
        setForecast(forecastData.list.filter((item, index) => item.dt_txt.includes('12:00:00')).slice(1, 5));
      }

      // 현재 위치 타임존 가져오기
      const timezone = moment.tz.guess();
      // 타임존 설정
      setTimezone(timezone);
      setActiveCity('');
    } catch (error) {
      // 에러 발생 시 에러 메시지 출력
      errorRender(error.message);
    } finally {
      // 로딩 상태 종료
      setLoading(false);
    }
  };

  // 도시별 날씨 정보 가져오기
  const getWeatherByCity = async cityName => {
    setLoading(true);
    try {
      // 도시 기반 날씨 정보 API URL
      const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&appid=${API_KEY}`;
      // 도시 기반 예보 정보 API URL
      const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&units=metric&appid=${API_KEY}`;
      // 날씨 정보 가져오기
      const weatherData = await fetchWeatherData(weatherUrl);
      // 예보 정보 가져오기
      const forecastData = await fetchWeatherData(forecastUrl);
      // 날씨 정보 설정
      setWeather(weatherData);
      // 예보 정보 설정
      if (forecastData?.list) {
        setForecast(forecastData.list.filter((item, index) => item.dt_txt.includes('12:00:00')).slice(1, 5));
      }
      // 타
      setTimezone(cityTimezones[cityName]);
      // activeCity를 설정하여 현재 선택된 도시를 저장 (현재 선택된 도시를 표시하기 위함)
      setActiveCity(cityName);
    } catch (error) {
      // 에러 발생 시 에러 메시지 출력
      errorRender(error.message);
    } finally {
      // 로딩 상태 종료
      setLoading(false);
    }
  };

  // 현재 위치 정보 가져오는 함수
  const getCurrentLocation = () => {
    // navigator.geolocation을 사용하여 현재 위치 정보를 가져옴
    navigator.geolocation.getCurrentPosition(position => {
      // 현재 위치의 위도, 경도를 가져옴
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;
      // 현재 위치 기반 날씨 정보 가져오기
      getWeatherByCurrentLocation(lat, lon);
    });
  };

  // 날씨 상태에 따른 배경 클래스네임 설정
  const getClassNames = () => {
    // 현재 날씨 상태를 가져옴
    const weatherType = weather?.weather[0].description;
    // 날씨 상태에 따른 배경 클래스네임 설정
    if (weatherType) {
      // bgClassName 객체를 순회하며 날씨 상태에 해당하는 클래스네임을 찾음
      for (const key in bgClassName) {
        // 날씨 상태에 해당하는 클래스네임을 찾으면 해당 클래스네임을 설정
        if (weatherType.includes(key)) {
          // 날씨 상태에 해당하는 클래스네임을 설정
          setWeatherClass(bgClassName[key]);
          // 반복문 종료
          break;
        }
      }
    }
  };

  // useEffect를 사용하여 컴포넌트가 렌더링될 때마다 실행
  // 현재 위치의 날씨 정보를 가져오거나, 도시별 날씨 정보를 가져옴
  useEffect(() => {
    // city가 비어있으면 현재 위치 기반 날씨 정보를 가져옴
    if (city === '') {
      getCurrentLocation();
      // city가 비어있지 않으면 도시별 날씨 정보를 가져옴
    } else {
      getWeatherByCity(city);
    }
    // city가 변경될 때마다 실행
  }, [city]);

  // useEffect를 사용하여 컴포넌트가 렌더링될 때마다 실행
  // 날씨 정보가 변경될 때마다 날씨 상태에 따른 배경 클래스네임을 설정
  useEffect(() => {
    // 날씨 상태에 따른 배경 클래스네임 설정
    getClassNames();
    // weather 상태가 변경될 때마다 실행
  }, [weather]);

  return (
    <div>
      <div className={`main  ${weatherClass}`}></div>
      {loading ? (
        <div className='container column-center'>
          <ClipLoader
            color='#f88c6b'
            loading={loading}
            size={150}
            aria-label='Loading Spinner'
            data-testid='loader'
            className='row-center'
          />
        </div>
      ) : (
        <div className='container column-center'>
          {/* WeatherBox 컴포넌트를 렌더링하고, props로 날씨 정보, 예보 정보, 타임존 정보를 전달 */}
          <WeatherBox weather={weather} forecast={forecast} timezone={timezone} />
          {/* WeatherButton 컴포넌트를 렌더링하고, props로 도시 목록, 도시 설정 함수, 현재 선택된 도시, 현재 위치 정보 가져오는 함수를 전달 */}
          <WeatherButton
            cities={cities}
            setCity={setCity}
            activeCity={activeCity}
            getCurrentLocation={getCurrentLocation}
          />
        </div>
      )}
    </div>
  );
}

export default App;
