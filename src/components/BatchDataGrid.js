import React from 'react'
import styled from 'styled-components';
import { Icon } from '@iconify/react-with-api';
import { ValueButton } from './ValueButton';
import { DataDiv } from './DataDiv';

export const BatchDataGrid = (props) => {

    const generatePDF = () => {
        window.location.href = "http://localhost:8080/api/batches/" + props.selectedBatchID + "/pdf"
    };

    const setGraphDataOnClick = (e) => {
        let id = e.target.parentNode.id;
        props.setGraphData(id);
    };

    return (
        <Grid>
            <Row>
                <h3>Batch ID: {props.selectedBatchID}</h3>
            </Row>

            <Row colwrap="xs">

                <Col size={1}>
                    <ValueButton    setGraphDataOnClick={setGraphDataOnClick} 
                                    selectedValue={props.selectedValue}
                                    id={'Humidity'} icon={"carbon:rain-drop"}
                                    valueText={"avg: "}
                                    value={props.chosenBatch.buttonData.avgHumidity}
                    />
                </Col>
                <Col size={1}>
                    <ValueButton    setGraphDataOnClick={setGraphDataOnClick} 
                                    selectedValue={props.selectedValue}
                                    id={'Vibration'} icon={"ph-vibrate"}
                                    valueText={"avg: "}
                                    value={props.chosenBatch.buttonData.avgVibration}
                    />  
                </Col>
                <Col size={1}>
                    <ValueButton    setGraphDataOnClick={setGraphDataOnClick} 
                                    selectedValue={props.selectedValue}
                                    id={'Temperature'} icon={"fluent:temperature-24-regular"}
                                    valueText={"avg: "}
                                    value={props.chosenBatch.buttonData.avgTemperature}
                    />
                </Col>
            </Row>
            <Row colwrap="xs">
                <Col size={1}>
                    <ValueButton    setGraphDataOnClick={setGraphDataOnClick} 
                                    selectedValue={props.selectedValue}
                                    id={'State'} icon={"mdi-state-machine"}
                                    valueText={''}
                                    value={props.chosenBatch.buttonData.state}
                    />
                </Col>
                <Col size={1}>
                    <DataDiv    icon={"fa-solid:faucet"}
                                id={'ATP'}
                                valueText={''}
                                value={props.chosenBatch.buttonData.atp}
                    />
                </Col>
                <Col size={1}>
                    <DataDiv    icon={"cil-speedometer"}
                                id={'Speed'}
                                valueText={''}
                                value={props.chosenBatch.buttonData.speed}
                    />
                </Col>
            </Row>
            <Row colwrap="xs">
                <Col size={1}>
                    <DataDiv    icon={"jam-bottle"}
                                id={'Produced'}
                                valueText={''}
                                value={props.chosenBatch.buttonData.produced}
                    />
                </Col>
                <Col size={1}>
                    <DataDiv    icon={"fluent:checkmark-16-regular"}
                                id={'Acceptable'}
                                valueText={''}
                                value={props.chosenBatch.buttonData.accepted}
                    />
                </Col>
                <Col size={1}>
                    <DataDiv    icon={"akar-icons:cross"}
                                id={'Rejected'}
                                valueText={''}
                                value={props.chosenBatch.buttonData.rejected}
                    />
                </Col>
            </Row>
            <Row>
                <StyledValueDiv disabled={true}>
                    <Row align={"center"}>
                        <Icon icon="wi:wind-direction-e" style={{ width: "40px", height: "40px" }} />
                        <p>OEE:</p>
                        <p>{props.chosenBatch.buttonData.oee}%</p>
                    </Row>
                </StyledValueDiv>
            </Row>

            <Row>
                <StyledButton onClick={generatePDF}>Generate Report</StyledButton>
            </Row>
        </Grid>
    );
}

const Grid = styled.div`
    display: flex;
    flex-flow: column wrap;
    gap: 12px;
    justify-content: center ${(props) => props.justify};
    width: ${(props) => props.width}%;
`;

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

const Col = styled.div`
    flex: ${(props) => props.size};
    background-color: ${(props) => props.backgroundColor};
    padding: ${(props) => props.padding}px;
`;

const StyledValueDiv = styled.div`
    height: 100%;
    width: 100%;
    padding: 8px 12px;
    background-color: #b7b7b7;
    user-select: none;
`;

const StyledButton = styled.button`
    background-color: #696969;
    border: 1px solid #000;
    color: #fff;
    font-size: 14px;
    font-weight: bold;
    padding: 8px 12px;
    margin: 0px 5px;
    text-decoration: none;

    &:disabled {
        cursor: default;
    }
`;