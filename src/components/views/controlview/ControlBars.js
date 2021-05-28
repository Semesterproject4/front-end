import React from 'react'
import { DataProgress } from './DataProgress';
import { Grid, Col, Row } from '../../ui/Grid';

export const ControlBars = (props) => {
    return (
		<Grid width={100}>
			<Row>
				
				<Col size={1}>
                    <DataProgress label="Barley" data={props.livedata.ingredients.barley} max="35000" text={props.livedata.ingredients.barley} />
				</Col>
			</Row>
			<Row>
				<Col size={1}>
				    <DataProgress label="Hops" data={props.livedata.ingredients.hops} max="35000" text={props.livedata.ingredients.hops} />
				</Col>
			</Row>
			<Row>
				<Col size={1}>
                    <DataProgress label="Malt" data={props.livedata.ingredients.malt} max="35000" text={props.livedata.ingredients.malt} />                    
				</Col>
			</Row>
			<Row>
				<Col size={1}>
                    <DataProgress label="Wheat" data={props.livedata.ingredients.wheat} max="35000" text={props.livedata.ingredients.wheat} />
				</Col>
			</Row>
			<Row>
				<Col size={1}>
				    <DataProgress label="Yeast" data={props.livedata.ingredients.yeast} max="35000" text={props.livedata.ingredients.yeast} />
				</Col>
			</Row>
		</Grid>
	);
}
