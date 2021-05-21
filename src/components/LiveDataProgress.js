import React from 'react'
import Styled from 'styled-components';
import { Grid, Col, Row } from './ui/Grid';

export const LiveDataProgress = (props) => {
	return (
		<Col size={1}>
			<Row>
				<label>{props.label}</label><br></br>
			</Row>
			<Row>
				<Bar value={props.data} max={props.max}></Bar>
			</Row>				

		</Col>
	);
}

export const LiveDataProgressVertical = (props) => {
	return (
		<Col size={1}>

			<Row>
				<label>{props.label}</label><br></br>
			</Row>
			<Row>
				<BarVertical value={props.data} max={props.max}></BarVertical>
			</Row>				

		</Col>
	);
}

const Bar = Styled.progress`
	-webkit-appearance: none;
	appearance: none;
	width: 100%;
	height: 20px;
	border: 1px solid black;

	&::-webkit-progress-value {
		background: #FFBF81;
	}

   	&::-webkit-progress-bar {
		background: #EFEFEF;
	}
`

const BarVertical = Styled(Bar)`
    transform: rotate(-90deg);
    -webkit-transform: rotate(-90deg); /*Webkit*/
    -moz-transform: rotate(-90deg); /*FireFox*/
`