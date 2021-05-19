import React, { useState, useEffect } from 'react'
import styled from 'styled-components';
import { Icon } from '@iconify/react-with-api';
import CanvasJSReact from './assets/canvasjs.react';

export const Batches = () => {

    var CanvasJS = CanvasJSReact.CanvasJS;
    var CanvasJSChart = CanvasJSReact.CanvasJSChart;
    
    const [machineStates, setMachineStates] = useState([]);
    const [selectedBatchID, setSelectedBatchID] = useState("");
    const [pageBatches, setPagebatches] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [maxPage, setMaxPage] = useState(0);
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
    const [prevBtnDisable, setPrevBtnDisable] = useState(true);
    const [nextBtnDisable, setNextBtnDisable] = useState(true);
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
        fetchBatches(0);
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
    
    const fetchBatches = (page) => {
        const url = 'http://localhost:8080/api/batches?page=' + page + '&size=10';
        fetch(url).then(response => {
            if (response.status === 200) {
                response.json().then(result => {
                    setPagebatches(result.content);
                    setMaxPage(result.totalPages);
                    setCurrentPage(result.pageable.pageNumber);
                    
                    if (result.pageable.pageNumber + 1 === result.totalPages) {
                        setNextBtnDisable(true);
                    } else {
                        setNextBtnDisable(false);
                    }

                    if (result.pageable.pageNumber === 0) {
                        setPrevBtnDisable(true);
                    } else {
                        setPrevBtnDisable(false);
                    }

                    setSelectedBatchID(result.content[0].id);
                });
            } else {
                alert("Sorry, but we had trouble getting batches\n" +
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

    const generatePDF = () => {
        window.location.href = "http://localhost:8080/api/batches/" + selectedBatchID + "/pdf"
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

    const updatePage = (e) => {
        if(e.target.value === "prev"){
            if(currentPage > 0){
                let newPage = currentPage - 1;
                fetchBatches(newPage);
            } 
        } else if(e.target.value === "next"){
            if(currentPage < maxPage){
                let newPage = currentPage + 1;
                fetchBatches(newPage);
            }
        }
    };

    const selectRow = (e) => {
        let id = e.target.parentNode.getAttribute('id');
        setSelectedBatchID(id);
	};
    
    const setGraphDataOnClick = (e) => {
        let id = e.target.parentNode.id;
        setGraphData(id);
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
                    <Grid>
                        <Row>
                            <h3>Produced batches</h3>
                        </Row>

                        <Row>
                            <Styledtable id="table" onClick={selectRow}>
				                <Styledthead>
				                	<tr>
				                		<th>Product</th>
				                		<th>Amount</th>
				                		<th>Production Started</th>
				                	</tr>
				                </Styledthead>
				                <Styledbody>
				                	{pageBatches.map((element) => (
				                		<tr id={element.id} key={element.id} style={selectedBatchID === element.id ? {background: "#7ac8ff"} : {fontSize: "1.0em"}}>
                                            <td>{element.productType}</td>
				                			<td>{element.amountToProduce}</td>
				                			<td>{element.data[0].timestamp[0]}-{element.data[0].timestamp[1]}-{element.data[0].timestamp[2]} {element.data[0].timestamp[3]}:{element.data[0].timestamp[4]}</td>
				                		</tr>
				                	))}
				                </Styledbody>
			                </Styledtable>
                        </Row>

                        <Row align={"baseline"}>
                            <StyledButton onClick={updatePage} disabled={prevBtnDisable} value="prev">&lt; prev</StyledButton>

                            <p style={{fontWeight: "bold"}}>{currentPage+1} of {maxPage}</p>

                            <StyledButton onClick={updatePage} disabled={nextBtnDisable} value="next">next &gt;</StyledButton>
                        </Row>
                    </Grid>
                </Col>
                <Col size={3} padding={10} backgroundColor={"lightGray"}>
                    <Grid>
                        <Row>
                            <h3>Batch ID: {selectedBatchID}</h3>
                        </Row>

                        <Row colwrap="xs">
                            <Col size={1}>
                                <StyledValueBtn id="Humidity"  onClick={setGraphDataOnClick} style={selectedValue === "Humidity" ? {background: "#7ac8ff"} : {} }>
                                    <Row>
                                        <Icon pointerEvents="none" icon="carbon:rain-drop" style={{width: "40px", height: "40px"}}/>
                                    </Row>
                                    <Row>
                                        HUMIDITY
                                    </Row>
                                    <Row>
                                        avg: {chosenBatch.buttonData.avgHumidity}
                                    </Row>
                                </StyledValueBtn>
                            </Col>
                            <Col size={1}>
                                <StyledValueBtn id="Vibration"  onClick={setGraphDataOnClick} style={selectedValue === "Vibration" ? {background: "#7ac8ff"} : {} }>
                                    <Row>
                                        <Icon pointerEvents="none" icon="ph-vibrate" style={{width: "40px", height: "40px"}}/>
                                    </Row>
                                    <Row>
                                        VIBRATION
                                    </Row>
                                    <Row>
                                        avg: {chosenBatch.buttonData.avgVibration}
                                    </Row>
                                </StyledValueBtn>
                            </Col>
                            <Col size={1}>
                                <StyledValueBtn id="Temperature"  onClick={setGraphDataOnClick} style={selectedValue === "Temperature" ? {background: "#7ac8ff"} : {} }>
                                    <Row>
                                        <Icon pointerEvents="none" icon="fluent:temperature-24-regular" style={{width: "40px", height: "40px"}}/>
                                    </Row>
                                    <Row >
                                        TEMPERATURE
                                    </Row>
                                    <Row>
                                        avg: {chosenBatch.buttonData.avgTemperature}
                                    </Row>
                                </StyledValueBtn>
                            </Col>
                        </Row>
                        <Row colwrap="xs">
                            <Col size={1}>
                                <StyledValueBtn id="State"  onClick={setGraphDataOnClick} style={selectedValue === "State" ? {background: "#7ac8ff"} : {} }>
                                    <Row>
                                        <Icon pointerEvents="none" icon="mdi-state-machine" style={{width: "40px", height: "40px"}}/>
                                    </Row>
                                    <Row>
                                        STATES
                                    </Row>
                                    <Row>
                                        {chosenBatch.buttonData.state}
                                    </Row>
                                </StyledValueBtn>
                            </Col>
                            <Col size={1}>
                                <StyledValueDiv disabled={true}>
                                    <Row>
                                        <Icon icon="fa-solid:faucet" style={{width: "40px", height: "40px"}}/>
                                    </Row>
                                    <Row>
                                        ATP
                                    </Row>
                                    <Row >
                                        {chosenBatch.buttonData.atp}
                                    </Row>
                                </StyledValueDiv>
                            </Col>
                            <Col size={1}>
                                <StyledValueDiv disabled={true}>
                                    <Row>
                                        <Icon icon="cil-speedometer" style={{width: "40px", height: "40px"}}/>
                                    </Row>
                                    <Row>
                                        SPEED
                                    </Row>
                                    <Row>
                                        {chosenBatch.buttonData.speed}
                                    </Row>
                                </StyledValueDiv>
                            </Col>
                        </Row>
                        <Row colwrap="xs">
                            <Col size={1}>
                                <StyledValueDiv disabled={true}>
                                    <Row>
                                        <Icon icon="jam-bottle" style={{width: "40px", height: "40px"}}/>
                                    </Row>
                                    <Row>
                                        PRODUCED
                                    </Row>
                                    <Row>
                                        {chosenBatch.buttonData.produced}
                                    </Row>
                                </StyledValueDiv>
                            </Col>
                            
                            <Col size={1}>
                                <StyledValueDiv disabled={true}>
                                    <Row>
                                        <Icon icon="fluent:checkmark-16-regular" style={{width: "40px", height: "40px"}}/>
                                    </Row>
                                    <Row>
                                        ACCEPTABLE
                                    </Row>
                                    <Row>
                                        {chosenBatch.buttonData.accepted}
                                    </Row>
                                </StyledValueDiv>
                            </Col>
                            <Col size={1}>
                                <StyledValueDiv disabled={true}>
                                    <Row>
                                        <Icon icon="akar-icons:cross" style={{width: "40px", height: "40px"}}/>
                                    </Row>
                                    <Row>
                                        REJECTED
                                    </Row>
                                    <Row id="rejVal">
                                        {chosenBatch.buttonData.rejected}
                                    </Row>
                                </StyledValueDiv>
                            </Col>
                        </Row>
                        
                        <Row>
                            <StyledValueDiv disabled={true}>
                                <Row align={"center"}>
                                    <Icon icon="wi:wind-direction-e" style={{width: "40px", height: "40px"}}/>
                                    <p>OEE:</p>
                                    <p>{chosenBatch.buttonData.oee} %</p>
                                </Row>
                            </StyledValueDiv>
                        </Row>

                        <Row>
                            <StyledButton onClick={generatePDF}>Generate Report</StyledButton>
                        </Row>
                    </Grid>
                </Col>
            </Row>
            <Row minheight={400}>
                <Col size={1} padding={10} backgroundColor={"lightGray"}>
                    <Grid>
                        {/* Fix this */}
                        <Row minheight={340}>
                        <CanvasJSChart options = {options} />
                        </Row>
                    </Grid>
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

const Styledtable = styled.table`
	width: 100%;
	border-collapse: collapse;
	background: white;  
/*   	-webkit-box-shadow: 0px 0px 10px 8px rgba(0, 0, 0, 0.1);
			box-shadow: 0px 0px 10px 8px rgba(0, 0, 0, 0.1);  */ 
`;

const Styledthead = styled.thead`
	& tr {
		& th {
			font-size: 1.0em;
			font-weight: bold;
			padding: 10px;
            user-select: none;
		}
	}
`;

const Styledbody = styled.tbody`
	& tr {
		cursor: pointer;
        user-select: none;

		& td {
			font-size: 1.0em;
			height: 40px;
			border-top: 1px solid whitesmoke;
		}
		&:nth-child(even) {
			background-color: #f7f7f7;
		}
		&:nth-child(odd) {
			background-color: #ffffff;
		}  
		&:hover {
			background: #e3e3e3;
		}
	}
`;

const StyledValueBtn = styled.div`
    height: 100%;
    width: 100%;
    padding: 8px 12px;
    background-color: #f7f7f7;
    user-select: none;
    
    &:hover {
        cursor: pointer;
        background-color: #e3e3e3;
    }
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

const StyledInput = styled.input`
    width: 50%;
    padding: 12px 20px;
    margin: 8px 0;
    box-sizing: border-box;
    border: none;
    border-bottom: 4px solid grey;
`;

