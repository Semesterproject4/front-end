import React, { Component } from 'react'
import { Column, Row } from 'simple-flexbox';

export class Batches extends Component {
    //State contains all the variables of the class
    

    state = {
        searchVar: "",
        selectedBatchID: "",
        selectSuccess: false,
        errorMessage: "",
        link: "",
        Pagebatches: [],
        selectedBatch: "", 
        page: 0,
        maxpage: 0,
    };

    componentDidMount(){
        this.getBatches(0);
    }

    search = (e) => {
		//This request is likely not correct but would be removed by the dashboard view anyways so that method remains unchanged for now
        fetch('http://localhost:8080/api/batches/' + document.getElementById("searchField").value) 
            .then(response => {
                let json = response.json();
                json.then(data => {
                    if (response.status === 200) {
                        this.setState({ selectedBatchID: data.id, selectSuccess: true, errorMessage: "", link: "http://localhost:8080/api/batches/" + data.id + "/pdf"});
                    } else if (response.status === 400) {
                        this.setState({ selectedBatchID: "", selectSuccess: false, errorMessage: "Something went wrong, have you entered a valid UUID?", link: "" })
                    } else {
                        this.setState({ selectedBatchID: "", selectSuccess: false, errorMessage: data.response, link: "" });
                    }
                })
            }
            )

    }

    change = (e) => {
        this.setState({selectedBatch: e.target.value
        });
    }



    generatePDF = (e) => {
        if(e.target.value === "search"){
            window.location.href = this.state.link;
        } else if(e.target.value === "pages"){
            window.location.href = "http://localhost:8080/api/batches/" + this.state.selectedBatch + "/pdf"
        }
    }

    getBatches(page){
        this.setState({
            Pagebatches: []
        });
        console.log("fetching.. ", this.state.page)
        this.setState({page: page})
        fetch('http://localhost:8080/api/batches?page=' + page +'&size=10')
        .then(response => {
            if(response.status === 200){
                response.json().then(data => {
                    console.log(data)
                    this.setState({Pagebatches: data})
                    // this is broken, please fix :)
                    this.setState({maxpage: data.length%10});
                })
            }
        })
    }


    updatePage = (e) => {
        if(e.target.value === "prev"){
            if(this.state.page > 0){
                let page = this.state.page - 1;
                console.log("Current page:", this.state.page);
                console.log("New page:", page);
                this.getBatches(page);
            } 
        } else if(e.target.value === "next"){
            if(this.state.page < this.state.maxpage){
                let page = this.state.page + 1;
                console.log("Current page:", this.state.page);
                console.log("New page:", page);
                this.getBatches(page);
            } 
        }
    }

    render() {
        let selectedBatchMessage;
        let errorMessage;

        if (this.state.selectSuccess) {
            selectedBatchMessage = <p>Selected batch: {this.state.selectedBatchID}</p>
            errorMessage = <p></p>
        } else {
            selectedBatchMessage = <p>Selected batch: none</p>
            errorMessage = <p style={{ color: "red" }}>{this.state.errorMessage}</p>
        }

        return (
            <Column flexGrow={1}>
                <Row
                    horizontal='center'
                    style={searchStyle}
                >
                    <input style={inputStyle} id="searchField" placeholder="Batch ID"></input>
                    <button style={btnStyle} onClick={this.search}>Search</button>
                </Row>
                <Row
                    horizontal='space-between'
                    breakpoints={{ 1024: 'column' }}
                >
                    <Column
                        flexGrow={2}
                        horizontal='center'
                        style={itemStyle}
                    >
                        <h3> Batch List </h3>
                        <Row style={itemStyle}>
                            <select 
                                    size="10"
                                    onChange={this.change}
                                    style={selectStyle}
                            >
                                {this.state.Pagebatches.map((option) => (
                                    <option style={optionStyle}
                                        value={option.id}
                                        key={option.id}
                                    >
                                        {option.productType} {option.amountToProduce} {option.data[0].timestamp}

                                    </option>
                                ))}
                            </select>
                        </Row>
                        <Row style={itemStyle}>
                            <button style={btnStyle} onClick={this.updatePage} value="prev">&lt; prev</button>
                            <p style={{margin: 10, fontSize: "20px"}}>{this.state.page+1} of {this.state.maxpage+1}</p>
                            <button style={btnStyle} onClick={this.updatePage} value="next">next &gt;</button>
                        </Row>
                        <Row style={itemStyle}>
                            {/* {this.state.selectSuccess === true ? (<button value="search" style={btnStyle} onClick={this.generatePDF}>Generate Report</button>): (<button value="pages" style={btnStyle} onClick={alert("Please choose a batch first")}>Generate Report</button>)  }  */}
                            <button value="pages" style={btnStyle} onClick={this.generatePDF}>Generate Report</button>
                        </Row>
                    </Column>
                    <Column
                        flexGrow={4}
                        horizontal='center'
                        style={itemStyle}
                    >
                        <h3> Batch Overview </h3>
                        <span> Values from a chosen batch </span>
                        <span>{selectedBatchMessage}</span>
                        <p>{errorMessage}</p>
                    </Column>
                </Row>
                <Row
                    horizontal='center'
                    style={itemStyle}
                >
                    <Column>
                        <h3> Graph over chosen datavalue </h3>
                        <span> Values from a chosen batch </span>
                    </Column>
                </Row>
            </Column>            
        )
    }
}

const itemStyle = {
    backgroundColor: "#eee",
    outlineStyle: "solid",
    margin: "10px"
}

const searchStyle = {
    marginBottom: "10px"
}

const btnStyle = {
    backgroundColor: "#696969",
    border: "1px solid #000",
    display: "inline-block",
    color: "#fff",
    fontSize: "14px",
    fontWeight: "bold",
    padding: "8px 12px",
    margin: "0px 5px",
    textDecoration: "none"
}

const inputStyle =   {
    width: "50%",
    padding: "12px 20px",
    margin: "8px 0",
    boxSizing: "border-box",
    border: "none",
    borderBottom: "4px solid grey"
}

const selectStyle = {
  overflow: "hidden",
  height: "470px",
  textAlign: "center", 
  fontSize: "26px",
  boxSizing: "border-box",
  border: "hidden"
}

const optionStyle = {
  padding: "8px", 
  outlineStyle:"solid 1px", 
  backgroundColor: "#D0D0D0"
}

export default Batches