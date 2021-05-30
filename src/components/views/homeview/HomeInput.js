import React, { useState } from 'react'
import { Form } from '../../ui/Forms';
import { FormButton } from '../../ui/Buttons';
import { Row, Col } from '../../ui/Grid';

export const HomeInput = (props) => { 
	const [machineIP, setMachineIP] = useState("");
	const [machineName, setMachineName] = useState("");
	const [validIP, setValidIP] = useState(false);
	const [validName, setValidName] = useState(false);

	const ipChanged = (e) =>{
		setMachineIP(e.target.value);
		setValidIP(e.target.value !== "");
    }

    const machineNameChanged = (e) =>{
		setMachineName(e.target.value);
		setValidName(e.target.value !== "");
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
				setValidIP(false);
				setValidName(false);
                props.update();
            }
        })
    }

	return (
		<Form width={100}>
			<Row justify="center" align="stretch">
				<Col size={3} alignContent="stretch">
					<input placeholder = "Machine name" value = {machineName} onChange = {machineNameChanged}/>
				</Col>
				<Col size={3} alignContent="stretch" style={{borderLeft: "1px solid #EFEFEF"}}>
					<input placeholder = "opc.tcp://<ip address>:<port>" value = {machineIP} onChange = {ipChanged}></input>
				</Col>
				<Col size={1} alignContent="stretch">
					<FormButton onClick = {addMachineHandler} disabled = {!(validIP && validName)}>Add machine</FormButton>
				</Col>
			</Row>
		</Form>
	);
}