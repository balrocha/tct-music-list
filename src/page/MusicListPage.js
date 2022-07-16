import React, {useState, useEffect, useCallback} from 'react';
import axios from 'axios';
import MusicItem from '../component/MusicItem';

const MusicListPage = () => {
  const [currentTime, setCurrentTime] = useState('');
  const [chartType, setChartType] = useState('domestic');
  const [chartList, setChartList] = useState([]);

  const handleSelectChart = (chartType) => {
    console.log('handleSelectChart');

    setChartType(chartType);
  };

  const loadItemList = (chartType) => {
    console.log('loadItemList');

    axios.get('http://localhost:3300/v1/chart/' + chartType)
      .then((response) => {
        console.log(response.data.chartList);
        setChartList(response.data.chartList);
      })
      .catch((error) => {
        console.log(error);
      })
  };

  const drawList = useCallback(() => {
    console.log('drawList');

    const musicList = chartList.map((item) => {
      return (<MusicItem key={item.id} music={item}></MusicItem>);
    });

    return musicList;
  }, [chartList]);

  useEffect(() => {
    console.log('MusicListPage useEffect [chartType]: ' + chartType);

    const now = new Date();
    const hour = now.getHours() < 10 ? '0' + now.getHours() : now.getHours();
    const min = now.getMinutes() < 10 ? '0' + now.getMinutes() : now.getMinutes();
    const currentTimeStr = 
      now.getFullYear() + '년 ' + (now.getMonth() + 1) + '월 ' + now.getDate() + '일 ' + hour + ':' + min;

    setCurrentTime(currentTimeStr);

    if (chartType.length > 0) {
      loadItemList(chartType);
    }
  }, [chartType]);

  return (
    <table width='600px' border='0px'>
      <thead>
        <tr><td align='center' colSpan='4'><h1>음악 차트</h1></td></tr>
        <tr><td align='center' colSpan='4'>{currentTime}</td></tr>
      </thead>
      <tbody>
        <tr>
          <td colSpan='4'>
            <button 
              style={chartType === 'domestic' ? {fontWeight: 'bold', color: 'red', cursor: 'pointer'} : { cursor: 'pointer' }}
              onClick={() => handleSelectChart('domestic')}>
              국내
            </button>
            <button 
              style={chartType === 'overseas' ? {fontWeight: 'bold', color: 'red', cursor: 'pointer'} : { cursor: 'pointer' }}
              onClick={() => handleSelectChart('overseas')}>
              해외
            </button>
          </td>
        </tr>
        {chartList.length > 0  && drawList()}
      </tbody>
    </table>
  );
}

export default MusicListPage;