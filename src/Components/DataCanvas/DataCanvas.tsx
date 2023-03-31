import React, { Component, DetailedReactHTMLElement, createRef } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, ChartData, ChartOptions } from 'chart.js';
import Spinner from '../Spinner/Spinner';
import './DataCanvas.scss';

ChartJS.register(ArcElement, Tooltip, Legend);

// Define the props and state types
interface Props {
  counts: { cnnCount: number, foxCount: number, nytCount: number, reutersCount: number };
  initialized: boolean;
}

interface State {
  chartActive: boolean;
  chartData: {
    labels: string[],
    datasets: {
      label: string,
      data: number[],
      backgroundColor: string[],
      borderColor: string[],
      borderWidth: number,
    }[]
  }
  chartOptions: {
    responsive: boolean,
    maintainAspectRatio: boolean,
    plugins: {
      legend: {
        display: boolean,
      }
    },
  }
  initialized: boolean;
}

export default class DataCanvas extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      chartActive: false,
      initialized: false,
      chartData: {
        labels: ['CNN', 'Fox', 'NYT', 'Reuters'],
        datasets: [
          {
            label: 'Mentions',
            data: [
              0,
              0,
              0,
              0
            ],
            backgroundColor: [
              '#FFADAD',
              '#B6CEE2',
              '#FFC3AD',
              '#D7CBE1',
            ],
            borderColor: [
              '#A30000',
              '#2E5576',
              '#A32C00',
              '#5E4375',
            ],
            borderWidth: 2,
          },
        ],
      },
      chartOptions: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            display: true,
          },
        }
      },
    };
  }


  componentDidUpdate(prevProps: Props, prevState: State): void {
    console.log("prevProps: ", prevProps);
    console.log("prevState: ", prevState);
    console.log("this.props: ", this.props);
    console.log("this.state: ", this.state);


    // when initialized is true, set chartActive to true
    if (this.props.initialized === true && this.state.chartActive === false) {
      this.setState({ chartActive: true });
    }
    //when initialized is false, set chartActive to false
    if (this.props.initialized === false && this.state.chartActive === true) {
      this.setState({ chartActive: false });
    }
    //when initialized is true, update chartData
    if (this.props.counts !== prevProps.counts || this.props.initialized !== prevProps.initialized) {
      this.setState({
        chartData: {
          labels: ['CNN', 'Fox', 'NYT', 'Reuters'],
          datasets: [
            {
              label: 'Terms Appearances',
              data: [
                this.props.counts.cnnCount,
                this.props.counts.foxCount,
                this.props.counts.nytCount,
                this.props.counts.reutersCount
              ],
              backgroundColor: [
                '#FFADAD',
                '#B6CEE2',
                '#FFC3AD',
                '#D7CBE1',
              ],
              borderColor: [
                '#A30000',
                '#2E5576',
                '#A32C00',
                '#5E4375',
              ],
              borderWidth: 2,
            },
          ],
        },
        chartOptions: {
          responsive: true,
          maintainAspectRatio: true,
          plugins: {
            legend: {
              display: true,
            },
          },
        },
      });
    }
  }





  componentWillUnmount(): void {
    if (this.state.initialized === false) {
      this.setState({ chartActive: false });
    }
  }

  render() {
    let { initialized } = this.props;
    let { chartActive } = this.state;
    console.log("render init", initialized);
    console.log("render act", chartActive);

    return (
      <section id="dataCanvas-component">
        <h2 id="dataCanvas__header">
          Module-Visualizer
        </h2>
        <div className="data-canvas-wrapper">
          {chartActive ?
            <Pie data={this.state.chartData} options={this.state.chartOptions} />
            :
            <Spinner />
          }
        </div>
      </section>
    )
  }
}
