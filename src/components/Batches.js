import React, { useState, useEffect } from 'react'
import styled from 'styled-components';
import { Icon } from '@iconify/react-with-api';
import CanvasJSReact from './assets/canvasjs.react';

const Batches = () => {

    var CanvasJS = CanvasJSReact.CanvasJS;
    var CanvasJSChart = CanvasJSReact.CanvasJSChart;
    
    const [selectedBatchID, setSelectedBatchID] = useState("");
    const [selectedBatch, setSelectedBatch] = useState([]);
    const [selectSucess, setSelectSuccess] = useState(false);
    const [errorMessage, seterrorMessage] = useState("");
    const [link, setLink] = useState("");
    const [pageBatches, setPagebatches] = useState([]);
    const [page, setPage] = useState(0);
    const [maxPage, setMaxPage] = useState(0);
    const [selectedValue, setSelectedValue] = useState("Humidity");
    const [selectedArray, setSelectedArray] = useState([]);
    const [humArray, setHumArray] = useState([]);
    const [vibArray, setVibArray] = useState([]);
    const [tempArray, setTempArray] = useState([]);
    const [stateArray, setStateArray] = useState([]);
    const [humVal, setHumVal] = useState('N/A');
    const [vibVal, setVibVal] = useState('N/A');
    const [tempVal, setTempVal] = useState('N/A');
    const [stateVal, setStateVal] = useState('N/A');
    const [atpVal, setAtpVal] = useState('N/A');
    const [speedVal, setSpeedVal] = useState('N/A');
    const [prodVal, setProdVal] = useState('N/A');
    const [accVal, setAccVal] = useState('N/A');
    const [rejVal, setRejVal] = useState('N/A');
    const [oeeVal, setOeeVal] = useState('N/A');
    const [searchVal, setSearchVal] = useState('');
    const [prevBtnDisable, setPrevBtnDisable] = useState(true);
    const [nextBtnDisable, setNextBtnDisable] = useState(true);

    const arrayDict = {
        Humidity: humArray,
        Vibration: vibArray,
        Temperature: tempArray,
        State: stateArray
    };

    useEffect(() => {
        fetchBatches();
    }, []);

    const onSearchChanged = (e) => {
        setSearchVal(e.target.value);
    }

    const search = async () => {
        let checkForHexRegExp = /^[a-f\d]{24}$/i
        if (checkForHexRegExp.test(searchVal)) {
            setSelectedBatchID(searchVal);
            fetchChosenBatch(searchVal);
            setSearchVal('');
        } else {
            alert("Please provide a valid ID");
        }
    }

    const generatePDF = (e) => {
        window.location.href = "http://localhost:8080/api/batches/" + selectedBatchID + "/pdf"
    };

    const fetchBatches = () => {
        const url = 'http://localhost:8080/api/batches?page=' + page + '&size=10';
        fetch(url).then(response => {
            if (response.status === 200) {
                response.json().then(result => {
                    setPagebatches(result);

                    setMaxPage(Math.floor((result.length / 10)) + 1);

                    if (page === maxPage) {
                        setNextBtnDisable(true);
                    } else {
                        setNextBtnDisable(false);
                    }

                    if (page === 0) {
                        setPrevBtnDisable(true);
                    } else {
                        setPrevBtnDisable(false);
                    }

                    setSelectedBatch(result[0]);
                    setSelectedBatchID(result[0].id);
                });
            } else {
                alert("Sorry, but we had trouble getting batches\n" +
                "Please try again later.")
            }
        });
    };

    const updatePage = (e) => {
        if(e.target.value === "prev"){
            if(page > 0){
                let newPage = page - 1;
                console.log("Current page:", page);
                console.log("New page:", newPage);
                fetchBatches(newPage);
                setPage(newPage);
            } 
        } else if(e.target.value === "next"){
            if(page < maxPage){
                let newPage = page + 1;
                console.log("Current page:", page);
                console.log("New page:", newPage);
                fetchBatches(newPage);
                setPage(newPage);
            } 
        }
    };

    function round(num) {
        var m = Number((num * 100).toPrecision(15));
        return Math.round(m) / 100 * Math.sign(num);
    }

    const fetchChosenBatch = async (id) => {
        const url = 'http://localhost:8080/api/batches/' + id + '/dashboard';
        const data = await fetch(url);
        const response = await data.json();
        
        console.log("Response")
        console.log(response);

        response.batch.data.forEach(element => {
            let timestamp = CanvasJS.formatDate(
                new Date(
                    element.timestamp.date.year,
                    element.timestamp.date.month-1,
                    element.timestamp.date.day,
                    element.timestamp.time.hour,
                    element.timestamp.time.minute,
                    element.timestamp.time.second),
                    "HH:mm:ss");
            
            humArray.push({label: timestamp, y: element.humidity});
            vibArray.push({label: timestamp, y: element.vibration});
            tempArray.push({label: timestamp, y: element.temperature});
            stateArray.push({label: timestamp, y: element.state});
        });

        let lastDataEntry = response.batch.data.length - 1;

        setHumVal(response.avgHumidity);
        setVibVal(response.avgVibration);
        setTempVal(response.avgTemp);
        setStateVal(response.batch.data[lastDataEntry].state)
        setAtpVal(response.batch.amountToProduce);
        setSpeedVal(response.batch.desiredSpeed);
        setProdVal(response.batch.data[lastDataEntry].processed);
        setAccVal(response.batch.data[lastDataEntry].acceptableProducts);
        setRejVal(response.batch.data[lastDataEntry].defectProducts);
        setOeeVal(round(response.oee));
    };

    const selectRow = (e) => {
        let id = e.target.parentNode.getAttribute('id');
        setSelectedBatchID(id); 
        fetchChosenBatch(id);
        setSelectedValue("Humidity");
        setSelectedArray(humArray);
	};


    const options = {
        animationEnabled: true,
        exportEnabled: true,
        theme: "light2", // "light1", "dark1", "dark2"
        title:{
            text: selectedValue
        },
        axisY: {
            title: "Value",
            suffix: ""
        },
        axisX: {
            title: "",
            prefix: "",
            interval: 10
        },
        data: [{
            type: "line",
            toolTipContent: "After {x} seconds: {y}",
            dataPoints: selectedArray
        }]
    }

    const setGraphData = (e) => {
        let id = e.target.parentNode.id;
        console.log(id);
        setSelectedValue(id);
        setSelectedArray(arrayDict[id]);
        console.log(arrayDict[id]);
        console.log(selectedArray);
    };

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

                            <p style={{fontWeight: "bold"}}>{page+1} of {maxPage}</p>

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
                                <StyledValueBtn id="Humidity"  onClick={setGraphData}>
                                    <Row>
                                        <Icon icon="carbon:rain-drop" style={{width: "40px", height: "40px"}}/>
                                    </Row>
                                    <Row>
                                        HUMIDITY
                                    </Row>
                                    <Row>
                                        avg: {humVal}
                                    </Row>
                                </StyledValueBtn>
                            </Col>
                            <Col size={1}>
                                <StyledValueBtn id="Vibration"  onClick={setGraphData}>
                                    <Row>
                                        <Icon icon="ph-vibrate" style={{width: "40px", height: "40px"}}/>
                                    </Row>
                                    <Row>
                                        VIBRATION
                                    </Row>
                                    <Row>
                                        avg: {vibVal}
                                    </Row>
                                </StyledValueBtn>
                            </Col>
                            <Col size={1}>
                                <StyledValueBtn id="Temperature"  onClick={setGraphData}>
                                    <Row>
                                        <Icon icon="fluent:temperature-24-regular" style={{width: "40px", height: "40px"}}/>
                                    </Row>
                                    <Row>
                                        TEMPERATURE
                                    </Row>
                                    <Row>
                                        avg: {tempVal}
                                    </Row>
                                </StyledValueBtn>
                            </Col>
                        </Row>
                        <Row colwrap="xs">
                            <Col size={1}>
                                <StyledValueBtn id="State"  onClick={setGraphData}>
                                    <Row>
                                        <Icon icon="mdi-state-machine" style={{width: "40px", height: "40px"}}/>
                                    </Row>
                                    <Row>
                                        STATES
                                    </Row>
                                    <Row>
                                        {stateVal}
                                    </Row>
                                </StyledValueBtn>
                            </Col>
                            <Col size={1}>
                                <StyledValueBtn >
                                    <Row>
                                        <Icon icon="fa-solid:faucet" style={{width: "40px", height: "40px"}}/>
                                    </Row>
                                    <Row>
                                        ATP
                                    </Row>
                                    <Row >
                                        {atpVal}
                                    </Row>
                                </StyledValueBtn>
                            </Col>
                            <Col size={1}>
                                <StyledValueBtn >
                                    <Row>
                                        <Icon icon="cil-speedometer" style={{width: "40px", height: "40px"}}/>
                                    </Row>
                                    <Row>
                                        SPEED
                                    </Row>
                                    <Row>
                                        {speedVal}
                                    </Row>
                                </StyledValueBtn>
                            </Col>
                        </Row>
                        <Row colwrap="xs">
                            <Col size={1}>
                                <StyledValueBtn >
                                    <Row>
                                        <Icon icon="jam-bottle" style={{width: "40px", height: "40px"}}/>
                                    </Row>
                                    <Row>
                                        PRODUCED
                                    </Row>
                                    <Row>
                                        {prodVal}
                                    </Row>
                                </StyledValueBtn>
                            </Col>
                            
                            <Col size={1}>
                                <StyledValueBtn >
                                    <Row>
                                        <Icon icon="fluent:checkmark-16-regular" style={{width: "40px", height: "40px"}}/>
                                    </Row>
                                    <Row>
                                        ACCEPTABLE
                                    </Row>
                                    <Row>
                                        {accVal}
                                    </Row>
                                </StyledValueBtn>
                            </Col>
                            <Col size={1}>
                                <StyledValueBtn >
                                    <Row>
                                        <Icon icon="akar-icons:cross" style={{width: "40px", height: "40px"}}/>
                                    </Row>
                                    <Row>
                                        REJECTED
                                    </Row>
                                    <Row id="rejVal">
                                        {rejVal}
                                    </Row>
                                </StyledValueBtn>
                            </Col>
                        </Row>
                        
                        <Row>
                            <StyledValueBtn >
                                <Row align={"center"}>
                                    <Icon icon="wi:wind-direction-e" style={{width: "40px", height: "40px"}}/>
                                    <p>OEE:</p>
                                    <p>{oeeVal} %</p>
                                </Row>
                            </StyledValueBtn>
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
                        <Row>
                            <h3>Graph over data</h3>
                        </Row>
                        {/* Fix this */}
                        <Row minheight={340}>
                        <CanvasJSChart options = {options}/>
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
		}
	}
`;

const Styledbody = styled.tbody`
	& tr {
		cursor: pointer;
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
			background: #dbf0ff;
		}
	}
`;

const StyledValueBtn = styled.button`
    height: 100%;
    width: 100%;
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

export default Batches;