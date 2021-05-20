import React, { useState, useEffect } from 'react'
import { Icon } from '@iconify/react-with-api';
import styled from 'styled-components';

export const LiveviewData = (props) => {
	const [batchData, setBatchData] = useState(
		{
			"id": "0",
			"connectionID": null,
			"productType": "PILSNER",
			"amountToProduce": 0,
			"desiredSpeed": 0,
			"oee": 0,
			"data": null
		});

	useEffect(() => {
		fetchBatch();
	}, [props.currentMachine.id])


	const fetchBatch = async () => {
		const url = 'http://localhost:8080/api/batches/newest-batch-of-machine/' + props.currentMachine.id;
		const data = await fetch(url);
		const result = await data.json();
		setBatchData(result);
	};


	return (
		<div>
			<Grid>
				<Row style={{gap: "2%"}}>
					<Col style={{width: "15%"}}>
						<div>
							<Icon icon="jam-bottle-f" style={{width: "60px", height: "60px"}}/>	
							<p>Type</p>
							<h1>{batchData.productType.charAt(0) + batchData.productType.slice(1).toLowerCase().replace('_', '\u00A0')}</h1>
						</div>
					</Col>
					<Col style={{width: "15%"}}>
						<div>
						<Icon icon="cil-speedometer" style={{width: "60px", height: "60px"}}/>	
							<p>Speed</p>
							<h1>{batchData.desiredSpeed}</h1>
						</div>
					</Col>
					<Col style={{width: "32%"}}>
						<div>
						<Icon icon="mdi-archive" style={{width: "60px", height: "60px"}}/>
							<p>Batch ID</p>
							<h1>{batchData.id}</h1>
						</div>
					</Col>
					<Col style={{width: "15%"}}>
						<div>
						<Icon icon="bx-bxs-flag-checkered" style={{width: "60px", height: "60px"}}/>
							<p>Amount to produce</p>
							<h1>{batchData.amountToProduce}</h1>
						</div>
					</Col>
					<Col style={{width: "15%"}}>
						<div>
							<Icon icon="mdi-state-machine" style={{width: "60px", height: "60px"}}/>
							<p>State</p>
							<h1>{props.livedata.state}</h1>
						</div>
					</Col>
				</Row>

				<Row style={{gap: "2%"}}>
					<Col style={{width: "15%"}}>
						<div style={{padding: "0px 25px"}}>
							<Icon icon="carbon:rain-drop" style={{width: "60px", height: "60px"}}/>
							<p>Humidity</p>
							<h1>{Math.round(props.livedata.humidity)}</h1>
						</div>
					</Col>
					<Col style={{width: "15%"}}>
						<div style={{padding: "0px 25px"}}>
                        	<Icon icon="ph-vibrate" style={{width: "60px", height: "60px"}}/>
							<p>Vibration</p>
							<h1>{Math.round(props.livedata.vibration)}</h1>
						</div>
					</Col>
					<Col style={{width: "15%"}}>
						<div style={{padding: "0px 25px"}}>
							<Icon icon="fluent:temperature-24-regular" style={{width: "60px", height: "60px"}}/>
							<p>Temperature</p>
							<h1>{Math.round(props.livedata.temperature)}</h1>
						</div>
					</Col>
					<Col style={{width: "15%"}}>
						<div style={{padding: "0px 25px"}}>
							<Icon icon="jam-bottle" style={{width: "60px", height: "60px"}}/>
							<p>Produced</p>
							<h1>{props.livedata.processed}</h1>
						</div>
					</Col>
					<Col style={{width: "15%"}}>
						<div style={{padding: "0px 25px"}}>
							<Icon icon="fluent:checkmark-16-regular" style={{width: "60px", height: "60px"}}/>
							<p>Acceptable</p>
							<h1>{props.livedata.acceptableProducts}</h1>
						</div>
					</Col>
					<Col style={{width: "15%"}}>
						<div style={{padding: "0px 25px"}}>
							<Icon icon="akar-icons:cross" style={{width: "60px", height: "60px"}}/>
							<p>Defect</p>
							<h1>{props.livedata.defectProducts}</h1>
						</div>
					</Col>
				</Row>

				<Row>
					<Col style={{width: "100%"}}>
						<div style={{width: "100%", display: "inline-flex", align: "center"}}>
							<div style={{width: "100%"}}>
								<label>Maintenance</label><br></br>
								<Bar id="maintenance" style={{marginTop: "-10px"}} value={props.livedata.maintenance} max="30000"></Bar><br></br>
								<p style={{marginTop: "-25px"}}>{(props.livedata.maintenance / 30000 * 100).toFixed(1)}%</p>
							</div>
						</div>
					</Col>
				</Row>

				<Row style={{gap: "2.5%"}}>

					<Col style={{width: "18%", height: "50px"}}>
						<div style={{width: "100%", display: "inline-flex", align: "center"}}>
							<div style={{width: "100%"}}>
								<label>Barley</label><br></br>
								<Bar style={{marginTop: "-10px"}} value={props.livedata.ingredients.barley} max="35000"></Bar><br></br>
								<p style={{marginTop: "-25px"}}>{props.livedata.ingredients.barley}</p>
							</div>
						</div>
					</Col>

					<Col style={{width: "18%", height: "50px"}}>
						<div style={{width: "100%", display: "inline-flex", align: "center"}}>
							<div style={{width: "100%"}}>
								<label>Hops</label><br></br>
								<Bar style={{marginTop: "-10px"}} value={props.livedata.ingredients.hops} max="35000"></Bar><br></br>
								<p style={{marginTop: "-25px"}}>{props.livedata.ingredients.hops}</p>
							</div>
						</div>
					</Col>

					<Col style={{width: "18%", height: "50px"}}>
						<div style={{width: "100%", display: "inline-flex", align: "center"}}>
							<div style={{width: "100%"}}>
								<label>Malt</label><br></br>
								<Bar style={{marginTop: "-10px"}} value={props.livedata.ingredients.malt} max="35000"></Bar><br></br>
								<p style={{marginTop: "-25px"}}>{props.livedata.ingredients.malt}</p>
							</div>
						</div>
					</Col>
					
					<Col style={{width: "18%", height: "50px"}}>
						<div style={{width: "100%", display: "inline-flex", align: "center"}}>
							<div style={{width: "100%"}}>
								<label>Wheat</label><br></br>
								<Bar style={{marginTop: "-10px"}} value={props.livedata.ingredients.wheat} max="35000"></Bar><br></br>
								<p style={{marginTop: "-25px"}}>{props.livedata.ingredients.wheat}</p>
							</div>
						</div>
					</Col>

					<Col style={{width: "18%", height: "50px"}}>
						<div style={{width: "100%", display: "inline-flex", align: "center"}}>
							<div style={{width: "100%"}}>
								<label>Yeast</label><br></br>
								<Bar style={{marginTop: "-10px"}} value={props.livedata.ingredients.yeast} max="35000"></Bar><br></br>
								<p style={{marginTop: "-25px"}}>{props.livedata.ingredients.yeast}</p>
							</div>
						</div>
					</Col>
				</Row>
			</Grid>


		</div>
	);

}


const Bar = styled.progress`
	-webkit-appearance: none;
	appearance: none;
	width: 100%;
	height: 20px;
	border: 1px solid black;
	border-radius: 20px;

	&::-webkit-progress-value {
		background: #7AC8FF;
		border-radius: 20px;
	}

   	&::-webkit-progress-bar {
		background: #EFEFEF;
		border-radius: 20px;
	}
`

const Grid = styled.div`
    display: flex;
    flex-flow: column wrap;
    gap: 12px;
    justify-content: center;
	
	& h1 {
		font-size: 1.5em;
	}
`

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
	width: 60%;
	margin: auto;
	padding: 15px 0px;
    display: flex;
    flex-flow: wrap;
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