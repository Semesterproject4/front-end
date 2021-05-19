import React from 'react'
import { Link } from 'react-router-dom'
import { Icon } from '@iconify/react-with-api';
import styled from 'styled-components';

export const Header = (props) => {

	return (
		<Styledheader>
			<div>
				<h1>BrewMES</h1>
				<span>
					{props.currentMachine.ip === "none" ? "Disconnected": props.currentMachine.name}
					<Icon icon="bi:circle-fill" color={props.currentMachine.ip === "none" ? "#b8352c" : "#2cb833"} width="16" style={{transform: "translateX(2px) translateY(4px)"}}/>
				</span>
				<div>
					<Link style={{textDecoration: "none"}} to="/"><h2>Home</h2></Link>
					<Link style={{textDecoration: "none"}} to="/control"><h2>Control</h2></Link>
					<Link style={{textDecoration: "none"}} to="/batch"><h2>Batches</h2></Link>
					<Link style={{textDecoration: "none"}} to="/schedule"><h2>Schedule</h2></Link>
				</div> 
			</div>
		</Styledheader>
	);
}



const Styledheader = styled.header`
	-webkit-box-shadow: 0px 0px 10px 2px rgba(0, 0, 0, 0.1);
		box-shadow: 0px 0px 10px 2px rgba(0, 0, 0, 0.1);  
    background: #fff;
    color: #000;
	position: relative;
	height: 10%;
	border-bottom: 1px solid black;

	& div {
		width: 55%;
		margin: auto;
		height: 60px;
		padding: 5px;

		& h1 {
			text-align: left;
			margin-left: 0;
			margin-right: auto;
			width: 20%;
			margin-top: 0.2%;
		}

		& span {
			display: inline-flex;
			float: right;
			margin-top: -3.8%;
		}

		& div {
			display: flex;
  			justify-content: center;
			height: 35px;
			margin-top: -4.2%;
			float: center;

			& h2 {
				font-size: 1.0em;
				padding: 0px 8px;
				color: #000;
			}
		}
	}
`
