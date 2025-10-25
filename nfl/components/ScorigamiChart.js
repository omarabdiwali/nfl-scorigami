import { useState, useEffect } from 'react';
import { ScatterChart } from '@mui/x-charts/ScatterChart';
import { CustomMarker, CustomTooltip, getChartData, valueToColor } from '@/utils/chartOptions';

export default function ScorigamiChart() {
  const [series, setSeries] = useState();
  const [loading, setLoading] = useState(true);
  const [chartSize, setChartSize] = useState({});

  const translateDocs = (docs) => {
    const seriesData = [];
    for (const doc of docs) {
      const series = {};
      const data = addData(doc);
      series.color = valueToColor(data.count, 1, 90);
      series.data = [data];
      seriesData.push(series);
    }
    return seriesData;
  }

  const addData = (doc) => {
    const data = {};
    const scores = doc.score.split("-");
    data.y = parseInt(scores.at(0));
    data.x = parseInt(scores.at(1));
    data.count = doc.count;
    data.lastTime = doc.date;
    data.versus = doc.versus;
    data.id = doc.score;
    return data;
  }

  useEffect(() => {
    const handleResize = () => {
      setChartSize({ 
        width: Math.min(650, window.innerWidth * 0.9),
        height: Math.min(650, window.innerWidth * 0.9)
      })
    }
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    }
  }, [])

  useEffect(() => {
    const localData = getChartData();
    if (localData.length == 0) {
      fetch("/api/games").then(res => res.json()).then((data) => {
        const series = translateDocs(data.result);
        localStorage.setItem("nflChartData", JSON.stringify(series));
        localStorage.setItem("nflChartDate", new Date().toISOString());
        setSeries(series);
        setLoading(false);
        setChartSize({ 
          width: Math.min(650, window.innerWidth * 0.9),
          height: Math.min(650, window.innerWidth * 0.9)
        })
      })
    } else {
      setSeries(localData);
      setLoading(false);
      setChartSize({ 
        width: Math.min(650, window.innerWidth * 0.9),
        height: Math.min(650, window.innerWidth * 0.9)
      })
    }
  }, [])

  if (loading) {
    return (
      <div className='mt-20 flex flex-col items-center justify-items-center'>
        <div>Loading...</div>
      </div>
    )
  }

  return (
    <ScatterChart
      className='mt-6'
      height={chartSize.height}
      width={chartSize.width}
      voronoiMaxRadius={10}
      slots={{ marker: CustomMarker, tooltip: CustomTooltip }}
      grid={{ horizontal: true, vertical: true }}
      series={series}
      yAxis={[{ 
        label: 'Winner', 
        labelStyle: { fill: 'white' }, 
        tickLabelStyle: { fill: 'white' },
        zoom: true
      }]}
      xAxis={[{ 
        label: 'Loser', 
        labelStyle: { fill: 'white' }, 
        tickLabelStyle: { fill: 'white' },
        zoom: true
      }]}
    />
  )
}