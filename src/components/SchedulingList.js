import React, { useState }  from 'react'
import styled from 'styled-components';
import { Icon } from '@iconify/react';
import crossIcon from '@iconify-icons/akar-icons/cross';


export const SchedulingList = (props) => {
	const [selected, setSelected] = useState('');
		
	const selectRow = (e) => {
		setSelected(e.target.parentNode.getAttribute('id'));
	}

	const removeScheduledBatch = (e) => {
		e.preventDefault(); 
		let id = e.target.parentNode.parentNode.getAttribute('id');

        fetch("http://localhost:8080/api/scheduled-batches/" + id, {
            method: 'DELETE',
            headers: {'Content-Type': 'application/json'}
        }).then(response => {
            if(response.status === 200){
                props.update()
			}
        })	
	}

	return (
		<div>
			<Styledtable id="table" onClick={selectRow}>
				<Styledthead>
					<tr>
						<th>Product</th>
						<th>Amount</th>
						<th>Speed</th>
						<th></th>
					</tr>
				</Styledthead>
				<Styledbody>
					{props.scheduled.map((element) => (
						<tr id={element.id} key={element.id} style={selected === element.id ? {background: "#7ac8ff"} : {fontSize: "1.0em"}}>
							<td>{element.type.charAt(0) + element.type.slice(1).toLowerCase().replace('_', '\u00A0')}</td>
							<td>{element.amount}</td>
							<td>{element.speed}</td>
							<td style={{textAlign: "right", width: "10px"}}><Deletebutton onClick={removeScheduledBatch}> <Icon icon={crossIcon} color="#fff" width="20" /></Deletebutton></td>
						</tr>
					))}
				</Styledbody>
			</Styledtable>
		</div>
	);
};


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
