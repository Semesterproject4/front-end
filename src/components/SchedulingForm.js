import React, { useState, useEffect }  from 'react'
import styled from 'styled-components';
 
export const SchedulingForm = (props) => {
	const [amount, setAmount] = useState('');
	const [speed, setSpeed] = useState('');
	const [type, setType] = useState('');
	const [validInput, setValidInput] = useState(false);

	useEffect(() => {
		setType(props.products[0].name)
	}, [])


	const addScheduledBatch = (e) => {
        e.preventDefault(); 

		if (validInput) {
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
					props.update();
				}
			})
		}
    }

    const onSpeedChanged = (e) =>{
		setSpeed(e.target.value);


		//Check that speed only contains numbers
		const regex = /^\d+$/;;
		setValidInput(regex.test(e.target.value));

		//Check that value is within acceptable range
		if (e.target.value > 0 && e.target.value <= getMaxSpeed(type)) {
			setValidInput(true);
		} else {
			setValidInput(false);
		}

    }

    const onAmountChanged = (e) =>{
		setAmount(e.target.value);
    }

    const changeBeerType = (e) => {
		setType(e.target.value);
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

	return (
		<Styleddiv>
			<Styledform>
				<select onChange={changeBeerType}>
					{props.products.map((product) => (
						<option value={product.name} key={product.name}>
							{product.name} 
						</option>
					))}
				</select>

				{console.log("HER:", getMaxSpeed(type))}
				<input placeholder="Amount..." value={amount} onChange={onAmountChanged}/>
				<input placeholder={"Speed < " + getMaxSpeed(type) } value={speed} onChange={onSpeedChanged}/>

				<button onClick={addScheduledBatch} disabled={!validInput}>
					ADD
				</button>           
			</Styledform>
		</Styleddiv>
	);
}

const Styleddiv = styled.div`
  	margin: auto;
	width: 60%;
`

const Addbutton = styled.button`
  	cursor: pointer;
	background: #36f459;
`

const Styledform = styled.form`

	& select {
		font-size: 1.1em;
		width: 30%;
		height: 40px;
		padding: 0px 15px 0px 15px;
		border: 0px;
		transform: translate(0px, 1px);

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

		&:focus {
			outline: none;
			border-bottom: 1px solid #7ac8ff;
		}
	}

	& button {
		font-size: 1.1em;
		width: 20%;
		height: 40px;
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
