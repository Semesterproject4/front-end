import React, {useState, useEffect} from 'react'
import * as SockJS from 'sockjs-client';
import * as Stomp from 'stompjs';
import { Icon } from '@iconify/react-with-api';

export const Liveview = (props) => {
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
            //Send initial info to backend to start the sending of data
            stompClient.send("/app/connect/" + props.currentMachine.id, {}, JSON.stringify({'name': "filler value"})); 
			//Start subscription (when we get data we send random data which triggers the backend to send data)
            //Essentially we just loop through this forever.
            stompClient.subscribe('/topic/' + props.currentMachine.id + '/livedata', (data) => {
                //Send new data to function storeData
				storeData(data.body);
				
                //Send random info to backend to "trigger" it to send a few set of data.
                stompClient.send("/app/connect/" + props.currentMachine.id, {}, JSON.stringify({'name': "filler value"})); 
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
		<div>
			<div>
                <div style={{display: "inline-flex", align: "center", padding: "10px"}}>
                    <div style={{padding: "0px 10px"}}>
                        <label>Barley</label> <br></br>
                        <progress id="barley" value={livedata.ingredients.barley} max="35000"></progress> <br></br>
                        <p>{livedata.ingredients.barley}</p>
                    </div>
                    <div style={{padding: "0px 10px"}}>
                        <label>Hops</label> <br></br>
                        <progress id="hops" value={livedata.ingredients.hops} max="35000"></progress> <br></br>
                        {livedata.ingredients.hops}
                    </div>
                    <div style={{padding: "0px 10px"}}>
                        <label>Malt</label> <br></br>
                        <progress id="malt" value={livedata.ingredients.malt} max="35000"></progress> <br></br>
                        {livedata.ingredients.malt}
                    </div>
                    <div style={{padding: "0px 10px"}}>
                        <label>Wheat</label> <br></br>
                        <progress id="wheat" value={livedata.ingredients.wheat} max="35000"></progress> <br></br>
                        {livedata.ingredients.wheat}
                    </div>
                    <div style={{padding: "0px 10px"}}>
                        <label>Yeast</label> <br></br>
                        <progress id="yeast" value={livedata.ingredients.yeast} max="35000"></progress> <br></br>
                        {livedata.ingredients.yeast}
                    </div>
                </div>
                <br></br>
                <div style={{display: "inline-flex", align: "center", padding: "10px"}}>
                    <div style={{padding: "0px 25px"}}>
                        <Icon icon="carbon:rain-drop" style={{width: "80px", height: "80px"}}/>
                        <p>Humidity</p>
                        <h1>{Math.round(livedata.humidity)}</h1>
                    </div>

                    <div style={{padding: "0px 25px"}}>
                        <Icon icon="ph-vibrate" style={{width: "80px", height: "80px"}}/>
                        <p>Vibration</p>
                        <h1>{Math.round(livedata.vibration)}</h1>
                    </div>

                    <div style={{padding: "0px 25px"}}>
                        <Icon icon="fluent:temperature-24-regular" style={{width: "80px", height: "80px"}}/>
                        <p>Temperature</p>
                        <h1>{Math.round(livedata.temperature)}</h1>
                    </div>
                    <div style={{padding: "0px 25px"}}>
                        <Icon icon="cil-speedometer" style={{width: "80px", height: "80px"}}/>
                        <p>Speed</p>
                        <h1>{Math.round(livedata.normSpeed)}%</h1>
                    </div>
                    <div style={{padding: "0px 25px"}}>
                        <Icon icon="mdi-state-machine" style={{width: "80px", height: "80px"}}/>
                        <p>State</p>
                        <h1>{livedata.state}</h1>
                    </div>
                </div>
                <br></br>
                <div style={{display: "inline-flex", align: "center", padding: "10px"}}>
                    <div style={{padding: "0px 25px"}}>
                        <Icon icon="jam-bottle-f" style={{width: "80px", height: "80px"}}/>
                        <p>Beer type</p>
                        <h1>missing data</h1>
                    </div>
                    <div style={{padding: "0px 25px"}}>
                        <Icon icon="bx-bxs-flag-checkered" style={{width: "80px", height: "80px"}}/> <br></br>
                        <p>Amount to produce</p>
                        <h1>data missing</h1>
                    </div>

                    <div style={{padding: "0px 25px"}}>
                        <Icon icon="jam-bottle" style={{width: "80px", height: "80px"}}/>
                        <p>Produced</p>
                        <h1>{livedata.processed}</h1>
                    </div>

                    <div style={{padding: "0px 25px"}}>
                        <Icon icon="fluent:checkmark-16-regular" style={{width: "80px", height: "80px"}}/>
                        <p>Acceptable</p>
                        <h1>{livedata.acceptableProducts}</h1>
                    </div>

                    <div style={{padding: "0px 25px"}}>
                        <Icon icon="akar-icons:cross" style={{width: "80px", height: "80px"}}/>
                        <p>Defect</p>
                        <h1>{livedata.defectProducts}</h1>
                    </div>
                </div>
                <br></br>
                <div style={{display: "inline-flex", align: "center", padding: "10px"}}>
                    <div style={{padding: "0px 10px"}}>
                        <label>Maintenance</label> <br></br>
                        <progress id="maintenance" style={{width: "680px", height: "40px"}} value={livedata.maintenance} max="30000"></progress> <br></br>
                        <p>{(livedata.maintenance / 30000 * 100).toFixed(1)}%</p>
                    </div>
                </div>
                <br></br>
                <div style={{display: "inline-flex", align: "center", padding: "10px"}}>
                    <div style={{padding: "0px 25px"}}>
                        <Icon icon="mdi-archive" style={{width: "80px", height: "80px"}}/>
                        <p>Batch id</p>
                        <h1>unknown data</h1>
                    </div>
                </div>
            </div>
		</div>
	);

}