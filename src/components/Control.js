import React, { useState }  from 'react'
import styled from 'styled-components';

export const Control = (props) => {
	const [type, setType] = useState("Pilsner");
	const [amount, setAmount] = useState("");
	const [speed, setSpeed] = useState("");

    const changeType = (e) => {
		setType(e.target.value);
    }

    const changeAmount = (e) => {
        setAmount(e.target.value);
    }

    const changeSpeed = (e) => {
        setSpeed(e.target.value);
    }

	const buttonPress = (e) => {
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
            fetch("http://localhost:8080/api/machines/" + props.currentMachine.id + "/variables", {
                method: "PUT",
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(variables)
            })
        }

        //Sends the HTTP request to the API
        fetch("http://localhost:8080/api/machines/" + props.currentMachine.id + "?command=" + data.command, {
            method: "PATCH",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        })

        //Reset input fields
		setSpeed("");
		setAmount("");
    }

	return (
		<div>
			<div>
				<Styledform>
					<select onChange={changeType}>
						<option value="pilsner">Pilsner</option>
						<option value="wheat">Wheat</option>
						<option value="stout">Stout</option>
						<option value="ipa">IPA</option>
						<option value="ale">Ale</option>
						<option value="alcohol_free">Alcohol Free</option>
					</select>

					<input placeholder = "Amount" value={amount} onChange={changeAmount}></input>
					<input placeholder = "Speed (%)" value={speed} onChange={changeSpeed}></input>

				</Styledform>
			</div>
			<div>
				<Styledbutton value="start"	onClick={buttonPress}>
					Start
				</Styledbutton>
				<Styledbutton value="stop" onClick={buttonPress}>
					Stop
				</Styledbutton>
				<Styledbutton value="reset" onClick={buttonPress}>
					Reset
				</Styledbutton>
				<Styledbutton value="clear" onClick={buttonPress}>
					Clear
				</Styledbutton>
				<Styledbutton value="abort" onClick={buttonPress}>
					Abort
				</Styledbutton>
			</div>
		</div>
	);
}

const Styledbutton = styled.button`
    background-color: #696969;
    border: 1px solid #000;
    display: inline-block;
    color: #fff;
    font-size: 14px;
    font-weight: bold;
    padding: 8px 12px;
    margin: 0px 5px;
    text-decoration: none;
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
