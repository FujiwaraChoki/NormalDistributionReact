import logo from './logo.svg';
import './App.css';

import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'

import { useEffect, useState } from 'react';

function App() {
  const [value, setValue] = useState(5000);
  const [n, setN] = useState(5000);
  const [pdf, setPDF] = useState("1 / (Math.sqrt(2 * Math.PI)) * Math.exp(-Math.pow(value, 2) / 2)");
  const [cdf, setCDF] = useState("0.5 * (1 + erf(value / (Math.sqrt(2))))");

  let step = 1;
  let max = 100;
  let min = 0;
  let data = {};


  const randn_bm = (min, max, skew) => {
    var u = 0, v = 0;
    while (u === 0) u = Math.random(); //Converting [0,1) to (0,1)
    while (v === 0) v = Math.random();
    let num = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);

    num = num / 10.0 + 0.5; // Translate to 0 -> 1
    if (num > 1 || num < 0) num = randn_bm(min, max, skew); // resample between 0 and 1 if out of range
    num = Math.pow(num, skew); // Skew
    num *= max - min; // Stretch to fill range
    num += min; // offset to min
    return num;
  }

  const round_to_precision = (x, precision) => {
    var y = +x + (precision === undefined ? 0.5 : precision / 2);
    return y - (y % (precision === undefined ? 1 : +precision));
  }

  // Seed data with a bunch of 0s
  for (let j = min; j < max; j += step) {
    data[j] = 0;
  }

  // Create n samples between min and max
  for (let i = 0; i < n; i += step) {
    let rand_num = randn_bm(min, max, 1);
    let rounded = round_to_precision(rand_num, step)
    data[rounded] += 1;
  }

  // Count number of samples at each increment
  let hc_data = [];
  for (const [key, val] of Object.entries(data)) {
    hc_data.push({ "x": parseFloat(key), "y": val / n });
  }

  function erf(x) {
    // Constants
    const a1 = 0.254829592;
    const a2 = -0.284496736;
    const a3 = 1.421413741;
    const a4 = -1.453152027;
    const a5 = 1.061405429;
    const p = 0.3275911;

    // Sign of x
    const sign = x >= 0 ? 1 : -1;

    // Absolute value of x
    const absX = Math.abs(x);

    // Computation
    const t = 1 / (1 + p * absX);
    const y =
      1 -
      (((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t) *
      Math.exp(-absX * absX);
    return sign * y;
  }

  const pdf_data = [];
  for (const [key, val] of Object.entries(data)) {
    pdf_data.push({ "x": parseFloat(key), "y": eval(pdf) });
  }

  const cdf_data = [];
  for (const [key, val] of Object.entries(data)) {
    cdf_data.push({ "x": parseFloat(key), "y": eval(cdf) });
  }

  // Sort
  hc_data = hc_data.sort(function (a, b) {
    if (a.x < b.x) return -1;
    if (a.x > b.x) return 1;
    return 0;
  });

  const options = {
    title: {
      text: 'Normal Distribution'
    },

    yAxis: {
      title: {
        text: 'Percentage chance'
      }
    },

    xAxis: {
      ordinal: false
    },

    legend: {
      layout: 'vertical',
      align: 'right',
      verticalAlign: 'middle'
    },

    plotOptions: {
    },

    series: [
      {
        name: 'Percent chance',
        data: hc_data
      },
      /*{
        name: 'PDF',
        data: pdf_data,
      },
      {
        name: 'CDF',
        data: cdf_data,
      }
       */

    ],

    responsive: {
      rules: [{
        condition: {
          maxWidth: 500
        },
        chartOptions: {
          legend: {
            layout: 'horizontal',
            align: 'center',
            verticalAlign: 'bottom'
          }
        }
      }]
    }

  };

  return (
    <div className="App">
      <div className="container">
        <div className="chart-container">
          <HighchartsReact highcharts={Highcharts} options={options} />
        </div>
        <article class="l-design-widht">
          <div className="card card--inverted">
            <h2>
              <svg className="icon" aria-hidden="true">
                <use xlinkHref="#icon-coffee" href="#icon-coffee" />
              </svg>
              Values
            </h2>
            <label className="input">
              <input className="input__field" type="text" placeholder=" " value={n} onChange={(e) => {
                setN(Number(e.target.value));
                setValue(Number(e.target.value));
              }} />
              <span className="input__label">N:</span>
              <input type="range" value={value} onChange={(e) => {
                setValue(e.target.value)
                setN(e.target.value)
              }} max={10000} min={0} />
            </label>
          </div>

          {
            /*
            
            

          <div className="card card--inverted">
            <h2>
              PDF
            </h2>
            <label className="input">
              <input className="input__field" type="text" value={pdf} onChange={(e) => setPDF(e.target.value)} />
              <span className="input__label">PDF:</span>

            </label>
          </div>

          <div className="card card--inverted">
            <h2>
              CDF
            </h2>
            <label className="input">
              <input className="input__field" type="text" value={cdf} onChange={(e) => setCDF(e.target.value)} />
              <span className="input__label">CDF:</span>

            </label>
          </div>*/
          }

        </article>
      </div>
    </div >
  );
}

export default App;
