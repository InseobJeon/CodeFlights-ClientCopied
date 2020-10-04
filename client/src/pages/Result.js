import React from 'react';
import './Result.css';
import { connect } from 'react-redux';
import * as planCheck from '../modules/destinations';
import * as plan from '../modules/plan';
import axios from 'axios';
import * as travelActions from '../modules/travel';
import { CircularProgress } from '@material-ui/core';

class Result extends React.Component {
  constructor(props) {
    super(props);

    this.state = { inload: false };
  }

  planToGo = (city) => {
    this.setState({ inload: true });
    axios
      .post('https://codeflights.xyz/search/result/destination', { city: city })
      .then((res) => {
        this.props.getPlan(res.data);
        localStorage.plan = JSON.stringify(res.data);
        this.props.loaded(city);
      });
  };
  componentDidMount() {
    this.props.start();
  }
  render() {
    let destination = this.props.place;
    if (destination.length === 0) {
      destination = JSON.parse(localStorage.destinations);
    }
    let city = destination.map((ele) => (
      <div onClick={() => this.planToGo(ele.destinations)}>
        {this.props.load && this.props.city === ele.destinations ? (
          this.props.history.push(`/result/${this.props.city}`)
        ) : (
          <div
            className='where focus'
            style={{ backgroundImage: `url(${ele.img})` }}
          >
            <div className='titlelayer'>
              <h2 className='cityname'>{ele.destinations}</h2>
            </div>
          </div>
        )}
      </div>
    ));

    return (
      <div className='result'>
        <div className='result-container'>
          {this.state.inload && (
            <div className='Circular'>
              <CircularProgress />
            </div>
          )}
          <p className='result-title'>
            방문 가능한 {destination.length}개의 도시
          </p>
          <div className='cities'>{city}</div>
        </div>
      </div>
    );
  }
}

export default connect(
  (state) => ({
    place: state.destinations.place,
    flights: state.plan.flights,
    blogPostings: state.plan.blogPostings,
    userPostings: state.plan.userPostings,
    load: state.plan.load,
    city: state.plan.city,
    isLoad: state.travel.isLoad,
  }),
  (dispatch) => ({
    destinationsCheck: (data) => dispatch(planCheck.destinationsCheck(data)),
    getPlan: (data) => dispatch(plan.getPlan(data)),
    loaded: (data) => dispatch(plan.loaded(data)),
    start: () => dispatch(travelActions.whenIsDepDate()),
  })
)(Result);
