import React from 'react';
import Styled from 'styled-components';
import { Link } from 'react-router-dom';
import { Icon } from '@iconify/react-with-api';
import { Grid, Row, HeaderCol, HeaderRow } from '../ui/Grid';

export const Header = (props) => {
	return (
		<StyledHeader>
			<Grid align="center">
				<HeaderRow width={70} align="baseline" justify="center">
					<HeaderCol size={1} textAlign="left">
						<h1>BrewMES</h1>
					</HeaderCol>
					<HeaderCol size={2}>
						<Row justify="center">
							<StyledLink to="/">Home</StyledLink>
							<StyledLink to="/control">Control</StyledLink>
							<StyledLink to="/batch">Batches</StyledLink>
							<StyledLink to="/schedule">Schedule</StyledLink>
						</Row>
					</HeaderCol>
					<HeaderCol size={1} align="flex-end" textAlign="right">
						<p>
							{props.currentMachine.ip === "none" ? "Disconnected": props.currentMachine.name}
							{' '}
							<Icon 	icon="bi:circle-fill" 
									color={props.currentMachine.ip === "none" ? "#b8352c" : "#2cb833"}
									width="16"
									style={{transform: "translateX(0px) translateY(2px)"}}
							/>
						</p>
					</HeaderCol>
				</HeaderRow>
			</Grid>
		</StyledHeader>
	);
}

const StyledHeader = Styled.header`
	-webkit-box-shadow: 0px 0px 10px 2px rgba(0, 0, 0, 0.1);
	box-shadow: 0px 0px 10px 2px rgba(0, 0, 0, 0.1);  
    background: #fff;
    color: #000;
	border-bottom: 1px solid black;
	width: 100%;
	align-items: center;
`

const StyledLink = Styled(Link)`
	font-size: 1.1em;
	color: #000;
	text-decoration: none;
	align-items: ${(props) => props.align};
`