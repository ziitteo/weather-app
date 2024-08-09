/* eslint-disable no-unused-vars */
import { React, useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faLocationDot,
  faArrowUp,
  faArrowDown,
  faSun,
  faCloudSun,
  faCloud,
  faCloudRain,
  faCloudSunRain,
  faCloudBolt,
  faCloudMeatball,
  faSmog,
} from '@fortawesome/free-solid-svg-icons';
import moment from 'moment-timezone';

// WeatherBox 컴포넌트 정의
// weather: 날씨 정보 객체
// forecast: 5일 예보 정보 배열
// timezone: 타임존
// WeatherBox 컴포넌트는 날씨 정보와 5일 예보 정보를 표시
const WeatherBox = ({ weather, forecast, timezone }) => {
  // 상태 변수 선언
  // weatherIcon: 날씨 아이콘 (날씨 상태에 따라 다른 아이콘을 표시하기 위한 상태 변수)
  const [weatherIcon, setWeatherIcon] = useState(null);
  // todayDate: 오늘 날짜 (오늘 날짜를 표시하기 위한 상태 변수)
  const [todayDate, setTodayDate] = useState('');

  // 날씨 정보에서 온도 정보를 추출하여 섭씨, 화씨, 계산
  const celsius = weather?.main ? Math.ceil(weather.main.temp) : null;
  const fahrenheit = celsius !== null ? Math.ceil((celsius * 9) / 5 + 32) : null;
  // 최저, 최고 온도 추출
  const minTemp = weather?.main ? Math.ceil(weather.main.temp_min) : null;
  const maxTemp = weather?.main ? Math.ceil(weather.main.temp_max) : null;

  // 날씨 상태에 따른 아이콘 설정
  const icons = {
    'clear sky': faSun,
    'few clouds': faCloudSun,
    'scattered clouds': faCloud,
    'broken clouds': faCloud,
    'shower rain': faCloudRain,
    rain: faCloudSunRain,
    thunderstorm: faCloudBolt,
    snow: faCloudMeatball,
    mist: faSmog,
    'overcast clouds': faCloud,
    'light rain': faCloudRain,
    'moderate rain': faCloudRain,
    'heavy intensity rain': faCloudRain,
    'very heavy rain': faCloudRain,
    'extreme rain': faCloudRain,
    'freezing rain': faCloudMeatball,
    'light intensity shower rain': faCloudRain,
    'heavy intensity shower rain': faCloudRain,
    'ragged shower rain': faCloudRain,
    'light snow': faCloudMeatball,
    'heavy snow': faCloudMeatball,
    sleet: faCloudMeatball,
    'light shower sleet': faCloudMeatball,
    'shower sleet': faCloudMeatball,
    'light rain and snow': faCloudMeatball,
    'rain and snow': faCloudMeatball,
    'light shower snow': faCloudMeatball,
    'shower snow': faCloudMeatball,
    'heavy shower snow': faCloudMeatball,
  };

  // 현재 날짜와 사긴을 설정하는 함수
  const getTodayDate = () => {
    // 타임존을 기반으로 현재 날짜와 시간을 나타내는 Date 객체 생성
    const now = moment().tz(timezone);

    // 현재 요일을 설정
    const day = now.format('ddd');
    // 현재 일(date)을 설정
    const nowDate = now.date();
    // 현재 월을 설정
    const month = now.format('MMM');
    // 현재 년도를 설정
    const year = now.year();
    // 현재 시간을 설정 (시)
    const hour = now.format('HH');
    // 현재 시간을 설정 (분)
    const minute = now.format('mm');
    // 오늘 날짜와 시간 문자열 생성
    const today = `Today ${month} ${nowDate}  ${year} ${day} ${hour}:${minute}`;
    // 오늘 날짜와 시간을 상태 변수에 설정
    setTodayDate(today);
  };

  // 날씨 상태에 따른 아이콘 설정
  const getWeatherIcon = () => {
    // 날씨 상태 가져오기
    const weatherType = weather?.weather[0]?.description;

    // 만약 날씨 상태가 존재한다면
    if (weatherType) {
      // icons 객체를 순회하면서 날씨 상태에 해당하는 아이콘을 찾음
      for (const key in icons) {
        // 날씨 상태에 해당하는 아이콘을 찾으면 상태 변수에 설정하고 반복문 종료
        if (weatherType.includes(key)) {
          setWeatherIcon(icons[key]);
          break;
        }
      }
    }
  };

  // 컴포넌트가 처음 렌더링될 때와 weather 상태가 변경될 때마다 아이콘 설정 함수 실행
  useEffect(() => {
    getWeatherIcon();
    // weather 상태가 변경될 때마다 아이콘 설정 함수 실행
  }, [weather]);

  // 컴포넌트가 처음 렌더링될 때와 timezone 상태가 변경될 때마다 오늘 날짜 설정 함수 실행
  useEffect(() => {
    getTodayDate();
    // timezone 상태가 변경될 때마다 오늘 날짜 설정 함수 실행
  }, [timezone]);

  return (
    <div className='weather-box column-start'>
      {/* 도시 이름 표시 */}
      <div className='city'>
        <FontAwesomeIcon icon={faLocationDot} /> {weather?.name}
      </div>
      <div>
        {/* 오늘 날씨 표시 */}
        <p className='today'>{todayDate}</p>
      </div>
      {/* 현재 온도 표시 */}
      <div className='temp row-start-end'>
        <span className='celsius'>{celsius}</span>
        <span className='fahrenheit'> / {fahrenheit}</span>
      </div>
      {/* 날씨 상태 표시 */}
      <h3 className='desc'>
        {weather && <FontAwesomeIcon icon={weatherIcon} rotation={90} className='weather-icon' />}
        {weather?.weather[0]?.description}
      </h3>
      {/* 최저, 최고 온도 표시 */}
      <div className='min-max row-start'>
        <p className='max row-start'>
          <div className='arrow row-start-start'>
            <FontAwesomeIcon icon={faArrowUp} />
          </div>
          {maxTemp !== null ? `${maxTemp}°` : ''}
        </p>
        <p className='min row-start'>
          <div className='arrow row-start-start'>
            <FontAwesomeIcon icon={faArrowDown} />
          </div>
          {minTemp !== null ? `${minTemp}°` : ''}
        </p>
      </div>
      {/* 5일 예보 정보 표시 */}
      <div className='forecast-box'>
        {/* forecast 배열이 존재하고 길이가 0보다 크다면 */}
        {forecast &&
          forecast.length > 0 &&
          // 5일 예보 정보를 순회하면서 각 요소를 표시
          forecast.map((item, index) => (
            // 예보 정보를 표시하는 요소 생성
            <div key={index} className='forecast-item column-center'>
              <p className='week'>{moment(item.dt_txt).format('ddd')}</p>
              <div className='icon-box row-center'>
                <FontAwesomeIcon icon={icons[item.weather[0].description]} className='weather-icon2 row-center' />
              </div>
              <p>{Math.ceil(item.main.temp)}°C</p>
            </div>
          ))}
      </div>
    </div>
  );
};

export default WeatherBox;
