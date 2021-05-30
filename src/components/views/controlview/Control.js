import React, {useState, useEffect} from 'react'
import * as SockJS from 'sockjs-client';
import * as Stomp from 'stompjs';
import { Grid, Col, Row } from '../../ui/Grid';
import { ControlInput } from './ControlInput';
import { ControlData } from './ControlData';
import { ControlBars } from './ControlBars'
import { DataProgress } from './DataProgress';
 
export const Control = (props) => {
	const [stompClient, setStompClient] = useState(null);
	const [socket, setSocket] = useState(null);
	const [livedata, setLivedata] = 
		useState({
			acceptableProducts: 0,
			defectProducts: 0,
			processed: 0,
			temperature: 0,
			vibration: 0,
			humidity: 0,
			normSpeed: 0,
			maintenance: 0,
			state: "STOPPED",
			ingredients: {
				barley: 35000,
				hops: 35000,
				malt: 35000,
				wheat: 35000,
				yeast: 35000
			},
			timestamp: null,
		});

	useEffect(() => {
		let newSocket = new SockJS('http://localhost:8080/websocket');
		setSocket(newSocket);
	}, [props.currentMachine.ip])

	useEffect(() => {
		if (socket !== null) {
			let newStompClient = Stomp.over(socket);
			newStompClient.debug = null;
			setStompClient(newStompClient);
		}
	}, [socket])

	useEffect(() => {
		if (stompClient !== null) {
			
			connect();
		}
		return () => {
			disconnect();
		};
	}, [stompClient])


	const connect = () => {
        stompClient.connect({}, (frame) => {
            stompClient.send("/app/connect/" + props.currentMachine.id, {}, JSON.stringify({'name': "filler value"})); 

            stompClient.subscribe('/topic/' + props.currentMachine.id + '/livedata', (data) => {
				storeData(data.body);
            });
        });
	}

	const disconnect = () => {
		if (socket !== null) {
			socket.close();
		} 
		if (stompClient !== null) {
			stompClient.disconnect();
		}
	}

	const storeData = (data) => {
        let json = JSON.parse(data);
        if (livedata !== json) {
			setLivedata(json);
		}
    }

	return (
			<Grid width={100}>
				<Row colwrap="m" gap={12}> 
					<Col size={2}>
						<Grid>
							<Row>
								<Col size={1} padding={10} backgroundColor={"#e0e0e0"}>
									<ControlInput 
										currentMachine = {props.currentMachine}
										setCurrentMachine = {props.setCurrentMachine}
										state = {livedata.state}
									/>
								</Col>			
							</Row>
							<Row>
								<Col size={1} padding={10} backgroundColor={"#e0e0e0"} >
									<ControlBars 
										livedata = {livedata}
									/>

								</Col>			
							</Row>
						</Grid>
					</Col>
					<Col size={3}>
						<Grid>
							<Row>
								<Col size={1} padding={10} backgroundColor={"#e0e0e0"}>
									<ControlData 
										currentMachine = {props.currentMachine}
										livedata = {livedata}
									/>
								</Col>
							</Row>
							<Row>
								<Col size={1} padding={10} backgroundColor={"#e0e0e0"}>
									<DataProgress 
										label="Maintenance"
										data={30000 - livedata.maintenance}
										max="30000"
										text={(livedata.maintenance / 30000 * 100).toFixed(1) + "%"}
									/>
								</Col>
							</Row>
						</Grid>
					</Col>
				</Row>
			</Grid>
	);
};