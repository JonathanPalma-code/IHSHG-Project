import React, { Component } from 'react';
import Axios from 'axios';
import Main from '../templates/Main';

const headerProps = {
  icon: 'users',
  title: 'Users Details'
}

const baseURL = 'http://localhost:3001/users';
const initialState = {
  user: { id: '', firstName: '', lastName: '', email: '' },
  list: []
}

export default class UserCrud extends Component {
  
  state = { ...initialState }
  
  constructor(props) {
    super(props);
    this.clear = this.clear.bind(this);
    this.save = this.save.bind(this);
    this.updateField = this.updateField.bind(this);
  }
  
  componentDidMount() {
    Axios(baseURL).then(resp => {
      this.setState({ list: resp.data });
    });
  }

  clear() {
    this.setState({
      user: initialState.user
    })
  }

  save() {
    const user = this.state.user;
    const method = user.id ? 'put' : 'post';
    const url = user.id ? `${baseURL}/${user.id}` : baseURL;
    Axios[method](url, user)
      .then(resp => {
        const list = this.getUpdatedList(resp.data)
        this.setState({ user: initialState.user, list })
      });
  }

  getUpdatedList(user, add = true) {
    const list = this.state.list.filter(u => u.id !== user.id);
    if(add) list.unshift(user); // put the elem to the 1st index of the array
    return list;
  }

  updateField(event) {
    const user = {...this.state.user };
    // this will get both fields (id, name and email)
    user[event.target.name] = event.target.value; 
    this.setState({ user }); 
  }

  renderForm() { // build the User Form
    return (
      <div className="form mt-5">
        <div className="row">
          <div className="col-12 col-md-6">
            <div className="form-group">
              <label>First Name:</label>
              <input type='text' className='form-control'
                name='firstName'
                value={this.state.user.firstName}
                onChange={this.updateField} />
            </div>
          </div>
          <div className="col-12 col-md-6">
            <div className="form-group">
              <label>Last Name:</label>
              <input type='text' className='form-control'
                name='lastName'
                value={this.state.user.lastName}
                onChange={this.updateField} />
            </div>
          </div>
          <div className="col-12 col-md-6">
            <div className="form-group">
              <label>Email:</label>
              <input type='text' className='form-control'
                name='email'
                value={this.state.user.email}
                onChange={this.updateField} />
            </div>
          </div>
        </div>
        <hr />
        <div className="row">
          <div className="col-12 d-flex justify-content-end">
            <button className="btn btn-primary"
              onClick={this.save}>
              Save
            </button>
            <button className="btn btn-secondary ml-2"
              onClick={this.clear}>
              Clear
            </button>
          </div>
        </div>
      </div>
    )
  }

  update(user) {
    this.setState({ user });
  }

  remove(user) {
    Axios.delete(`${baseURL}/${user.id}`).then(resp => {
      const list = this.getUpdatedList(user, false);
      this.setState({ list });
    })
  }

  renderTable() { //Build a User Table
    return (
      <div className="table-responsive">
        <table className="table mt-4">
          <thead>
            <tr>
              <th>Id</th>
              <th>Name</th>
              <th>Email</th>
            </tr>
          </thead>
          <tbody>
            {this.renderRows()}
          </tbody>
        </table>
      </div>
    )
  }

  renderRows() {
    // display list by Id descending order
    const list = this.state.list.sort((a, b) => 
      b.id - a.id);
      
    return list.map(user => {
      return (
        <tr key={user.id}>
          <td>{user.id}</td>
          <td>{`${user.firstName} ${user.lastName}`}</td>
          <td>{user.email}</td>
          <td>
            <button className="btn btn-warning"
              onClick={() => this.update(user)}>
              <i className='fa fa-pencil'></i>
            </button>
          </td>
          <td>
            <button className="btn btn-danger ml-2"
              onClick={() => this.remove(user)}>
              <i className="fa fa-trash"></i>
            </button>
          </td>
        </tr>
      )
    })
  }

  render() {
    return (
      <Main {...headerProps}>
        {this.renderTable()}
        {this.renderForm()}
      </Main>
    )
  }
}
