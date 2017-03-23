import React, { Component } from 'react';
import axios from 'axios';
import QRCode from 'qrcode-react';
import qr from 'qr-encode';
import ReactDOMServer from 'react-dom/server';
import Griddle from 'griddle-react';

export default class App extends Component {
  constructor(props) {
  super(props);

  this.state= {
    items: [],
    hasStarted: false,
    location: "22-1-A",
    upc: " ",
    qr: [
    //   {
    //   sku: '1',
    //   lot: '0',
    //   expDate: '1900-01-01T00:00:00.000Z',
    //   qty: 1
    // }
  ]
  }

  this.handleUpcChange = this.handleUpcChange.bind(this);
  this.handleSubmit = this.handleSubmit.bind(this);
}

  handleUpcChange(event) {
    this.setState({upc: event.target.value});
  }

  handleSubmit(event) {
    if(this.state.upc === "") {
      return;
    }

    axios.post('https://arcane-beyond-69327.herokuapp.com/addInventory', {
      upc: this.state.upc,
      location: this.state.location
    })
    .then(function(res) {
      axios.get(`https://arcane-beyond-69327.herokuapp.com/allInventory`)
      .then(res => {
        console.log(res.data);
        this.setState({items: res.data})
      });
    }.bind(this))
    .catch(function(err) {
      console.log(err);
    })


    this.setState({upc: ""});
    event.preventDefault();
  }

  componentDidMount() {
    axios.get(`https://arcane-beyond-69327.herokuapp.com/allInventory`)
    .then(res => {
      console.log(res.data);
      this.setState({items: res.data})
    });
  }

  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmit} className="margin-top">
          <div className="form-group row">
            <label for="example-text-input" className="col-2 col-form-label">UPC</label>
            <div className="col-10">
              <input className="form-control" type="text" value={this.state.upc} onChange={this.handleUpcChange} ></input>
            </div>
          </div>
        </form>
        <Griddle  results={this.state.items} resultsPerPage={50} tableClassName="table" showFilter={true} columns={['upc', 'location', 'qty']} showSettings={true}/>
      </div>
    );
  }
}
