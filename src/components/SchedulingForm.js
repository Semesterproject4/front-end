import React, { useState, useEffect }  from 'react'
import styled from 'styled-components';
 
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

				<input placeholder="Amount" value={amount} onChange={onAmountChanged}/>
				<input placeholder={"Speed <= " + getMaxSpeed(type) } value={speed} onChange={onSpeedChanged}/>

				<button onClick={addScheduledBatch} disabled={!(validAmount && validSpeed)}>
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

const Styledform = styled.form`
	
	-webkit-box-shadow: 0px 0px 10px 2px rgba(0, 0, 0, 0.1);
		box-shadow: 0px 0px 10px 2px rgba(0, 0, 0, 0.1);  

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
