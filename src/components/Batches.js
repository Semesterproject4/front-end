import React, { useState, useEffect } from 'react'
import styled from 'styled-components';

const Batches = () => {
    
    const [selectedBatchID, setSelectedBatchID] = useState("");
    const [selectSucess, setSelectSuccess] = useState(false);
    const [errorMessage, seterrorMessage] = useState("");
    const [link, setLink] = useState("");
    const [pageBatches, setPagebatches] = useState([]);
    const [page, setPage] = useState(0);
    const [maxPage, setMaxPage] = useState(0);

    useEffect(() => {
        fetchBatches();
    }, []);

    const search = (e) => {
		//This request is likely not correct but would be removed by the dashboard view anyways so that method remains unchanged for now
        fetch('http://localhost:8080/api/batches/' + document.getElementById("searchField").value) 
            .then(response => {
                let json = response.json();
                json.then(data => {
                    if (response.status === 200) {
                        setSelectedBatchID(data.id);
                        setSelectSuccess(true);
                        seterrorMessage("");
                        setLink("http://localhost:8080/api/batches/" + data.id + "/pdf")
                    } else if (response.status === 400) {
                        setSelectedBatchID("");
                        setSelectSuccess(false);
                        seterrorMessage("Something went wrong, have you entered a valid UUID");
                        setLink("")
                    } else {
                        setSelectedBatchID("");
                        setSelectSuccess(false);
                        seterrorMessage(data.response);
                        setLink("")
                    }
                })
            })
    };

    const change = (e) => {
        setSelectedBatchID(e.target.value);
    };

    const generatePDF = (e) => {
        if(e.target.value === "search"){
            window.location.href = link;
        } else if(e.target.value === "pages"){
            window.location.href = "http://localhost:8080/api/batches/" + selectedBatchID + "/pdf"
        }
    };

    const fetchBatches = async (page) => {
        setPagebatches([]);
        const url = 'http://localhost:8080/api/batches?page=' + page +'&size=10';
        const data = await fetch(url);
        const result = await data.json();
        setPagebatches(result);
        // this is broken, please fix :)
        setMaxPage(data.length%10);
        // this is probably needed
        setPage(page);
    }

    const updatePage = (e) => {
        if(e.target.value === "prev"){
            if(page > 0){
                let newPage = page - 1;
                console.log("Current page:", page);
                console.log("New page:", newPage);
                fetchBatches(newPage);
            } 
        } else if(e.target.value === "next"){
            if(page < maxPage){
                let newPage = page + 1;
                console.log("Current page:", page);
                console.log("New page:", newPage);
                fetchBatches(newPage);
            } 
        }
    }; 

    return (
        <Grid>
            <Row colwrap="xs"> 
                <Col size={2}>
                    Length of two
                </Col>
                <Col size={3}>
                    Length of three
                </Col>
            </Row>
            <Row height={300}>
                <Col size={1}>
                    Full length
                </Col>
            </Row>
        </Grid>
    );
};

const Grid = styled.div`
`;

const media = {
    xs: (styles) => `
        @media only screen and (max-width: 480px) {
            ${styles}
        }
    `,
}

const Row = styled.div`
    display: flex;
    flex-flow: wrap;
    ${(props) => props.colwrap && media[props.colwrap](`
        flex-flow: column wrap;
    `)};
    height: ${(props) => props.height}px;
    outline-style: solid;
`;

const Col = styled.div`
    flex: ${(props) => props.size};
    outline-style: solid;

`;

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

export default Batches;

{/* <Column>
<Row
  horizontal='center'
  style={searchStyle}
>
    <input style={inputStyle} id="searchField" placeholder="Batch ID"></input>
    <button style={btnStyle} onClick={search}>Search</button>
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
              onChange={change}
              style={selectStyle}
            >
                {pageBatches.map((option) => (
                    <option style={optionStyle}
                      value={option.id}
                      key={option.id}
                    >
                        {option.productType} | {option.amountToProduce} | {option.data[0].timestamp[0]}-{option.data[0].timestamp[1]}-{option.data[0].timestamp[2]}
                    </option>
                ))}
            </select>
        </Row>
        <Row style={itemStyle}>
            <button style={btnStyle} onClick={updatePage} value="prev">&lt; prev</button>
            <p style={{margin: 10, fontSize: "20px"}}>{page+1} of {maxPage+1}</p>
            <button style={btnStyle} onClick={updatePage} value="next">next &gt;</button>
        </Row>
        <Row style={itemStyle}>
            <button value="pages" style={btnStyle} onClick={generatePDF}>Generate Report</button>
        </Row>
    </Column>
    <Column
      flexGrow={4}
      horizontal='center'
      style={itemStyle}
    >
        <h3> Batch Overview </h3>
        <span> Values from a chosen batch </span>
        <p>{errorMessage}</p>
        <p>{selectSucess}</p>
                
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
</Column> */}