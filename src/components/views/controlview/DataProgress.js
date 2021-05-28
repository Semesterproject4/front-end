import React from 'react'
import Styled from 'styled-components';
import { Col, Row } from '../../ui/Grid';

export const DataProgress = (props) => {
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