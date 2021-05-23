import React, { useState, useEffect } from 'react'
import { DataDiv } from '../../ui/DataDiv';
import { Grid, Col, Row } from '../../ui/Grid';

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
		if (props.currentMachine.id !== "") {
			const url = 'http://localhost:8080/api/batches/newest-batch-of-machine/' + props.currentMachine.id;
			const data = await fetch(url);
			const result = await data.json();
			setBatchData(result);
		}
	};


	return (
		<Grid width={100}>
            <Row gap={12}>
				<Col size={1} textAlign="center" backgroundColor="#efefef" padding={5}>
                	<h3>Batch ID: {batchData.id}</h3>
				</Col>
            </Row>

			<Row gap={12} colwrap="xs">
				<Col size={1}>
					<DataDiv icon="jam-bottle-f" id="Type" value={batchData.productType.charAt(0) + batchData.productType.slice(1).toLowerCase().replace('_', '\u00A0')} />
				</Col>
				<Col size={1}>
					<DataDiv icon="cil-speedometer" id="Speed" value={batchData.desiredSpeed} />
				</Col>
			</Row>
			<Row gap={12} colwrap="xs">
				<Col size={1}>
					<DataDiv icon="bx-bxs-flag-checkered" id="Amount" value={batchData.amountToProduce} />
				</Col>
				<Col size={1}>
					<DataDiv icon="mdi-state-machine" id="State" value={props.livedata.state} />
				</Col>
			</Row>

			<Row gap={12} colwrap="xs">
				<Col size={1}>
					<DataDiv icon="jam-bottle" id="Produced" value={props.livedata.processed} />
				</Col>
				<Col size={1}>
					<DataDiv icon="fluent:checkmark-16-regular" id="Acceptable" value={props.livedata.acceptableProducts} />
				</Col>
				<Col size={1}>
					<DataDiv icon="akar-icons:cross" id="Defect" value={props.livedata.defectProducts} />
				</Col>
			</Row>
			<Row gap={12} colwrap="xs">
				<Col size={1}>
					<DataDiv icon="carbon:rain-drop" id="Humidity" value={Math.round(props.livedata.humidity)} />
				</Col>
				<Col size={1}>
					<DataDiv icon="ph-vibrate" id="Vibration" value={Math.round(props.livedata.vibration)} />
				</Col>
				<Col size={1}>
					<DataDiv icon="fluent:temperature-24-regular" id="Temperature" value={Math.round(props.livedata.temperature)} />
				</Col>
			</Row>
		</Grid>
	);

}