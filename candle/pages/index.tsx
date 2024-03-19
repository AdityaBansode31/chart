import { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import dynamic from 'next/dynamic'; // Import dynamic from Next.js

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false }); // Dynamic import for ApexCharts

const Index = ({ initialData }) => {
  const [data, setData] = useState(initialData);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/data1.xlsx'); // Adjust the endpoint to match your file location
        const blob = await response.blob();
        const reader = new FileReader();
        reader.onload = function (e) {
          const workbook = XLSX.read(new Uint8Array(e.target.result), { type: 'array' });
          const sheetName = workbook.SheetNames[0];
          const sheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
          setData(jsonData);
        };
        reader.readAsArrayBuffer(blob);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    // Fetch data only on the client-side if it's not available
    if (!initialData.length) {
      fetchData();
    }
  }, []);

  const candlestickData = data.slice(1).map(row => ({
    x: new Date(row[0]).getTime(), // Convert date to milliseconds
    y: [row[1], row[2], row[3], row[4]], // Open, High, Low, Close
    color: row[4] >= row[1] ? '#4caf50' : '#f44336' // Green for positive change, red for negative change
  }));

  const volumeData = data.slice(1).map(row => ({
    x: new Date(row[0]).getTime(), // Convert date to milliseconds
    y: row[9], // Volume
    color: row[4] >= row[1] ? '#4caf50' : '#f44336' // Green for positive change, red for negative change
  }));

  const rsiData = data.slice(1).map(row => ({
    x: new Date(row[0]).getTime(), // Convert date to milliseconds
    y: row[8], // RSI
  }));

  
  const ema4Data = data.slice(1).map(row => ({
    x: new Date(row[0]).getTime(), // Convert date to milliseconds
    y: row[5], // EMA4
  }));

  const ema9Data = data.slice(1).map(row => ({
    x: new Date(row[0]).getTime(), // Convert date to milliseconds
    y: row[6], // EMA9
  }));

  const ema12Data = data.slice(1).map(row => ({
    x: new Date(row[0]).getTime(), // Convert date to milliseconds
    y: row[7], // EMA12
  }));

  const options = {
    chart: {
      height: 500, // Increase the height to 500 (or any desired value)
      toolbar: {
        show: false // Hide the toolbar
      }
    },
    title: {
      text: 'Candlestick Chart with Volume and RSI',
      align: 'center'
    },
    xaxis: {
      type: 'datetime',
      min: new Date('2024-03-13T09:15:00').getTime(), // Set the minimum value of x-axis to 09:15:00
      max: new Date('2024-03-13T13:03:00').getTime(), // Set the maximum value of x-axis to 13:03:00
      labels: {
        formatter: function(val) {
          return new Date(val).toLocaleTimeString('en-US', { hour12: false }); // Format x-axis labels as time
        }
      }
    },
    yaxis: [
      {
        tooltip: {
          enabled: true
        },
        labels: {
          style: {
            colors: '#4caf50' // Green color for candlestick labels
          }
        }
      },
      {
        opposite: true,
        title: {
          text: 'Volume'
        },
        labels: {
          style: {
            colors: '#f44336' // Red color for volume labels
          }
        }
      }
    ],
    plotOptions: {
      column: {
        barWidth: '80%', // Adjust the width of the volume columns (80% of available space)
      }
    }
  };

const optionsEMA = {
  chart: {
    height: 200, // Set the height of the EMA chart
    toolbar: {
      show: false // Hide the toolbar
    }
  },
  markers: {
    size: 0,
  },
      xaxis: {
    type: 'datetime',
    min: new Date('2024-03-13T09:15:00').getTime(), // Set the minimum value of x-axis to 09:15:00
    max: new Date('2024-03-13T13:03:00').getTime(), // Set the maximum value of x-axis to 13:03:00
    labels: {
      formatter: function(val) {
        return new Date(val).toLocaleTimeString('en-US', { hour12: false }); // Format x-axis labels as time
      }
    }
  },
  yaxis: {
    title: {
      text: 'EMA'
    }
  }
};

  const series = [
    {
      name: 'Candlesticks',
      type: 'candlestick',
      data: candlestickData
    },
    {
      name: 'Volume',
      type: 'column',
      data: volumeData.map(item => ({
        x: item.x,
        y: item.y
      })),
      yAxisIndex: 1 // Associate with the second y-axis (volume)
    },

   
  ];

  const rsiOptions = {
    chart: {
      height: 200, // Set the height of the RSI chart
      toolbar: {
        show: false // Hide the toolbar
      }
    },
    xaxis: {
      type: 'datetime',
      min: new Date('2024-03-13T09:15:00').getTime(), // Set the minimum value of x-axis to 09:15:00
      max: new Date('2024-03-13T13:03:00').getTime(), // Set the maximum value of x-axis to 13:03:00
      labels: {
        formatter: function(val) {
          return new Date(val).toLocaleTimeString('en-US', { hour12: false }); // Format x-axis labels as time
        }
      }
    },
    yaxis: {
      title: {
        text: 'RSI'
      },
      labels: {
        style: {
          colors: '#2196f3' // Blue color for RSI labels
        }
      }
    }
  };

  const rsiSeries = [
    {
      name: 'RSI',
      type: 'line',
      data: rsiData.map(item => ({
        x: item.x,
        y: item.y
      }))
    }
  ];

const seriesEMA = [
  {
    name: 'EMA 4',
    type: 'line',
    data: ema4Data,
    stroke: {
      width: 0.05 // Adjust the thickness of the line (2px in this example)
    }
  },
  {
    name: 'EMA 9',
    type: 'line',
    data: ema9Data,
    stroke: {
      width: 0.05 // Adjust the thickness of the line (2px in this example)
    }
  },
  {
    name: 'EMA 12',
    type: 'line',
    data: ema12Data,
    stroke: {
      width: 0.05 // Adjust the thickness of the line (2px in this example)
    }
  }
  
];

  return (
    <div>
      <Chart options={options} series={series} type="candlestick" height={500} />
      <Chart options={rsiOptions} series={rsiSeries} type="line" height={200} /> 
      <Chart options={optionsEMA} series={seriesEMA} type="line" height={200} />
    </div>
  );
};

export async function getServerSideProps() {
  const filePath = './public/data1.xlsx';
  const workbook = XLSX.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const initialData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

  return {
    props: {
      initialData,
    },
  };
}

export default Index;


// import { useState, useEffect } from 'react';
// import * as XLSX from 'xlsx';
// import dynamic from 'next/dynamic'; // Import dynamic from Next.js

// const Chart = dynamic(() => import('react-apexcharts'), { ssr: false }); // Dynamic import for ApexCharts

// const Index = ({ initialData }) => {
//   const [data, setData] = useState(initialData);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await fetch('/data1.xlsx'); // Adjust the endpoint to match your file location
//         const blob = await response.blob();
//         const reader = new FileReader();
//         reader.onload = function (e) {
//           const workbook = XLSX.read(new Uint8Array(e.target.result), { type: 'array' });
//           const sheetName = workbook.SheetNames[0];
//           const sheet = workbook.Sheets[sheetName];
//           const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
//           setData(jsonData);
//         };
//         reader.readAsArrayBuffer(blob);
//       } catch (error) {
//         console.error('Error fetching data:', error);
//       }
//     };

//     // Fetch data only on the client-side if it's not available
//     if (!initialData.length) {
//       fetchData();
//     }
//   }, []);

//   const candlestickData = data.slice(1).map(row => ({
//     x: new Date(row[0]).getTime(), // Convert date to milliseconds
//     y: [row[1], row[2], row[3], row[4]], // Open, High, Low, Close
//     color: row[4] >= row[1] ? '#4caf50' : '#f44336' // Green for positive change, red for negative change
//   }));

//   const volumeData = data.slice(1).map(row => ({
//     x: new Date(row[0]).getTime(), // Convert date to milliseconds
//     y: row[9], // Volume
//     color: row[4] >= row[1] ? '#4caf50' : '#f44336' // Green for positive change, red for negative change
//   }));

//   const ema4Data = data.slice(1).map(row => ({
//     x: new Date(row[0]).getTime(), // Convert date to milliseconds
//     y: row[5] // EMA 4
//   }));

//   const ema9Data = data.slice(1).map(row => ({
//     x: new Date(row[0]).getTime(), // Convert date to milliseconds
//     y: row[6] // EMA 9
//   }));

//   const ema12Data = data.slice(1).map(row => ({
//     x: new Date(row[0]).getTime(), // Convert date to milliseconds
//     y: row[7] // EMA 12
//   }));

//   const optionsCandlestick = {
//     chart: {
//       height: 500, // Increase the height to 500 (or any desired value)
//       toolbar: {
//         show: false // Hide the toolbar
//       }
//     },
//     title: {
//       text: 'Candlestick Chart with Volume and EMA',
//       align: 'center'
//     },
//         xaxis: {
//       type: 'datetime',
//       min: new Date('2024-03-13T09:15:00').getTime(), // Set the minimum value of x-axis to 09:15:00
//       max: new Date('2024-03-13T13:03:00').getTime(), // Set the maximum value of x-axis to 13:03:00
//       labels: {
//         formatter: function(val) {
//           return new Date(val).toLocaleTimeString('en-US', { hour12: false }); // Format x-axis labels as time
//         }
//       }
//     },
//     yaxis: [
//       {
//         tooltip: {
//           enabled: true
//         },
//         labels: {
//           style: {
//             colors: '#4caf50' // Green color for candlestick labels
//           }
//         }
//       },
//       {
//         opposite: true,
//         title: {
//           text: 'Volume'
//         },
//         labels: {
//           style: {
//             colors: '#f44336' // Red color for volume labels
//           }
//         }
//       }
//     ],
//     plotOptions: {
//       column: {
//         barWidth: '80%', // Adjust the width of the volume columns (80% of available space)
//       }
//     }
//   };

//   const optionsEMA = {
//     chart: {
//       height: 200, // Set the height of the EMA chart
//       toolbar: {
//         show: false // Hide the toolbar
//       }
//     },
//     markers: {
//       size: 0,
//     },
//         xaxis: {
//       type: 'datetime',
//       min: new Date('2024-03-13T09:15:00').getTime(), // Set the minimum value of x-axis to 09:15:00
//       max: new Date('2024-03-13T13:03:00').getTime(), // Set the maximum value of x-axis to 13:03:00
//       labels: {
//         formatter: function(val) {
//           return new Date(val).toLocaleTimeString('en-US', { hour12: false }); // Format x-axis labels as time
//         }
//       }
//     },
//     yaxis: {
//       title: {
//         text: 'EMA'
//       }
//     }
//   };

//   const seriesCandlestick = [
//     {
//       name: 'Candlesticks',
//       type: 'candlestick',
//       data: candlestickData
//     },
    
//     {
//       name: 'Volume',
//       type: 'column',
//       data: volumeData.map(item => ({
//         x: item.x,
//         y: item.y
//       })),
//       yAxisIndex: 1 // Associate with the second y-axis (volume)
//     },
    
//   ];

//   const seriesEMA = [
//     {
//       name: 'EMA 4',
//       type: 'line',
//       data: ema4Data,
//       stroke: {
//         width: 0.05 // Adjust the thickness of the line (2px in this example)
//       }
//     },
//     {
//       name: 'EMA 9',
//       type: 'line',
//       data: ema9Data,
//       stroke: {
//         width: 0.05 // Adjust the thickness of the line (2px in this example)
//       }
//     },
//     {
//       name: 'EMA 12',
//       type: 'line',
//       data: ema12Data,
//       stroke: {
//         width: 0.05 // Adjust the thickness of the line (2px in this example)
//       }
//     }
    
//   ];

//   return (
//     <div>
//       <Chart options={optionsCandlestick} series={seriesCandlestick} type="candlestick" height={500} />
//       <Chart options={optionsEMA} series={seriesEMA} type="line" height={200} />
//     </div>
//   );
// };

// export async function getServerSideProps() {
//   const filePath = './public/data1.xlsx';
//   const workbook = XLSX.readFile(filePath);
//   const sheetName = workbook.SheetNames[0];
//   const sheet = workbook.Sheets[sheetName];
//   const initialData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

//   return {
//     props: {
//       initialData,
//     },
//   };
// }

// export default Index;


