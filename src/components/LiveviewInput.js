import React, { useState, useEffect }  from 'react'
import styled from 'styled-components';

export const LiveviewInput = (props) => {
	const [type, setType] = useState("Pilsner");
	const [amount, setAmount] = useState("");
	const [speed, setSpeed] = useState("");
	const [products, setProducts] = useState([]);
	const [validAmount, setValidAmount] = useState(false);
	const [validSpeed, setValidSpeed] = useState(false);
	const [currentMachine, setCurrentMachine] = useState("");

	useEffect(() => {
		fetchProducts();
		setCurrentMachine(props.currentMachine);
	}, [props.currentMachine])

	const fetchProducts = async () => {
		const url = 'http://localhost:8080/api/machines/products';
		const data = await fetch(url);
		const result = await data.json();
		setProducts(result.products)
	};

	const fetchMachine = async () => {
		const url = 'http://localhost:8080/api/machines/' + currentMachine.id;
		const data = await fetch(url);
		const result = await data.json();
		setCurrentMachine(result);
	};

    const changeType = (e) => {
		setType(e.target.value);
		setSpeed("");
		setValidSpeed(false);
    }

    const changeAmount = (e) => {
		//Check that amount only contains numbers
		const regex = /^\d+$/;
		setValidAmount(regex.test(e.target.value));

		setAmount(e.target.value);
    }

    const changeSpeed = (e) => {
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

	const getMaxSpeed = (selectedProduct) => {
		let result = "?";
		products.forEach(product => {
			if (selectedProduct === product.name) {
				result = product.speed;
			}

		});

		return result;
	}

	const getOptimalSpeed = (selectedProduct) => {
        let result = "?";
        products.forEach(product => {
            if (selectedProduct === product.name) {
                result = product.optimal;
            }

        });

        return result;
    }

	const controlMachineButtonPress = (e) => {
		if (e.target.value === "abort") {
		//Sends a Patch request
		fetch("http://localhost:8080/api/machines/" + currentMachine.id + "/autobrew/stop", {
            method: 'PATCH',
            headers: {'Content-Type': 'application/json'}
        }).then(response => {
            if(response.status === 200){
				fetchMachine();
			}
        })
		}

        //Created a JSON object with "command: {the command stored on the respective button}"
        let data = {
            command: e.target.value
        }

        //If the start button was pressed
        if (data.command === "start") {
            //Set variables as json
            let variables = {
                beerType: type,
                batchSize: amount,
                speed: speed
            }

            //Fetch the api with the variables as body
            fetch("http://localhost:8080/api/machines/" + currentMachine.id + "/variables", {
                method: "PUT",
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(variables)
            })
        }

        //Sends the HTTP request to the API
        fetch("http://localhost:8080/api/machines/" + currentMachine.id + "?command=" + data.command, {
            method: "PATCH",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        })

        //Reset input fields
		setSpeed("");
		setAmount("");
    }

	const autoBrewPress = (e) => {
		//Sends a Patch request
		fetch("http://localhost:8080/api/machines/" + currentMachine.id + "/autobrew/" + e.target.value, {
            method: 'PATCH',
            headers: {'Content-Type': 'application/json'}
        }).then(response => {
            if(response.status === 200){
				fetchMachine();
			}
        })
	}

	const disabledStart = () => {
		if (currentMachine.autobrewing)
			return true;

		if (validAmount && validSpeed && props.state === "IDLE")
			return false;
		return true;
	}

	const disabledStop = () => {
		if (currentMachine.autobrewing)
			return true;

		if (props.state === "STOPPED" || props.state === "STOPPING" || props.state === "CLEARING" || props.state === "ABORTING" || props.state === "ABORTED")
			return true;
		return false;
	}

	const disabledReset = () => {
		if (currentMachine.autobrewing)
			return true;

		if (props.state === "COMPLETE" || props.state === "STOPPED")
			return false;
		return true;
	}

	const disabledClear = () => {
		if (currentMachine.autobrewing)
			return true;

		if (props.state === "ABORTED")
			return false;
		return true;
	}

	const disabledAbort = () => {
		if (props.state === "ABORTING" || props.state === "ABORTED")
			return true;
		return false;
	}

	return (
		<div>
			<div>
				<Styledform>
					<select onChange={changeType}>
						{products.map((product) => (
							<option value={product.name} key={product.name}>
								{product.name} 
							</option>
						))}
					</select>

					<input placeholder = "Amount" value={amount} onChange={changeAmount}></input>
					<input placeholder ={"Speed <= " + getMaxSpeed(type) + " | Best = " + getOptimalSpeed(type) } value={speed} onChange={changeSpeed}></input>

				</Styledform>
			</div>
			<div>
				<Styledbutton value="start"	onClick={controlMachineButtonPress} disabled={disabledStart()}>
					Start
				</Styledbutton>
				<Styledbutton value="stop" onClick={controlMachineButtonPress} disabled={disabledStop()}>
					Stop
				</Styledbutton>
				<Styledbutton value="reset" onClick={controlMachineButtonPress} disabled={disabledReset()}>
					Reset
				</Styledbutton>
				<Styledbutton value="clear" onClick={controlMachineButtonPress} disabled={disabledClear()}>
					Clear
				</Styledbutton>
				<Styledbutton value="abort" onClick={controlMachineButtonPress} disabled={disabledAbort()}>
					Abort
				</Styledbutton>
				<Styledbutton value="start"	onClick={autoBrewPress} disabled={currentMachine.autobrewing}>
					Start Auto Brew
				</Styledbutton>
				<Styledbutton value="stop"	onClick={autoBrewPress} disabled={!currentMachine.autobrewing}>
					Stop Auto Brew
				</Styledbutton>
			</div>
		</div>
	);
}

const Styledbutton = styled.button`
	font-size: 1.1em;
	width: 10%;
	height: 41px;
	cursor: pointer;
	background: #7ac8ff;
	outline: none;
	border: 1px solid black;
	color: black;
	margin: 10px;

	&:hover {
		background: #99d5ff;
	}

	&:disabled {
		background: grey;
		color: white;
	}
`

const Styledform = styled.form`
    margin: 5px 5px;
	
	& select {
		margin: 5px 5px;
	}
	& input {
		margin: 5px 5px;
	}

`
