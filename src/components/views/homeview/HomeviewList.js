import React from 'react'
import { Link } from 'react-router-dom'
import { Icon } from '@iconify/react-with-api';
import { DeleteButton, ConnectButton } from '../../ui/Buttons';
import { Row } from '../../ui/Grid';
import { Switch, SwitchSlider, SwitchInput } from '../../ui/Switch';
import { Table, Head, Body, HidingTH, HidingTD } from '../../ui/Tables';


export const HomeviewList = (props) => { 

	const removeConnection = (e) => {
		e.preventDefault(); 
		let id = e.target.parentNode.parentNode.getAttribute('id');
		
        fetch("http://localhost:8080/api/machines/" + id, {
            method: 'DELETE',
            headers: {'Content-Type': 'application/json'}
        }).then(response => {
            if(response.status === 200){
				props.update();

				if (id === props.currentMachine.id) {
					props.setCurrentMachine({			
						ip: "none",
						id: "",
						name: "",
						autobrewing: false
					})
				}
			}
        })			
	}

	const toggleAutobrew = (e) => {
		let command = "";
		e.target.checked ? command = "start" : command = "stop";

		fetch("http://localhost:8080/api/machines/" + e.target.id + "/autobrew/" + command, {
            method: 'PATCH',
            headers: {'Content-Type': 'application/json'}
        }).then(response => {
            if(response.status === 200){
				props.update();
			}
        })
	}

	const connectToMachine = (e) => {
		let id = e.target.parentNode.parentNode.parentNode.id;
		props.machines.forEach((element) => {
			if (element.id === id)
				props.setCurrentMachine(element);
		})
	}

	return (
		<Row>	
			<Table id="table">
				<Head>
					<tr>
						<th>Name</th>
						<HidingTH>IP</HidingTH>
						<th>AutoBrew</th>
						<th></th>
						<th></th>
					</tr>
				</Head>
				<Body>
					{props.machines.map((element) => (
						<tr id={element.id} autobrewing={element.autobrewing.toString()} machine={element} key={element.id}>
							<td>{element.name}</td>
							<HidingTD>{element.ip}</HidingTD>
							<td>
								<Switch>
									<SwitchInput id={element.id} type="checkbox" checked={element.autobrewing} onChange={toggleAutobrew}></SwitchInput>
									<SwitchSlider></SwitchSlider>
								</Switch>
							</td>																																
							<td style={{textAlign: "right", width: "10px"}} onClick={removeConnection}><DeleteButton> <Icon icon="akar-icons:cross" color="#fff" width="20" pointerEvents="none" /></DeleteButton></td>
							<td style={{textAlign: "right", width: "30px"}} onClick={connectToMachine}>
								<Link to="/control">
									<ConnectButton> CONNECT </ConnectButton>
								</Link>
							</td>
						</tr>
					))}
				</Body>
			</Table>
		</Row>
	);
}