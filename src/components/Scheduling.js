import React, { Component } from 'react'

export class MachineList extends Component {
    //State contains all the variables of the class
    state = { 
        amount: "",
        speed: "",
        beerType: "pilsner",
        validInput: true,
        products: ""
    };


    componentDidMount(){
        fetch("http://localhost:8080/api/machines/products", {
            method: 'GET',
            headers: {'Content-Type': 'application/json'}
        }).then(res => {
            let data = res.json();

            if(res.status === 200){
                this.setState({products: data.products});
                console.log(data);
            }else{
                console.log("Some error message, because products endpoint wasn't reachable");
            }






        /*}).then(json => {
            if(json.success){
                this.setState({products: json.products});
                console.log(json.products);
            }else{
                console.log("Some error message, because products endpoint wasn't reachable");
            }*/
        });
    }

    updateScheduledList = () => {

    }

    buttonPress = (e) => {
        e.preventDefault(); 
        let data = {
            "speed": this.state.speed,
            "type": this.state.beerType.toUpperCase(),
            "amount": this.state.amount
        };

        console.log(data);

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

    //Contains the HTML that is to be rendered for the user
    render() {
        let invalidInputMessage;

        if(this.state.validInput){
            invalidInputMessage = <p></p>
        }else{
            invalidInputMessage = <p>Invalid inputs</p>
        }

        return (
            
            <div>
                {invalidInputMessage}
                <form style={formStyle}>
                    <select style={formStyle} onChange={this.changeBeerType}>
                        <option value="pilsner">Pilsner</option>
                        <option value="wheat">Wheat</option>
                        <option value="stout">Stout</option>
                        <option value="ipa">IPA</option>
                        <option value="ale">Ale</option>
                        <option value="alcohol_free">Alcohol Free</option>
                    </select>

                    <input placeholder = "Amount" value = {this.state.amount} onChange = {this.onAmountChanged} style = {formStyle}/>
                    <input placeholder = "Speed" value = {this.state.speed} onChange = {this.onSpeedChanged} style = {formStyle}/>

                    <button 
                        style={btnStyle}
                        onClick={this.buttonPress}
                    >
                        Add
                    </button>           
                
                </form>

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

export default MachineList