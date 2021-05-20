import React, { useState, useEffect } from 'react'
import styled from 'styled-components';
import CanvasJSReact from './assets/canvasjs.react';
import { BatchList } from './BatchList';
import { BatchDataGrid } from './BatchDataGrid';

export const Batches = () => {

    var CanvasJS = CanvasJSReact.CanvasJS;
    var CanvasJSChart = CanvasJSReact.CanvasJSChart;
    
    const [machineStates, setMachineStates] = useState([]);
    const [selectedBatchID, setSelectedBatchID] = useState("");
    const [selectedValue, setSelectedValue] = useState("Humidity");
    const [selectedArray, setSelectedArray] = useState([]);
    const [chosenBatch, setChosenBatch] = useState({
        buttonData: {
            avgHumidity: 0,
            avgVibration: 0,
            avgTemperature: 0,
            state: 0,
            atp: 0,
            speed: 0,
            produced: 0,
            accepted: 0,
            rejected: 0,
            oee: 0
        },
        Humidity: [],
        Vibration: [],
        Temperature: [],
        State: []
    });
    const [searchVal, setSearchVal] = useState('');
    const [graphInterval, setGraphInterval] = useState(0);
    const [isStateGraph, setIsStateGraph] = useState(false);
    
    const options = {
        animationEnabled: true,
        exportEnabled: true,
        theme: "light2", // "light1", "dark1", "dark2"
        title:{
            text: selectedValue + " over time"
        },
        axisY: {
            title: "",
            suffix: ""
        },
        axisX: {
            title: "",
            prefix: "",
            interval: graphInterval
        },
        data: [{
            type: isStateGraph ? "stepLine" : "line",
            toolTipContent: "At {label}, value: {y}",
            dataPoints: selectedArray
        }]
    };

    useEffect(() => {
        getMachineStates();
    }, []);

    useEffect(() => {
        fetchChosenBatch(selectedBatchID);
    }, [selectedBatchID]);

    useEffect(() => {
        setGraphData(selectedValue);
    }, [chosenBatch]);

    const getMachineStates = () => {
        let url = 'http://localhost:8080/api/machines/states'
        fetch(url).then(response => {
            if (response.status === 200) {
                response.json().then(result => {
                    setMachineStates(result);
                });
            } else {
                alert("Sorry, but we had trouble getting machine states\n" +
                "Please try again later.")
            }
        });
    };

    function round(num) {
        var m = Number((num * 100).toPrecision(15));
        return Math.round(m) / 100 * Math.sign(num);
    };

    const fetchChosenBatch = (id) => {
        chosenBatch.Humidity.length = 0;
        chosenBatch.Vibration.length = 0;
        chosenBatch.Temperature.length = 0;
        chosenBatch.State.length = 0;

        const url = 'http://localhost:8080/api/batches/' + id + '/dashboard';
        fetch(url).then(response => {
            if (response.status === 200) {
                response.json().then(result => {

                    let tempHumArray = [];
                    let tempVibArray = [];
                    let tempTempArray = [];
                    let tempStateArray = [];

                    result.batch.data.forEach(element => {
                        let timestamp = CanvasJS.formatDate(
                            new Date(
                                element.timestamp.date.year,
                                element.timestamp.date.month-1,
                                element.timestamp.date.day,
                                element.timestamp.time.hour,
                                element.timestamp.time.minute,
                                element.timestamp.time.second),
                                "HH:mm:ss"
                            );
                        
                        tempHumArray.push({label: timestamp, y: element.humidity});
                        tempVibArray.push({label: timestamp, y: element.vibration});
                        tempTempArray.push({label: timestamp, y: element.temperature});

                        if (machineStates.states !== 0) {
                            let stateInt;
                            machineStates.states.map( state => {
                                if (state.name.toUpperCase() === element.state) {
                                    stateInt = state.value;
                                }
                            });
                            tempStateArray.push({label: timestamp, y: stateInt});
                        }
                    });
                    
                    let lastDataEntry = result.batch.data.length - 1;
                    let data = {
                        buttonData: {
                            avgHumidity: result.avgHumidity,
                            avgVibration: result.avgVibration,
                            avgTemperature: result.avgTemp,
                            state: result.batch.data[lastDataEntry].state,
                            atp: result.batch.amountToProduce,
                            speed: result.batch.desiredSpeed,
                            produced: result.batch.data[lastDataEntry].processed,
                            accepted: result.batch.data[lastDataEntry].acceptableProducts,
                            rejected: result.batch.data[lastDataEntry].defectProducts,
                            oee: round(result.oee)
                        },
                        Humidity: tempHumArray,
                        Vibration: tempVibArray,
                        Temperature: tempTempArray,
                        State: tempStateArray
                    };

                    setChosenBatch(data);
                    setGraphInterval(lastDataEntry / 10);
                });
            }
        });
    };

    const onSearchChanged = (e) => {
        setSearchVal(e.target.value);
    }

    const search = () => {
        let checkForHexRegExp = /^[a-f\d]{24}$/i
        if (checkForHexRegExp.test(searchVal)) {
            setSelectedBatchID(searchVal);
            fetchChosenBatch(searchVal);
        } else {
            alert("Please provide a valid ID");
        }
    };
    
    const setGraphData = (id) => {
        if (id === 'State') {
            console.log("State chosen");
            setIsStateGraph(true);
        } else {
            setIsStateGraph(false);
        };
        setSelectedValue(id);
        setSelectedArray(chosenBatch[id]);
    }
    
    return (
        <Grid>
            <Row>
                <Col size={1} padding={10}>
                    <StyledInput onChange={onSearchChanged} placeholder="Batch ID"></StyledInput>
                    <StyledButton onClick={search}>Search</StyledButton>
                </Col>
            </Row>
            <Row colwrap="m"> 
                <Col size={2} padding={10} backgroundColor={"lightGray"}>
                    <BatchList selectedBatchID={selectedBatchID} setSelectedBatchID={setSelectedBatchID}/>
                </Col>
                <Col size={3} padding={10} backgroundColor={"lightGray"}>
                    <BatchDataGrid  selectedBatchID={selectedBatchID} selectedValue={selectedValue} chosenBatch={chosenBatch} setGraphData={setGraphData}/>
                </Col>
            </Row>
            <Row minheight={400}>
                <Col size={1} padding={10} backgroundColor={"lightGray"}>
                    <CanvasJSChart options = {options} />
                </Col>
            </Row>
        </Grid>
    );
};

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

const StyledInput = styled.input`
    width: 50%;
    padding: 12px 20px;
    margin: 8px 0;
    box-sizing: border-box;
    border: none;
    border-bottom: 4px solid grey;
`;
