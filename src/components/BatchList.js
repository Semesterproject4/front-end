import React, { useState, useEffect } from 'react'
import { FormButton } from './ui/Buttons';
import { Grid, Row, Col } from './ui/Grid';
import { Table, Head, Body } from './ui/Tables';

export const BatchList = (props) => {

    const [pageBatches, setPagebatches] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [maxPage, setMaxPage] = useState(0);
    const [prevBtnDisable, setPrevBtnDisable] = useState(true);
    const [nextBtnDisable, setNextBtnDisable] = useState(true);

    useEffect(() => {
        fetchBatches(0);
    }, []);

    const fetchBatches = (page) => {
        const url = 'http://localhost:8080/api/batches?page=' + page + '&size=10';
        fetch(url).then(response => {
            if (response.status === 200) {
                response.json().then(result => {
                    setPagebatches(result.content);
                    setMaxPage(result.totalPages);
                    setCurrentPage(result.pageable.pageNumber);
                    
                    if (result.pageable.pageNumber + 1 === result.totalPages) {
                        setNextBtnDisable(true);
                    } else {
                        setNextBtnDisable(false);
                    }

                    if (result.pageable.pageNumber === 0) {
                        setPrevBtnDisable(true);
                    } else {
                        setPrevBtnDisable(false);
                    }

                    props.setSelectedBatchID(result.content[0].id);
                });
            } else {
                alert("Sorry, but we had trouble getting batches\n" +
                "Please try again later.")
            }
        });
    };

    const updatePage = (e) => {
        if(e.target.value === "prev"){
            if(currentPage > 0){
                let newPage = currentPage - 1;
                fetchBatches(newPage);
            } 
        } else if(e.target.value === "next"){
            if(currentPage < maxPage){
                let newPage = currentPage + 1;
                fetchBatches(newPage);
            }
        }
    };

    const selectRow = (e) => {
        let id = e.target.parentNode.getAttribute('id');
        props.setSelectedBatchID(id);
	};

    return (
        <Grid widht={100}>
			<Row>
				<Col size={1} textAlign="center">
					<h3>Produced batches</h3>
				</Col>
			</Row>
			<Row>
				<Col size={1}>
					<Table id="table" onClick={selectRow} style={{boxShadow: "0px 0px 0px 0px rgba(0, 0, 0, 0.0)"}}>
						<Head>
							<tr>
								<th>Product</th>
								<th>Amount</th>
								<th>Production Started</th>
							</tr>
						</Head>
						<Body cursor="pointer">
							{pageBatches.map((element) => (
								<tr id={element.id} key={element.id} style={props.selectedBatchID === element.id ? { background: "#6D8EB1" } : { fontSize: "1.0em" }}>
									<td>{element.productType.charAt(0) + element.productType.slice(1).toLowerCase().replace('_', '\u00A0')}</td>
									<td>{element.amountToProduce}</td>
									<td>{element.data[0].timestamp[0]}-{element.data[0].timestamp[1]}-{element.data[0].timestamp[2]} {element.data[0].timestamp[3]}:{element.data[0].timestamp[4]}</td>
								</tr>
							))}
						</Body>
					</Table>
				</Col>
			</Row>

			<Row align={"baseline"}>
				<Col size={3}>
					<FormButton onClick={updatePage} disabled={prevBtnDisable} value="prev">&lt; prev</FormButton>
				</Col>
				<Col size={1} textAlign="center">
					<p style={{ fontWeight: "bold"}}>{currentPage + 1} of {maxPage}</p>
				</Col>
				<Col size={3}>
					<FormButton onClick={updatePage} disabled={nextBtnDisable} value="next">next &gt;</FormButton>
				</Col>
			</Row>
        </Grid>
    );
};
