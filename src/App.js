import React, { Component } from 'react';
import Styled from 'styled-components';
import { BrowserRouter as Router, Route} from 'react-router-dom';
import { Header } from "./components/header/Header";
import { Batches } from "./components/views/batchview/Batches";
import { Scheduling } from './components/views/scheduleview/Scheduling';
import { Home } from './components/views/homeview/Home';
import { Control } from './components/views/controlview/Control';
import { Grid, Row, Col } from './components/ui/Grid';
import './App.css';

export class App extends Component {
	//This is the global state that contains variables relevant to multiple components
	state = { 
		currentMachine: {
			ip: "none",
			id: "",
			name: "",
			autobrewing: false
		},
		updated: false
	};
	
	updateMachineList = () => {
		this.setState({updated: true});
	}

	//Function to save the newly selected currentMachine in the state.
	setCurrentMachine = (machine) => {
		this.setState({ currentMachine: machine });
	}

	//Contains the HTML that is to be rendered for the user
	//This really just contains references to all the different components
	render() {
		return (
			<Router>
				<Grid width={100}>
					<Col size={1} justify="center">
						<Row justify="center">
							<Header 
								currentMachine={this.state.currentMachine}
							/>
						</Row>
						<Row justify="center">
							<Container>
								
								<Route exact path="/" render={props => (
									<Home 
										currentMachine={this.state.currentMachine}
										setCurrentMachine = {this.setCurrentMachine}
									/>
								)} />

								<Route exact path="/batch" render={props => (
									<Batches/>
								)} />

								<Route exact path="/control" render={props => (
									<Control
										currentMachine={this.state.currentMachine}
										setCurrentMachine = {this.setCurrentMachine}
									/>
								)} />

								<Route exact path="/schedule" render={props => (
									<Scheduling/>
								)} />

							</Container>						
						</Row>
					</Col>
				</Grid>
			</Router>
		)
	}
}

export default App


export const Container = Styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	width: 70%;
	padding-top: 20px;

	@media only screen and (max-width: 1500px) {
		width: 80%;
	}

	@media only screen and (max-width: 1100px) {
		width: 90%;
	}

	/* @media only screen and (max-width: 800px) {
		width: 95%;
	} */

`

