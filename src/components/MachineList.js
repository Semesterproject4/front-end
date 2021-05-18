import React, {useState, useEffect} from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components';
import { Icon } from '@iconify/react-with-api';


export const MachineList = (props) => {
	const [machines, setMachines] = useState([]);
	const [selected, setSelected] = useState('');
	const [selectedMachine, setSelectedMachine]= useState("");
	const [machineIP, setMachineIP] = useState("");
	const [machineName, setMachineName] = useState("");
	const [success, setSuccess] = useState(true);
	const [statusMessage, setStatusMessage] = useState("");
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
						setSelectedMachine(machines[0])
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
            if(response.status !== 200){
				setSuccess(false);
            }else{
                setSuccess(true);
                updateMachineList();
            }

            return response.text();
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

	//When button is pressed we send the 
	const selectMachineHandler = () => {
		//Sends the current machine to App.js
		props.setCurrentMachine(selectedMachine)
	}

	//Handler for the selection of a new machine in the list
	const change = (e) => {
		let selectedJSON = JSON.parse(e.target.value)
		setSelectedMachine({
			ip: selectedJSON.label,
			id: selectedJSON.value,
			name: selectedJSON.name,
			autobrewing: selectedJSON.autobrewing
		})
	}

	const selectRow = (e) => {
		setSelected(e.target.parentNode.getAttribute('id'));
	}

	return (
		<div>
			<Styledform>
				<input placeholder = "opc.tcp://<ip address>:<port>" value = {machineIP} onChange = {ipChanged} ></input>
				<input placeholder = "machine name" value = {machineName} onChange = {machineNameChanged} />
				<button onClick = {addMachineHandler} disabled = {!(validIP && validName)}>Add machine</button>
			</Styledform>
			{console.log("Machines:", machines)}
			{console.log("Machine:", machines[0])}

			<Styledtable id="table" onClick={selectRow}>
				<Styledthead>
					<tr>
						<th>Name</th>
						<th>IP</th>
						<th>Autobrewing</th>
						<th></th>
					</tr>
				</Styledthead>
				<Styledbody>
					{machines.map((element) => (
						<tr id={element.id} autobrewing={element.autobrewing} machine={element} key={element.id} style={selected === element.id ? {background: "#7ac8ff"} : {fontSize: "1.0em"}}>
							<td>{element.name}</td>
							<td>{element.ip}</td>
							<td>{element.autobrewing}</td>
																															
							<td style={{textAlign: "right", width: "10px"}}><Deletebutton> <Icon icon="akar-icons:cross" color="#fff" width="20" pointerEvents="none"/></Deletebutton></td>
						</tr>
					))}
				</Styledbody>
			</Styledtable>

			<Link to="/control">
				<Styledbutton onClick={selectMachineHandler}>Connect</Styledbutton>
			</Link> 

		</div>
	);
}


const Styledbutton = styled.button`
	font-size: 1.1em;
	width: 20%;
	height: 41px;
	cursor: pointer;
	background: #7ac8ff;
	outline: none;
	border: none;
	color: black;

	&:hover {
		background: #99d5ff;
	}

	&:disabled {
		background: grey;
		color: white;
	}
`

const Styledform = styled.form`
	& select {
		font-size: 1.1em;
		width: 30%;
		height: 40px;
		padding: 0px 15px 0px 15px;
		border: 0px;

		&:focus {
			outline: none;
		}
	}
	& input {
		font-size: 1.1em;
		width: 25%;
		height: 40px;
		border: 0px;
		padding: 15px;
		transform: translate(0px, -1px);
		border-left: 1px solid #efefef;
		

		&:focus {
			outline: none;
			border-bottom: 1px solid #7ac8ff;
		}
	}

	& button {
		font-size: 1.1em;
		width: 20%;
		height: 41px;
		cursor: pointer;
		background: #7ac8ff;
		outline: none;
		border: none;
		color: black;

		&:hover {
			background: #99d5ff;
		}

		&:disabled {
			background: grey;
			color: white;
		}
	}
`


const Styledtable = styled.table`
	margin: auto;
	width: 60%;
	border-collapse: collapse;
	background: white;  
	-webkit-box-shadow: 0px 0px 10px 2px rgba(0, 0, 0, 0.1);
		box-shadow: 0px 0px 10px 2px rgba(0, 0, 0, 0.1); 

`

const Styledthead = styled.thead`
	& tr {
		& th {
			font-size: 1.2em;
			height: 25px;
			font-weight: bold;
			padding: 20px;
			user-select: none;
		}
	}
`

const Styledbody = styled.tbody`
	& tr {
		cursor: pointer;

		& td {
			font-size: 1.0em;
			padding: 0px;  
			height: 40px;
			user-select: none;
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
`

const Deletebutton = styled.button`
	background-color: #eb5f54;
	width: 40px;
	height: 100%;
	border-top-left-radius: 8px;
  	border-bottom-left-radius: 8px;
	outline: none;
	border: none;
  	cursor: pointer;

	&:hover {
		background-color: #f44336;		
	}
`