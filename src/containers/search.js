import React from 'react';
import {connect} from 'react-redux';
import {Button, FormGroup, FormControl, ControlLabel, HelpBlock} from 'react-bootstrap';
import {findCar, getMakes, getModels} from '../actions/index';


class Search extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedMake: '',
      selectedModel: '',
      selectedModelId: '',
      message: ''
    };
  }
  
  componentDidMount() {
    this.props.dispatch(getMakes());
  }
  
  
  renderOptions(optionItem) {
    let {id, name} = optionItem;
    return (
      <option key={id} data-id={id} value={name}>{name}</option>
    )
  }
  
  validate(e) {
    e.preventDefault();
    let {selectedMake, selectedModel, selectedModelId} = this.state;
    if (selectedMake === '') {
      this.setState({...this.state, message: 'Select a car make'});
    }
    else if (selectedModel === '') {
      this.setState({...this.state, message: 'Select a car model'});
    }
    else {
      this.setState({...this.state, message: ''});
      findCar(selectedMake, selectedModel, selectedModelId)
    }
  }
  
  handleChange(e) {
    let newValue = e.target.value;
    let key = e.target.id;
    if (key === 'selectedMake') {
      let makeObj = this.props.currentMakes.find((make) => {
        return make.name === newValue;
      });
      this.props.dispatch(getModels(makeObj.id));
      this.setState({...this.state, [key]: newValue});
    }
    else if (key === 'selectedModel') {
      let modelObj = this.props.currentModels.find((model) => {
        return model.name === newValue;
      });
      this.setState({...this.state, [key]: newValue, selectedModelId: modelObj.id});
    }
    else {
      this.setState({...this.state, [key]: newValue});
    }
  }
  
  render() {
    // console.log(this.state);
    return (
      <div>
        <div className="row">
          <div className="col-sm-12 col-md-6 col-md-offset-3">
            <form onSubmit={this.validate.bind(this)}>
              <FormGroup controlId="selectedMake">
                <ControlLabel>Car make:</ControlLabel>
                <FormControl
                  defaultValue="placeholder"
                  componentClass="select"
                  onChange={this.handleChange.bind(this)}
                >
                  <option value="placeholder" disabled>Select</option>
                  {this.props.currentMakes.map(this.renderOptions)}
                </FormControl>
              </FormGroup>
              <FormGroup controlId="selectedModel">
                <ControlLabel>Car model:</ControlLabel>
                <FormControl
                  disabled={!this.state.selectedMake}
                  componentClass="select"
                  defaultValue="placeholder"
                  onChange={this.handleChange.bind(this)}
                >
                  <option value="placeholder" disabled>Select</option>
                  {this.props.currentModels.map(this.renderOptions)}
                </FormControl>
              </FormGroup>
              {this.state.message && <HelpBlock>{this.state.message}</HelpBlock>}
              <Button
                disabled={!this.state.selectedMake || !this.state.selectedModel}
                block
                bsStyle="danger"
                id="submit"
                type="submit"
              >
                Search
              </Button>
            </form>
          </div>
        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    currentMakes: state.cars.currentMakes,
    currentModels: state.cars.currentModels
  }
}

export default connect(mapStateToProps, null)(Search);