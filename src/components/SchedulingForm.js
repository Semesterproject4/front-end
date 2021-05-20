import React, { useState, useEffect }  from 'react'
import styled from 'styled-components';
import { Form } from './ui/Forms';
import { FormButton } from './ui/Buttons';
 
export const SchedulingForm = (props) => {
	const [amount, setAmount] = useState('');
	const [speed, setSpeed] = useState('');
	const [type, setType] = useState('');
	const [validAmount, setValidAmount] = useState(false);
	const [validSpeed, setValidSpeed] = useState(false);

	useEffect(() => {
		setType(props.products[0].name)
	}, [props.products])


	const addScheduledBatch = (e) => {
        e.preventDefault(); 

		if (validAmount && validSpeed) {
			let data = {
				"speed": speed,
				"type": type.toUpperCase().replace(" ", "_"),
				"amount": amount
			};

			fetch("http://localhost:8080/api/scheduled-batches", {
				method: 'POST',
				headers: {'Content-Type': 'application/json'},
				body: JSON.stringify(data)
			}).then(response => {
				if(response.status === 200){
					setAmount("");
					setSpeed("");
					setValidAmount(false);
					setValidSpeed(false);
					props.update();
				}
			})
		}
    }

    const onSpeedChanged = (e) =>{
		setSpeed(e.target.value);

		//Check that speed only contains numbers
		const regex = /^\d+$/;
		setValidSpeed(regex.test(e.target.value));

		//Check that value is within acceptable range
		if (e.target.value > 0 && e.target.value <= getMaxSpeed(type)) {
			setValidSpeed(true);
		} else {
			setValidSpeed(false);
		}
    }

    const onAmountChanged = (e) => {
		//Check that amount only contains numbers
		const regex = /^\d+$/;
		setValidAmount(regex.test(e.target.value));

		setAmount(e.target.value);
    }

    const changeBeerType = (e) => {
		setType(e.target.value);
		setSpeed("");
		setValidSpeed(false);
    }

	const getMaxSpeed = (selectedProduct) => {
		let result = "?";
		props.products.forEach(product => {
			if (selectedProduct === product.name) {
				result = product.speed;
			}

		});

		return result;
	}

	const getOptimalSpeed = (selectedProduct) => {
        let result = "?";
        props.products.forEach(product => {
            if (selectedProduct === product.name) {
                result = product.optimal;
            }

        });

        return result;
    }

	return (
		<Styleddiv>
			<Form>
				<select onChange={changeBeerType}>
					{props.products.map((product) => (
						<option value={product.name} key={product.name}>
							{product.name} 
						</option>
					))}
				</select>

				<input placeholder="Amount" value={amount} onChange={onAmountChanged}/>
				<input placeholder={"Speed <= " + getMaxSpeed(type) + " | Best = " + getOptimalSpeed(type) } value={speed} onChange={onSpeedChanged}/>

				<FormButton onClick={addScheduledBatch} disabled={!(validAmount && validSpeed)}>
					ADD
				</FormButton>           
			</Form>
		</Styleddiv>
	);
}

const Styleddiv = styled.div`
  	margin: auto;
	width: 60%;
`
