import React, { useState }  from 'react'
import styled from 'styled-components';
import { Icon } from '@iconify/react-with-api';

export const SchedulingList = (props) => {
	const [selected, setSelected] = useState('');
	const [draggedRow, setDraggedRow] = useState('');
		
	const selectRow = (e) => {
		setSelected(e.target.parentNode.getAttribute('id'));
	}

	const dragStart = (e) => {
		setDraggedRow(e.target) 
	}

	const dragOver = (e) => {
		let allRows = Array.from(e.target.parentNode.parentNode.children);
		
		if(allRows.indexOf(e.target.parentNode)>allRows.indexOf(draggedRow))
		  	e.target.parentNode.after(draggedRow);
		else
		  	e.target.parentNode.before(draggedRow);		
	}

	const dragStop = (e) => {
		// Get list from table datay
		let body = e.target.parentNode;
		let rows = Array.from(body.children);
		let list = [];

		rows.forEach(row => {
			let cells = Array.from(row.children)

			let data = {
				"id": row.id,
				"type": cells[1].outerText.toUpperCase().replace(' ', '_'),
				"amount": parseInt(cells[2].outerText),
				"speed": parseInt(cells[3].outerText)
			}
			list.push(data);
		})

		//Fetch backend to update database
		reprioritizeList(list);
	}

	const reprioritizeList = (list) => {
		fetch("http://localhost:8080/api/scheduled-batches/prioritizeQueue", {
			method: 'PATCH',
			headers: {'Content-Type': 'application/json'},
			body: JSON.stringify(list)
		}).then(response => {
			if (response.status === 200) {
				props.update();
			}
		})
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
						<th></th>
						<th>Product</th>
						<th>Amount</th>
						<th>Speed</th>
						<th></th>
					</tr>
				</Styledthead>
				<Styledbody>
					{props.scheduled.map((element) => (
						<tr id={element.id} key={element.id} style={selected === element.id ? {background: "#7ac8ff"} : {fontSize: "1.0em"}} draggable='true' onDragStart={dragStart} onDragOver={dragOver} onDragEnd={dragStop}>
							<td style={{textAlign: "center", width: "6%", borderRight: "1px solid whitesmoke", cursor: "grab"}}>☰</td>
							<td>{element.type.charAt(0) + element.type.slice(1).toLowerCase().replace('_', '\u00A0')}</td>
							<td>{element.amount}</td>
							<td>{element.speed}</td>
																															
							<td style={{textAlign: "right", width: "10px"}}><Deletebutton onClick={removeScheduledBatch}> <Icon icon="akar-icons:cross" color="#fff" width="20" pointerEvents="none"/></Deletebutton></td>
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
	counter-reset: row-num;
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
		counter-increment: row-num;

		& td:first-child::after {
			content: " #" counter(row-num);
			font-size: 0.8em;
		}

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
