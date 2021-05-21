import React from 'react'
import styled from 'styled-components';
import { Icon } from '@iconify/react-with-api';
import { Row } from './Grid'

export const ValueButton = (props) => {
    return (
        <StyledValueBtn id={props.id} onClick={props.setGraphDataOnClick} style={props.selectedValue === props.id ? { background: "#6D8EB1" } : {}}>
			<Row justify="center">
				<Icon pointerEvents="none" icon={props.icon} style={{ width: "40px", height: "40px" }} />
			</Row>
			<Row justify="center">
				{props.id}
			</Row>
			<Row justify="center">
				{props.valueText}{props.value}
			</Row>
		</StyledValueBtn>
    );
}

const StyledValueBtn = styled.div`
    height: 100%;
    width: 100%;
    background-color: #EFEFEF;
    user-select: none;
	padding: 8px 12px;
    
    &:hover {
        cursor: pointer;
        background-color: #D6D6D6;
    }
`;