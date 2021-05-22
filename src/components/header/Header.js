import React from 'react';
import Styled from 'styled-components';
import { Link, useLocation } from 'react-router-dom';
import { Icon } from '@iconify/react-with-api';
import { Grid, Row, HeaderCol, HeaderRow } from '../ui/Grid';

export const Header = (props) => {
	return (
		<StyledHeader>
			<Grid align="center">
				<HeaderRow align="baseline" justify="center">
					<HeaderCol size={1} textAlign="left">
						<h1>BrewMES</h1>
					</HeaderCol>
					<HeaderCol size={2}>
						<Row justify="center" gap={20}>
							<StyledLink to="/" style={{textDecoration: useLocation().pathname === "/" ? "underline" : "none"}}>Home</StyledLink>
							<StyledLink disabled to={props.currentMachine.ip === "none" ? "#" : "/control"} style={{textDecoration: useLocation().pathname === "/control" ? "underline" : "none"}}>Control</StyledLink>
							<StyledLink to="/batch" style={{textDecoration: useLocation().pathname === "/batch" ? "underline" : "none"}}>Batches</StyledLink>
							<StyledLink to="/schedule" style={{textDecoration: useLocation().pathname === "/schedule" ? "underline" : "none"}}>Schedule</StyledLink>
						</Row>
					</HeaderCol>
					<HeaderCol size={1} align="flex-end" textAlign="right">
						<p>
							{props.currentMachine.ip === "none" ? "Disconnected": props.currentMachine.name}
							{' '}
							<Icon 	icon="bi:circle-fill" 
									color={props.currentMachine.ip === "none" ? "#E84855" : "#7CDF87"}
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