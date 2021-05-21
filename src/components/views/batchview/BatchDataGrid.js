import React from 'react'
import styled from 'styled-components';
import { Icon } from '@iconify/react-with-api';
import { ValueButton } from '../../ui/ValueButton';
import { FormButton } from '../../ui/Buttons';
import { DataDiv } from '../../ui/DataDiv';
import { Grid, Col, Row } from '../../ui/Grid';

export const BatchDataGrid = (props) => {

    const generatePDF = () => {
        window.location.href = "http://localhost:8080/api/batches/" + props.selectedBatchID + "/pdf"
    };

    const setGraphDataOnClick = (e) => {
        let id = e.target.parentNode.id;
        props.setGraphData(id);
    };

    return (
        <Grid width={100}>
            <Row>
				<Col size={1} textAlign="center" backgroundColor="#EFEFEF" padding={5}>
                	<h3>Batch ID: {props.selectedBatchID}</h3>
				</Col>
            </Row>

            <Row colwrap="xs" gap={12}>

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
            <Row colwrap="xs" gap={12}>
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
                                id={'Amount to produce'}
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
            <Row colwrap="xs" gap={12}>
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
                <StyledValueDiv>
                    <Row justify="center" align="center" gap={12}>
                        <Icon icon="wi:wind-direction-e" style={{ width: "40px", height: "40px" }} />
                        <p>OEE:</p>
                        <p>{props.chosenBatch.buttonData.oee}%</p>
                    </Row>
                </StyledValueDiv>
            </Row>

            <Row>
                <FormButton onClick={generatePDF}>Generate Report</FormButton>
            </Row>
        </Grid>
    );
}

const StyledValueDiv = styled.div`
    width: 100%;
    padding: 14.5px 0px;
    background-color: #EFEFEF;
    user-select: none;
`;