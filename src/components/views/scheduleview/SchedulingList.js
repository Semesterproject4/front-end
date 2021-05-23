import React, { useState }  from 'react'
import { Icon } from '@iconify/react-with-api';
import { Table, Head, SortableBody } from '../../ui/Tables';
import { DeleteButton } from '../../ui/Buttons';

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
			<Table id="table" onClick={selectRow}>
				<Head>
					<tr>
						<th></th>
						<th>Product</th>
						<th>Amount</th>
						<th>Speed</th>
						<th></th>
					</tr>
				</Head>
				<SortableBody>
					{props.scheduled.map((element) => (
						<tr id={element.id} key={element.id} style={selected === element.id ? {background: "#7ac8ff"} : {fontSize: "1.0em"}} draggable='true' onDragStart={dragStart} onDragOver={dragOver} onDragEnd={dragStop}>
							<td style={{textAlign: "center", width: "6%", borderRight: "1px solid whitesmoke", cursor: "grab"}}>☰</td>
							<td>{element.type.charAt(0) + element.type.slice(1).toLowerCase().replace('_', '\u00A0')}</td>
							<td>{element.amount}</td>
							<td>{element.speed}</td>
																															
							<td style={{textAlign: "right", width: "10px"}}><DeleteButton onClick={removeScheduledBatch}> <Icon icon="akar-icons:cross" color="#fff" width="20" pointerEvents="none"/></DeleteButton></td>
						</tr>
					))}
				</SortableBody>
			</Table>
		</div>
	);
};

