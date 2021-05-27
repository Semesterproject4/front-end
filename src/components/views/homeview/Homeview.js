import React, {useState, useEffect} from 'react'
import { Col } from '../../ui/Grid';
import { HomeviewInput } from './HomeviewInput';
import { HomeviewList } from './HomeviewList';

export const Homeview = (props) => {
	const [machines, setMachines] = useState([]);

	useEffect(() => {
		updateMachineList();
	}, [])

	const updateMachineList = () =>{
        fetch('http://localhost:8080/api/machines')
        .then(response => {
            if (response.status === 200) {
                response.json().then(data => {
					setMachines(data);
					data.forEach((element) => {
						if (props.currentMachine.id === element.id) {
							props.setCurrentMachine(element);
						}
					})
                })
            }
        });
    }

	return (
		<Col size={1} justify="center">
			<HomeviewInput update={updateMachineList} />

			<HomeviewList machines={machines} update={updateMachineList} currentMachine={props.currentMachine} setCurrentMachine={props.setCurrentMachine} />
		</Col>
	);
}