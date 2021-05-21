import React from 'react'
import styled from 'styled-components';
import { Icon } from '@iconify/react-with-api';

export const ValueButton = (props) => {
    return (
        <StyledValueBtn id={props.id} onClick={props.setGraphDataOnClick} style={props.selectedValue === props.id ? { background: "#6D8EB1" } : {}}>
			<Row>
				<Icon pointerEvents="none" icon={props.icon} style={{ width: "40px", height: "40px" }} />
			</Row>
			<Row>
				{props.id}
			</Row>
			<Row>
				{props.valueText}{props.value}
			</Row>
		</StyledValueBtn>
    );
}

const media = {
    xs: (styles) => `
        @media only screen and (max-width: 480px) {
            ${styles}
        }
    `,
    m: (styles) => `
        @media only screen and (max-width: 1024px) {
            ${styles}
        }
    `,
}

const Row = styled.div`
    display: flex;
    flex-flow: wrap;
    gap: 12px;
    justify-content: center ${(props) => props.justify};
    ${(props) => props.colwrap && media[props.colwrap](`
        flex-flow: column wrap;
    `)};
    min-height: ${(props) => props.minheight}px;
    align-items: ${(props) => props.align};
`;

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