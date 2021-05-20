import React, { useState, useEffect } from 'react'
import styled from 'styled-components';
import { LiveDataItem } from './LiveDataItem';
import { LiveDataProgress } from './LiveDataProgress';

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

	useEffect(() => {
		if (props.livedata.state === "EXECUTE") {
			fetchBatch();
		}
	}, [props.livedata.state])



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
					<Col size={1} padding={5}>
						<LiveDataItem icon="jam-bottle-f" text="Type" data={batchData.productType.charAt(0) + batchData.productType.slice(1).toLowerCase().replace('_', '\u00A0')} />
					</Col>
					<Col size={1} padding={5}>
						<LiveDataItem icon="cil-speedometer" text="Speed" data={batchData.desiredSpeed} />
					</Col>
					<Col size={1} padding={5}>
						<LiveDataItem icon="bx-bxs-flag-checkered" text="Amount" data={batchData.amountToProduce} />
					</Col>
					<Col size={1} padding={5}>
						<LiveDataItem icon="mdi-state-machine" text="State" data={props.livedata.state} />
					</Col>
				</Row>
	
				<Row style={{gap: "2%"}}>
					<Col size={1} padding={5}>
						<LiveDataItem icon="carbon:rain-drop" text="Humidity" data={Math.round(props.livedata.humidity)} />
					</Col>
					<Col size={1} padding={5}>
						<LiveDataItem icon="ph-vibrate" text="Vibration" data={Math.round(props.livedata.vibration)} />
					</Col>
					<Col size={1} padding={5}>
						<LiveDataItem icon="fluent:temperature-24-regular" text="Temperature" data={Math.round(props.livedata.temperature)} />
					</Col>
					<Col size={1} padding={5}>
						<LiveDataItem icon="jam-bottle" text="Produced" data={props.livedata.processed} />
					</Col>
					<Col size={1} padding={5}>
						<LiveDataItem icon="fluent:checkmark-16-regular" text="Acceptable" data={props.livedata.acceptableProducts} />
					</Col>
					<Col size={1} padding={5}>
						<LiveDataItem icon="akar-icons:cross" text="Defect" data={props.livedata.defectProducts} />
					</Col>
				</Row>

				<Row>
					<h1>
						Batch ID: {batchData.id}
					</h1>
				</Row>

				<Row>
					<Col size={1}>
						<LiveDataProgress label="Maintenance" data={props.livedata.maintenance} max="30000" text={(props.livedata.maintenance / 30000 * 100).toFixed(1) + "%"} />
					</Col>
				</Row>

				<Row style={{gap: "2.5%"}}>
					<Col size={1}l>
						<LiveDataProgress label="Barley" data={props.livedata.ingredients.barley} max="35000" text={props.livedata.ingredients.barley} />
					</Col>
					<Col size={1}>
						<LiveDataProgress label="Hops" data={props.livedata.ingredients.hops} max="35000" text={props.livedata.ingredients.hops} />
					</Col>
					<Col size={1}>
						<LiveDataProgress label="Malt" data={props.livedata.ingredients.malt} max="35000" text={props.livedata.ingredients.malt} />
					</Col>
					<Col size={1}>
						<LiveDataProgress label="Wheat" data={props.livedata.ingredients.wheat} max="35000" text={props.livedata.ingredients.wheat} />
					</Col>
					<Col size={1}>
						<LiveDataProgress label="Yeast" data={props.livedata.ingredients.yeast} max="35000" text={props.livedata.ingredients.yeast} />
					</Col>
				</Row>
			</Grid>


		</div>
	);

}


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