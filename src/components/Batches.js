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
    const [page, setPage] = useState(1);
    const [maxPage, setMaxPage] = useState(0);
    const [selectedValue, setSelectedValue] = useState("Humidity");
    const [selectedArray, setSelectedArray] = useState([{label: new Date(12, 12, 12, 12, 12, 12), y: 1}, {label: new Date(12, 12, 12, 12, 12, 12), y: 2}]);
    const [humArray, setHumArray] = useState([{label: Date, y: ''}]);
    const [vibArray, setVibArray] = useState([{label: Date, y: ''}]);
    const [tempArray, setTempArray] = useState([{label: Date, y: ''}]);
    const [stateArray, setStateArray] = useState([{label: Date, y: ''}]);

    const arrayDict = {
        Humidity: humArray,
        Vibration: vibArray,
        Temperature: tempArray,
        State: stateArray
    };

    const humVal = document.getElementById("humVal");
    const vibVal = document.getElementById("vibVal");
    const tempVal = document.getElementById("tempVal");
    const atpVal = document.getElementById("atpVal");
    const speedVal = document.getElementById("speedVal");
    const prodVal = document.getElementById("prodVal");
    const accVal = document.getElementById("accVal");
    const rejVal = document.getElementById("rejVal");
    const oeeVal = document.getElementById("oeeVal");

    useEffect(() => {
        fetchBatches();
    }, []);

    const search = async () => {
        let checkForHexRegExp = /^[a-f\d]{24}$/i
        let id = document.getElementById("searchField").value;
        if (checkForHexRegExp.test(id)) {
            setSelectedBatchID(id);
            fetchChosenBatch(id);
        } else {
            alert("Please provide a valid ID");
        }
    }

    const generatePDF = (e) => {
        if(e.target.value === "search"){
            window.location.href = link;
        } else if(e.target.value === "pages"){
            window.location.href = "http://localhost:8080/api/batches/" + selectedBatchID + "/pdf"
        }
    };

    const fetchBatches = async () => {
        setPagebatches([]);
        const url = 'http://localhost:8080/api/batches?page=0&size=10';
        const data = await fetch(url);
        const result = await data.json();
        setPagebatches(result);
        // this is broken, please fix :)
        setMaxPage(data.length%10);
        // this is probably needed
        setPage(page);
        setSelectedBatch(result[0]);
        setSelectedBatchID(result[0].id);
    };

    const updatePage = (e) => {
        if(e.target.value === "prev"){
            if(page > 0){
                let newPage = page - 1;
                console.log("Current page:", page);
                console.log("New page:", newPage);
                fetchBatches(newPage);
            } 
        } else if(e.target.value === "next"){
            if(page < maxPage){
                let newPage = page + 1;
                console.log("Current page:", page);
                console.log("New page:", newPage);
                fetchBatches(newPage);
            } 
        }
    };
    

    const fetchChosenBatch = async (id) => {
        const url = 'http://localhost:8080/api/batches/' + id + '/dashboard';
        const data = await fetch(url);
        const response = await data.json();
        
        console.log("Response")
        console.log(response);
        let start = new Date(response.batch.data[0].timestamp.date.year, response.batch.data[0].timestamp.date.month, response.batch.data[0].timestamp.date.day, response.batch.data[0].timestamp.time.hour, response.batch.data[0].timestamp.time.minute, response.batch.data[0].timestamp.time.second, response.batch.data[0].timestamp.time.nano).getTime / 1000;

        response.batch.data.forEach(element => {
            let curTime = new Date(element.timestamp.date.year, element.timestamp.date.month, element.timestamp.date.day, element.timestamp.time.hour, element.timestamp.time.minute, element.timestamp.time.second, element.timestamp.time.nano).getTime() / 1000;
            let timestamp = start - curTime;
            
            humArray.push({label: timestamp, y: element.humidity});
            vibArray.push({label: timestamp, y: element.vibration});
            tempArray.push({label: timestamp, y: element.temperature});
            stateArray.push({label: timestamp, y: element.state});
        });

        let lastDataEntry = response.batch.data.length - 1;

        humVal.innerText = 'avg: ' + response.avgHumidity;
        vibVal.innerText = 'avg: ' + response.avgVibration;
        tempVal.innerText = 'avg: ' + response.avgTemp;
        atpVal.innerText = response.batch.amountToProduce;
        speedVal.innerText = response.batch.desiredSpeed;
        prodVal.innerText = response.batch.data[lastDataEntry].processed;
        accVal.innerText = response.batch.data[lastDataEntry].acceptableProducts;
        rejVal.innerText = response.batch.data[lastDataEntry].defectProducts;
        oeeVal.innerText = Math.round(response.oee * 100) / 100 + '%';
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
            interval: 2
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
                    <input style={inputStyle} id="searchField" placeholder="Batch ID"></input>
                    <button style={btnStyle} onClick={search}>Search</button>
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
                            <button style={btnStyle} onClick={updatePage} value="prev">&lt; prev</button>
                            <p style={{fontWeight: "bold"}}>{page+1} of {maxPage+1}</p>
                            <button style={btnStyle} onClick={updatePage} value="next">next &gt;</button>
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
                                <button id="Humidity" style={valBtn} onClick={setGraphData}>
                                    <Row>
                                        <Icon icon="carbon:rain-drop" style={{width: "40px", height: "40px"}}/>
                                    </Row>
                                    <Row>
                                        HUMIDITY
                                    </Row>
                                    <Row id="humVal">
                                        avg: N/A
                                    </Row>
                                </button>
                            </Col>
                            <Col size={1}>
                                <button id="Vibration" style={valBtn} onClick={setGraphData}>
                                    <Row>
                                        <Icon icon="ph-vibrate" style={{width: "40px", height: "40px"}}/>
                                    </Row>
                                    <Row>
                                        VIBRATION
                                    </Row>
                                    <Row id="vibVal">
                                        avg: N/A
                                    </Row>
                                </button>
                            </Col>
                            <Col size={1}>
                                <button id="Temperature" style={valBtn} onClick={setGraphData}>
                                    <Row>
                                        <Icon icon="fluent:temperature-24-regular" style={{width: "40px", height: "40px"}}/>
                                    </Row>
                                    <Row>
                                        TEMPERATURE
                                    </Row>
                                    <Row id="tempVal">
                                        avg: N/A
                                    </Row>
                                </button>
                            </Col>
                        </Row>
                        <Row colwrap="xs">
                            <Col size={1}>
                                <button id="State" style={valBtn} onClick={setGraphData}>
                                    <Row>
                                        <Icon icon="mdi-state-machine" style={{width: "40px", height: "40px"}}/>
                                    </Row>
                                    <Row>
                                        STATES
                                    </Row>
                                </button>
                            </Col>
                            <Col size={1}>
                                <button style={valBtn}>
                                    <Row>
                                        <Icon icon="fa-solid:faucet" style={{width: "40px", height: "40px"}}/>
                                    </Row>
                                    <Row>
                                        ATP
                                    </Row>
                                    <Row id="atpVal">
                                        N/A
                                    </Row>
                                </button>
                            </Col>
                            <Col size={1}>
                                <button style={valBtn}>
                                    <Row>
                                        <Icon icon="cil-speedometer" style={{width: "40px", height: "40px"}}/>
                                    </Row>
                                    <Row>
                                        SPEED
                                    </Row>
                                    <Row id="speedVal">
                                        N/A
                                    </Row>
                                </button>
                            </Col>
                        </Row>
                        <Row colwrap="xs">
                            <Col size={1}>
                                <button style={valBtn}>
                                    <Row>
                                        <Icon icon="jam-bottle" style={{width: "40px", height: "40px"}}/>
                                    </Row>
                                    <Row>
                                        PRODUCED
                                    </Row>
                                    <Row id="prodVal">
                                        N/A
                                    </Row>
                                </button>
                            </Col>
                            
                            <Col size={1}>
                                <button style={valBtn}>
                                    <Row>
                                        <Icon icon="fluent:checkmark-16-regular" style={{width: "40px", height: "40px"}}/>
                                    </Row>
                                    <Row>
                                        ACCEPTABLE
                                    </Row>
                                    <Row id="accVal">
                                        N/A
                                    </Row>
                                </button>
                            </Col>
                            <Col size={1}>
                                <button style={valBtn}>
                                    <Row>
                                        <Icon icon="akar-icons:cross" style={{width: "40px", height: "40px"}}/>
                                    </Row>
                                    <Row>
                                        REJECTED
                                    </Row>
                                    <Row id="rejVal">
                                        N/A
                                    </Row>
                                </button>
                            </Col>
                        </Row>
                        
                        <Row>
                            <button style={valBtn}>
                                <Row align={"center"}>
                                    <Icon icon="wi:wind-direction-e" style={{width: "40px", height: "40px"}}/>
                                    <p>OEE:</p>
                                    <p id="oeeVal">N/A%</p>
                                </Row>
                            </button>
                        </Row>

                        <Row>
                            <button value="pages" style={btnStyle} onClick={generatePDF}>Generate Report</button>
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

/* const itemStyle = {
    backgroundColor: "#eee",
    margin: "10px"
}

const searchStyle = {
    marginBottom: "10px"
} */


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


const valBtn = {
    height: "100%",
    width: "100%"
}

const btnStyle = {
    backgroundColor: "#696969",
    border: "1px solid #000",
    color: "#fff",
    fontSize: "14px",
    fontWeight: "bold",
    padding: "8px 12px",
    margin: "0px 5px",
    textDecoration: "none"
}

const inputStyle =   {
    width: "50%",
    padding: "12px 20px",
    margin: "8px 0",
    boxSizing: "border-box",
    border: "none",
    borderBottom: "4px solid grey"
}

const selectStyle = {
  overflow: "hidden",
  height: "470px",
  textAlign: "center", 
  fontSize: "26px",
  boxSizing: "border-box",
  border: "hidden",
  minWidth: "80%"
}

const optionStyle = {
  padding: "8px", 
  outlineStyle:"solid 1px", 
  backgroundColor: "#D0D0D0"
}

export default Batches;