import React from 'react'
import styled from 'styled-components';
import { Icon } from '@iconify/react-with-api';
import { Row } from './Grid.js'

export const DataDiv = (props) => {
    return (
        <StyledValueDiv>
            <Row justify="center">
                <Icon icon={props.icon} style={{ width: "40px", height: "40px" }} />
            </Row>
            <Row justify="center">
                {props.id}
            </Row>
            <Row justify="center">
                {props.valueText}{props.value}
            </Row>
        </StyledValueDiv>
    );
}

const StyledValueDiv = styled.div`
    height: 100%;
    width: 100%;
    padding: 13.2px 12px;
    background-color: #EFEFEF;
    user-select: none;
`;