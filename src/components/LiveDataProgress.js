import React from 'react'
import styled from 'styled-components';

export const LiveDataProgress = (props) => {
	return (
		<div style={{width: "100%", display: "inline-flex", align: "center"}}>
			<div style={{width: "100%"}}>
				<label>{props.label}</label><br></br>
				<Bar style={{marginTop: "-10px", width: "100%"}} value={props.data} max={props.max}></Bar><br></br>
				<p style={{marginTop: "-25px"}}>{props.text}</p>
			</div>
		</div>
	);
}

const Bar = styled.progress`
	-webkit-appearance: none;
	appearance: none;
	width: 100%;
	height: 20px;
	border: 1px solid black;
	border-radius: 20px;

	&::-webkit-progress-value {
		background: #7AC8FF;
		border-radius: 20px;
	}

   	&::-webkit-progress-bar {
		background: #EFEFEF;
		border-radius: 20px;
	}
`