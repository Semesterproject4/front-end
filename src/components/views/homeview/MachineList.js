import React, {useState, useEffect} from 'react'
import { Link } from 'react-router-dom'
import { Icon } from '@iconify/react-with-api';
import { Form } from '../../ui/Forms';
import { FormButton, DeleteButton, ConnectButton } from '../../ui/Buttons';
import { Row, Col } from '../../ui/Grid';
import { Switch, SwitchSlider, SwitchInput } from '../../ui/Switch';
import { Table, Head, Body, HidingTH, HidingTD } from '../../ui/Tables';


export const MachineList = (props) => {
	const [machines, setMachines] = useState([]);
	const [selected, setSelected] = useState(null);
	const [machineIP, setMachineIP] = useState("");
	const [machineName, setMachineName] = useState("");
	const [validIP, setValidIP] = useState(false);
	const [validName, setValidName] = useState(false);

	useEffect(() => {
		updateMachineList();
	}, [])

	const updateMachineList = () =>{
        fetch('http://localhost:8080/api/machines')
        .then(response => {
            if (response.status === 200) {
                response.json().then(data => {
					setMachines(data);

                    //Sets first machine as default as the list will have it selected initially
                    if (machines.length !== 0) {
						setSelected(machines[0].id)
                    }
                })
            }
        });
    }

	const addMachineHandler = (e) =>{
        e.preventDefault(); 
        let data = {ip: machineIP, name: machineName};

        fetch("http://localhost:8080/api/machines/",{
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        }).then(response => {
            if(response.status === 200){
				setMachineIP("");
				setMachineName("");
                updateMachineList();
            }
        })
    }

	const removeConnection = (e) => {
		e.preventDefault(); 
		let id = e.target.parentNode.parentNode.getAttribute('id');
		
        fetch("http://localhost:8080/api/machines/" + id, {
            method: 'DELETE',
            headers: {'Content-Type': 'application/json'}
        }).then(response => {
            if(response.status === 200){
				updateMachineList();

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

	const ipChanged = (e) =>{
		setMachineIP(e.target.value);
		setValidIP(e.target.value !== "");
    }

    const machineNameChanged = (e) =>{
		setMachineName(e.target.value);
		setValidName(e.target.value !== "");
    }

	//When button is pressed we send the selected machine to App.js
	const selectMachineHandler = (e) => {
		let id = e.target.parentNode.parentNode.parentNode.id;
		machines.forEach((element) => {
			if (element.id === id)
				props.setCurrentMachine(element);
		})
	}

	const selectRow = (e) => {
		setSelected(e.target.parentNode.getAttribute('id'));
	}

	const toggleAutobrew = (e) => {
		let command = "";
		e.target.checked ? command = "start" : command = "stop";


		fetch("http://localhost:8080/api/machines/" + e.target.id + "/autobrew/" + command, {
            method: 'PATCH',
            headers: {'Content-Type': 'application/json'}
        }).then(response => {
            if(response.status === 200){
				updateMachineList();
			}
        })

	}


	return (
		<Col size={1} justify="center">
			<Form width={100}>
				<Row justify="center" align="stretch">
					<Col size={3} alignContent="stretch">
						<input placeholder = "opc.tcp://<ip address>:<port>" value = {machineIP} onChange = {ipChanged}></input>
					</Col>
					<Col size={3} alignContent="stretch" style={{borderLeft: "1px solid #EFEFEF"}}>
						<input placeholder = "Machine name" value = {machineName} onChange = {machineNameChanged}/>
					</Col>
					<Col size={1} alignContent="stretch">
						<FormButton onClick = {addMachineHandler} disabled = {!(validIP && validName)}>Add machine</FormButton>
					</Col>
				</Row>
			</Form>

			<Row>	
				<Table id="table" onClick={selectRow}>
					<Head>
						<tr>
							<th>Name</th>
							<HidingTH>IP</HidingTH>
							<th>Autobrewing</th>
							<th></th>
							<th></th>
						</tr>
					</Head>
					<Body>
						{machines.map((element) => (
							<tr id={element.id} autobrewing={element.autobrewing.toString()} machine={element} key={element.id}>
								<td>{element.name}</td>
								<HidingTD>{element.ip}</HidingTD>
								<td>
									<Switch>
										<SwitchInput id={element.id} type="checkbox" checked={element.autobrewing} onClick={toggleAutobrew}></SwitchInput>
										<SwitchSlider></SwitchSlider>
									</Switch>
								</td>
								{/* <td>{element.autobrewing ? 
									<Icon icon="bi:circle-fill" color="#2cb833" width="20" pointerEvents="none" style={{transform: "translateX(0px) translateY(2px)"}}/>
									: 
									<Icon icon="bi:slash-circle-fill" color="#b8352c" width="20" pointerEvents="none" style={{transform: "translateX(0px) translateY(2px)"}}/>}
								</td> */}
																																
								<td style={{textAlign: "right", width: "10px"}} onClick={removeConnection}><DeleteButton> <Icon icon="akar-icons:cross" color="#fff" width="20" pointerEvents="none" /></DeleteButton></td>
								<td style={{textAlign: "right", width: "30px"}} onClick={selectMachineHandler}>
									<Link to="/control">
										<ConnectButton> CONNECT </ConnectButton>
									</Link>
								</td>
							</tr>
						))}
					</Body>
				</Table>
			</Row>
		</Col>
	);
}