import React, { Component } from 'react'

export class MachineList extends Component {
    //State contains all the variables of the class
    state = { 
        amount: "",
        speed: "",
        beerType: "pilsner",
        validInput: true,
        products: [],
		scheduled: [],
		selected: ""
    };


    componentDidMount(){
        fetch("http://localhost:8080/api/machines/products", {
            method: 'GET',
            headers: {'Content-Type': 'application/json'}
        }).then( async (res) => {
            let data = await res.json();

            if(res.status === 200){
                this.setState({products: data.products});
            }else{
                console.log("Some error message, because products endpoint wasn't reachable");
            }
        });

		this.updateScheduledList();
    }

    updateScheduledList = () => {
		this.setState({scheduled: []})

        fetch('http://localhost:8080/api/scheduled-batches')
        .then(response => {
            if (response.status === 200) {
                response.json().then(data => {
                    this.setState({scheduled: data});
                })
            }
        });

    }

    addButtonPress = (e) => {
        e.preventDefault(); 
        let data = {
            "speed": this.state.speed,
            "type": this.state.beerType.toUpperCase().replace(" ", "_"),
            "amount": this.state.amount
        };

        fetch("http://localhost:8080/api/scheduled-batches", {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        }).then(response => {
            if(response.status !== 200){
                this.setState({validInput: false});
            }else{
                this.setState({validInput: true});
                this.updateScheduledList();
                this.resetInputs();
                
            }
        })
		this.updateScheduledList();
    }

	removeScheduledBatch = (e) => {
		e.preventDefault(); 

        fetch("http://localhost:8080/api/scheduled-batches/" + this.state.selected, {
            method: 'DELETE',
            headers: {'Content-Type': 'application/json'}
        }).then(response => {
            if(response.status === 200){
                this.updateScheduledList();
			}
        })
	}

    resetInputs = () => {
        this.setState({speed: ""});
        this.setState({amount: ""});
        this.setState({type: "Pilsner"});
    }

    onSpeedChanged = (e) =>{
        this.setState({speed: e.target.value});
    }

    onAmountChanged = (e) =>{
        this.setState({amount: e.target.value});
    }

    changeBeerType = (e) => {
        this.setState({beerType: e.target.value});
    }

	change = (e) => {
        this.setState({selected: e.target.value});
	}

	formatOptions = (type, amount, speed) => {
		let result = "🍺"
		let size = 0;

		result += type.charAt(0) + type.slice(1).toLowerCase().replace('_', '\u00A0');
		size = 20 - result.length;
		
		for (var i = 0; i < size; i++) {
			result += '\u00A0';
		}


		result += "🧮" + amount;
		size = 38 - result.length;


		for (var j = 0; j < size; j++) {
			result +=  '\u00A0';
		}

		result += "🚄" + speed;

		size = 48 - result.length;
		for (var k = 0; k < size; k++) {
			result +=  '\u00A0';
		}

		return result;
	}

    //Contains the HTML that is to be rendered for the user
    render() {
        let invalidInputMessage;

        if (this.state.validInput){
            invalidInputMessage = <p></p>
        } else {
            invalidInputMessage = <p>Invalid inputs</p>
        }

	        return (
            
            <div>

                <form style={formStyle}>

                    <select 
                            onChange={this.changeBeerType}
                            style={formStyle}
                    >
                        {this.state.products.map((option) => (
                            <option
                                value={option.name}
                                key={option.name}
                            >
                                {option.name} 
                            </option>
                            
                        ))}
                    </select>
					

                    <input placeholder = "Amount" value = {this.state.amount} onChange = {this.onAmountChanged} style = {formStyle}/>
                    <input placeholder = "Speed" value = {this.state.speed} onChange = {this.onSpeedChanged} style = {formStyle}/>

                    <button 
                        style={btnStyle}
                        onClick={this.addButtonPress}
                    >
                        Add
                    </button>           
                </form>
				{invalidInputMessage}

				<br></br>
				
				<select style={selectStyle}
                        size="10"
						onChange={this.change}
                >

	
                    {this.state.scheduled.map((option) => (
                        <option 
                            style={optionStyle}
                            value={option.id}
                            key={option.id}
                        >
                            {/* &#x1F37A; {option.type} &#x3000; &#x1F9EE; {option.amount} &#x00A0; &#x1F684; {option.speed} */}
							{this.formatOptions(option.type, option.amount, option.speed)}
						</option>
                    ))}
                </select> 
				<br></br>
				<button onClick={this.removeScheduledBatch} style={btnStyle2}>Remove</button>

            </div>
        )
    }
}

  const formStyle = {
    margin: "5px 5px"
}

//Styling for the buttons
const btnStyle = {
    backgroundColor: "#696969",
    border: "1px solid #000",
    display: "inline-block",
    color: "#fff",
    fontSize: "14px",
    fontWeight: "bold",
    padding: "8px 12px",
    margin: "0px 5px",
    textDecoration: "none",
}

const btnStyle2 = {
    backgroundColor: "#696969",
    border: "1px solid #000",
    display: "inline-block",
    color: "#fff",
    fontSize: "14px",
    fontWeight: "bold",
    padding: "8px 12px",
    margin: "0px 5px",
    textDecoration: "none",
	width: "1000px"
}

const selectStyle = {
    height: "580px", 
    width: "60%",
    textAlign: "center", 
    fontSize: "26px",
    boxSizing: "content-box",
    border: "hidden",
	fontFamily: "Consolas, monospace"
}

  const optionStyle = {
    padding: "8px", 
    backgroundColor: "#D0D0D0"
}

export default MachineList