import React, { Component } from 'react';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import Main from '../templates/Main';
import mapboxgl from 'mapbox-gl';
import { NavLink } from 'react-router-dom';
import Nav from 'react-bootstrap/Nav';

import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { createReport } from '../../store/actions/reportActions';

import './Map.css';

require('dotenv').config();

mapboxgl.accessToken = process.env.REACT_APP_HISTORIANSGROUP_MAP;

const headerProps = {
  title: 'Heritage in Danger'
}

class Map extends Component {
  state = {
    report: {
      title: '',
      location: '',
      type: '',
      description: '',
    },
    lng: - 0.118092,
    lat: 51.509865,
    zoom: 6,
    disabled: true,
    emailSent: null
  };

  componentDidMount() {
    const { auth } = this.props
    // console.log(auth);
    if (!auth.uid || !auth.emailVerified) return;
    const map = new mapboxgl.Map({
      container: 'map',
      style: "mapbox://styles/mapbox/streets-v11",
      center: [this.state.lng, this.state.lat],
      zoom: this.state.zoom
    });

    const geocoder = new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
      placeholder: 'Location',
      mapboxgl: mapboxgl
    });
    document.getElementById('location').appendChild(geocoder.onAdd(map));

    // add navigation control (zoom buttons)
    map.addControl(new mapboxgl.NavigationControl(), "bottom-right");

    // Add geolocate control to the map.
    map.addControl(
      new mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true
        },
        trackUserLocation: true
      })
    );

    // Listen for the `result` event from the Geocoder
    // `result` event is triggered when a user makes a selection
    //  Add a marker at the result's coordinates and retrieve location data
    geocoder.on('result', (e) => {
      map.getSource('single-point').setData(e.result.geometry);
      this.setState({
        report: {
          ...this.state.report,
          location: e.result.place_name
        }
      });
    })

    // update the lng, lat and zoom
    map.on('move', () => {
      this.setState({
        lng: map.getCenter().lng.toFixed(4),
        lat: map.getCenter().lat.toFixed(4),
        zoom: map.getZoom().toFixed(2)
      });
    });

    map.on('load', function () {
      map.addSource('single-point', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: []
        }
      });

      map.addLayer({
        id: 'point',
        source: 'single-point',
        type: 'circle',
        paint: {
          'circle-radius': 10,
          'circle-color': 'red'
        }
      });
    });

    // clean up on unmount
    return () => map.remove();
  }

  updateFields = (event) => {
    this.setState({
      report: {
        ...this.state.report,
        [event.target.id]: event.target.value,
      }
    })
  }

  handleClick = (event) => {
    // prevent default action from submitting - prevent to refresh the page
    event.preventDefault();
    if (this.state.report.title && this.state.report.location && this.state.report.type && this.state.report.description !== '') {
      this.props.createReport(this.state);
      this.setState({
        disabled: true,
        emailSent: false
      })
    } else {
      alert("All fields most be fielded.");
    }
  }

  renderForm() {
    return (
      <div className='form pb-2'>
        <div className="row">
          <div className="col-12">
            <div className="form-group">
              <input className='form-control' type='text' id='title' autoComplete='off' onChange={this.updateFields} required />
              <label className='form-label' htmlFor='title'>
                <span className='content-name'>Title</span>
              </label>
            </div>
            <div className='row'>
              <div className="geocoder col-12 col-lg-6 d-inline-block p-3" id="location" onChange={this.updateFields} required />
              <div className="form-group col-12 col-lg-6 d-flex align-items-center p-3">
                <select defaultValue='Choose a Type...' className='p-1' name="type" id="type" onChange={this.updateFields} required>
                  <option disabled="disabled">Choose a Type...</option>
                  <option value="Monument">Monument</option>
                  <option value="Site">Site</option>
                  <option value="Building">Building</option>
                  <option value="Object">Object</option>
                  <option value="Archeological site">Archeological site</option>
                </select>
              </div>
            </div>
            <div className="form-textarea">
              <textarea placeholder='Describe what you have discovered...' rows='8' className='textarea-input' style={{ resize: 'none' }}
                id='description' onChange={this.updateFields} required />
            </div>
          </div>
        </div>
        <hr />
        <div className="row">
          <div className="col-12 d-flex justify-content-end">
            <div className='pt-2 pr-2'>
              {this.state.emailSent === null && <p className='success-msg'>Email Report Sent!</p>}
              {this.state.emailSent === false && <p className='err-msg'>Email Report Not Sent.</p>}
            </div>
            <button className="btn-input" onClick={this.handleClick}>
              Send
              </button>
          </div>
        </div>
      </div>
    )
  }

  render() {
    const { auth } = this.props
    if (!auth.uid && !auth.emailVerified) return <Redirect to="/" />
    if (!auth.emailVerified) return <Redirect to="/verifyemail" />

    return (
      <Main {...headerProps}>
        <div className='container'>
          <Nav className='m-auto'>
            <Nav.Link eventKey='0' as={NavLink} to='/dashboard'>
              <i className='fa fa-undo' aria-hidden="true"></i> Back
          </Nav.Link>
          </Nav>
          <h2 className='text-right'>Create a new report</h2>
          <div className='row'>
            <div className='map-container col-lg-6'>
              <div className='side-bar'>
                Longitude: {this.state.lng} | Latitude: {this.state.lat} | Zoom: {this.state.zoom}
              </div>
              <div id='map' />
            </div>
            <div className='col-lg-6'>
              {this.renderForm()}
            </div>
          </div>
        </div>
      </Main>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    auth: state.firebase.auth
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    createReport: (report) => dispatch(createReport(report))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Map);
