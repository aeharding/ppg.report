import logo from './logo.svg';
import './App.css';
import styled from '@emotion/styled';

// API: https://gcl2qf85g3.execute-api.us-east-2.amazonaws.com/?data_source=Op40&latest=latest&start_year=2021&start_month_name=Aug&start_mday=20&start_hour=21&start_min=0&n_hrs=1.0&fcst_len=shortest&airport=MSN&text=Ascii%20text%20%28GSL%20format%29&hydrometeors=false&start=latest
const TimeHolder = styled.div`
  display: grid;
grid-gap: 16px;
padding: 16px;
grid-template-columns: repeat(auto-fill,minmax(160px,1fr));
grid-auto-flow: column;
grid-auto-columns: minmax(160px,1fr);
overflow-x: auto;
`

const Time = styled.div`
  height: 300px;
  border: 10px solid blue;
  scroll-snap-align: center;
`
function App() {
  return (
    <div className="App">
      <TimeHolder>
      <Time />
      <Time />
      <Time />
      <Time />
      <Time />
      </TimeHolder>
    </div>
  );
}

export default App;
