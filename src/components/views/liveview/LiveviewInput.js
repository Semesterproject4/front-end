import React, { useState, useEffect }  from 'react'
import { Form } from '../../ui/Forms';
import { FormButton, AbortButton } from '../../ui/Buttons';
import { Grid, Col, Row } from '../../ui/Grid'
import { Switch, SwitchSlider, SwitchInput } from '../../ui/Switch';

export const LiveviewInput = (props) => {
	const [type, setType] = useState("Pilsner");
	const [amount, setAmount] = useState("");
	const [speed, setSpeed] = useState("");
	const [products, setProducts] = useState([]);
	const [validAmount, setValidAmount] = useState(false);
	const [validSpeed, setValidSpeed] = useState(false);
	const [currentMachine, setCurrentMachine] = useState(props.currentMachine);

	useEffect(() => {
		fetchProducts();
	}, [])

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
				beerType: type.toUpperCase().replace(' ', '_'),
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
		setValidSpeed(false);
		setAmount("");
		setValidAmount(false);
		fetchMachine();
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

	const toggleAutobrew = (e) => {
		let command = "";
		e.target.checked ? command = "start" : command = "stop";

		fetch("http://localhost:8080/api/machines/" + e.target.id + "/autobrew/" + command, {
            method: 'PATCH',
            headers: {'Content-Type': 'application/json'}
        }).then(response => {
            if(response.status === 200){
				fetchMachine();
			}
        })
	}

	return (
		<Grid width={100}>
			<Row style={{backgroundColor:"#efefef", padding:"5px 0px 5px 15px"}}>
				<p style={{paddingRight:"10px"}}>AutoBrew</p>
				<Switch>
					<SwitchInput
						id={currentMachine.id}
						type="checkbox"
						checked={currentMachine.autobrewing}
						onChange={toggleAutobrew}
					></SwitchInput>
					<SwitchSlider></SwitchSlider>
				</Switch>
			</Row>
			<Form style={{boxShadow: "0px 0px 0px 0px rgba(0, 0, 0, 0.0)"}}>
				<Grid>
					<Row>
						<select onChange={changeType}>
							{products.map((product) => (
								<option value={product.name} key={product.name}>
									{product.name} 
								</option>
							))}
						</select>
					</Row>
					<Row gap={12}>
						<Col size={1}>
							<input placeholder = "Amount" value={amount} onChange={changeAmount} style={{padding:"15px"}}></input>
						</Col>
						<Col size={1}>
							<input placeholder ={"Speed <= " + getMaxSpeed(type) + " | Best = " + getOptimalSpeed(type) } value={speed} onChange={changeSpeed} style={{padding:"15px"}}></input>
						</Col>
					</Row>
				</Grid>
			</Form>
			<Grid>
				<Row gap={12}>
					<Col size={1}>
						<FormButton value="start" onClick={controlMachineButtonPress} disabled={disabledStart()}>
							Start
						</FormButton>
					</Col>
					<Col size={1}>
						<FormButton value="stop" onClick={controlMachineButtonPress} disabled={disabledStop()}>
							Stop
						</FormButton>
					</Col>
				</Row>
				<Row gap={12}>
					<Col size={1}>
						<FormButton value="reset" onClick={controlMachineButtonPress} disabled={disabledReset()}>
							Reset
						</FormButton>
					</Col>
					<Col size={1}>
						<FormButton value="clear" onClick={controlMachineButtonPress} disabled={disabledClear()}>
							Clear
						</FormButton>
					</Col>
				</Row>
				<Row height={62}>
					<AbortButton value="abort" onClick={controlMachineButtonPress} disabled={disabledAbort()}>
						ABORT
					</AbortButton>
				</Row>
			</Grid>
		</Grid>
	);
}

