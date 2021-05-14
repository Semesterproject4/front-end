import React, {useState, useEffect} from 'react'
 
export const Scheduling = () => {
	//Hooks
	const [amount, setAmount] = useState('');
	const [speed, setSpeed] = useState('');
	const [type, setType] = useState('pilsner');
	const [validInput, setValidInput] = useState(true);
	const [products, setProducts] = useState([]);
	const [scheduled, setScheduled] = useState([]);
	const [selected, setSelected] = useState('');

	//On load
	useEffect(() => {
		//Get products
		fetch("http://localhost:8080/api/machines/products", {
            method: 'GET',
            headers: {'Content-Type': 'application/json'}
        }).then( async (res) => {
            let data = await res.json();

            if(res.status === 200){
				setProducts(data.products);
            }else{
                console.log("Some error message, because products endpoint wasn't reachable");
            }
        });
		updateList();

	}, [])

	const updateList = () => {
		//Reset list
		setScheduled([]);

		//Get batches
        fetch('http://localhost:8080/api/scheduled-batches')
        .then(response => {
            if (response.status === 200) {
                response.json().then(data => {
					setScheduled(data);
                })
            }
        });
	}

    const addScheduledBatch = (e) => {
        e.preventDefault(); 
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
            if(response.status !== 200){
				setValidInput(false);
            }else{
				setValidInput(true);
				setAmount("");
                setSpeed("");
				setType("Pilsner");
                updateList();
            }
        })
    }

	const removeScheduledBatch = (e) => {
		e.preventDefault(); 

        fetch("http://localhost:8080/api/scheduled-batches/" + selected, {
            method: 'DELETE',
            headers: {'Content-Type': 'application/json'}
        }).then(response => {
            if(response.status === 200){
                updateList();
			}
        })
	}
	

    const onSpeedChanged = (e) =>{
		setSpeed(e.target.value);
    }

    const onAmountChanged = (e) =>{
		setAmount(e.target.value);
    }

    const changeBeerType = (e) => {
		setType(e.target.value);
    }

	const changeSelected = (e) => {
		setSelected(e.target.value);
	}

	const formatOptions = (iType, iAmount, iSpeed) => {
		let result = "🍺"
		let size = 0;

		result += iType.charAt(0) + iType.slice(1).toLowerCase().replace('_', '\u00A0');
		size = 20 - result.length;
		
		for (var i = 0; i < size; i++) {
			result += '\u00A0';
		}


		result += "🧮" + iAmount;
		size = 38 - result.length;


		for (var j = 0; j < size; j++) {
			result +=  '\u00A0';
		}

		result += "🚄" + iSpeed;

		size = 48 - result.length;
		for (var k = 0; k < size; k++) {
			result +=  '\u00A0';
		}

		return result;
	}

	const errorMessage = () => {
		if (validInput){
            return <p></p>
        } else {
            return <p>Invalid inputs</p>
        }
	}
	
	return (
			<div>

                <form style={formStyle}>

                    <select 
                            onChange={changeBeerType}
                            style={formStyle}
                    >
                        {products.map((option) => (
                            <option
                                value={option.name}
                                key={option.name}
                            >
                                {option.name} 
                            </option>
                            
                        ))}
                    </select>
					

                    <input placeholder = "Amount" value = {amount} onChange = {onAmountChanged} style = {formStyle}/>
                    <input placeholder = "Speed" value = {speed} onChange = {onSpeedChanged} style = {formStyle}/>

                    <button 
                        style={btnStyle}
                        onClick={addScheduledBatch}
                    >
                        Add
                    </button>           
                </form>
				{errorMessage}

				<br></br>
				
				<select style={selectStyle}
                        size="10"
						onChange={changeSelected}
                >

	
                    {scheduled.map((option) => (
                        <option 
                            style={optionStyle}
                            value={option.id}
                            key={option.id}
                        >
							{formatOptions(option.type, option.amount, option.speed)}
						</option>
                    ))}
                </select> 
				<br></br>
				<button onClick={removeScheduledBatch} style={btnStyle2}>Remove</button>

            </div>
		
		
	);
};


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