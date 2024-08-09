/* eslint-disable no-unused-vars */
import { React } from 'react';

//
// WeatherButton 컴포넌트 정의
// cities: 도시 이름 배열
// setCity: 도시 이름을 설정하는 함수
// activeCity: 활성화된 도시 이름
// getCurrentLocation: 현재 위치를 가져오는 함수
// WeatherButton 컴포넌트는 도시 이름을 클릭할 때마다 도시 이름을 설정하고, 현재 위치를 클릭할 때마다 현재 위치를 가져오는 버튼을 렌더링
const WeatherButton = ({ cities, setCity, activeCity, getCurrentLocation }) => {
  return (
    <div>
      {/* 현재 위치 버튼이 활성화된 상태라면 'active' 클래스를 추가 */}
      <button className={`${activeCity === '' ? 'active' : ''} button`} onClick={() => getCurrentLocation()}>
        현재 위치
      </button>
      {/* 도시 이름 버튼을 렌더링 */}
      {/* cities 배열에 있는 각 도시 이름으로 버튼 생성 */}
      {/* map : 배열의 각 요소에 대해 주어진 함수를 호출한 결과를 모아 새로운 배열을 반환하는 함수 */}
      {cities.map((city, index) => (
        <button
          // key : React에서 배열을 렌더링할 때 각 요소에 고유한 key를 지정해야 함
          key={index}
          // 버튼의 name 속성에 도시 이름을 설정
          name={city}
          // activeCity와 city가 같으면 'active' 클래스를 추가
          className={`${activeCity === city ? 'active' : ''} button`}
          // 버튼을 클릭하면 setCity 함수를 호출하여 도시 이름을 설정
          onClick={() => setCity(city)}
        >
          {/* 버튼에 도시 이름을 표시 */}
          {city}
        </button>
      ))}
    </div>
  );
};

export default WeatherButton;
