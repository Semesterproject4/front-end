import React, { useState, useEffect } from 'react'
import styled from 'styled-components';

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
        <Grid>
            <Row>
                <h3>Produced batches</h3>
            </Row>

            {/* harcoded max height - bad practice */}
            <Row height={443}>
                <Styledtable id="table" onClick={selectRow}>
                    <Styledthead>
                        <tr>
                            <th>Product</th>
                            <th>Amount</th>
                            <th>Production Started</th>
                        </tr>
                    </Styledthead>
                    <Styledbody>
                        {pageBatches.map((element) => (
                            <tr id={element.id} key={element.id} style={props.selectedBatchID === element.id ? { background: "#7ac8ff" } : { fontSize: "1.0em" }}>
                                <td>{element.productType}</td>
                                <td>{element.amountToProduce}</td>
                                <td>{element.data[0].timestamp[0]}-{element.data[0].timestamp[1]}-{element.data[0].timestamp[2]} {element.data[0].timestamp[3]}:{element.data[0].timestamp[4]}</td>
                            </tr>
                        ))}
                    </Styledbody>
                </Styledtable>
            </Row>

            <Row align={"baseline"}>
                <StyledButton onClick={updatePage} disabled={prevBtnDisable} value="prev">&lt; prev</StyledButton>

                <p style={{ fontWeight: "bold" }}>{currentPage + 1} of {maxPage}</p>

                <StyledButton onClick={updatePage} disabled={nextBtnDisable} value="next">next &gt;</StyledButton>
            </Row>
        </Grid>
    );
};

const Grid = styled.div`
    display: flex;
    flex-flow: column wrap;
    gap: 12px;
    justify-content: center ${(props) => props.justify};
    width: ${(props) => props.width}%;
`;

const media = {
    xs: (styles) => `
        @media only screen and (max-width: 480px) {
            ${styles}
        }
    `,
    m: (styles) => `
        @media only screen and (max-width: 1024px) {
            ${styles}
        }
    `,
}

const Row = styled.div`
    display: flex;
    flex-flow: wrap;
    gap: 12px;
    justify-content: center ${(props) => props.justify};
    ${(props) => props.colwrap && media[props.colwrap](`
        flex-flow: column wrap;
    `)};
    min-height: ${(props) => props.minheight}px;
    height: ${(props) => props.height}px;
    align-items: ${(props) => props.align};
`;

const Col = styled.div`
    flex: ${(props) => props.size};
    background-color: ${(props) => props.backgroundColor};
    padding: ${(props) => props.padding}px;
`;

const Styledtable = styled.table`
	width: 100%;
    height: 444px;
	border-collapse: collapse;
	background: white;  
/*   	-webkit-box-shadow: 0px 0px 10px 8px rgba(0, 0, 0, 0.1);
			box-shadow: 0px 0px 10px 8px rgba(0, 0, 0, 0.1);  */ 
`;

const Styledthead = styled.thead`
	& tr {
		& th {
			font-size: 1.0em;
			font-weight: bold;
			padding: 10px;
            user-select: none;
		}
	}
`;

const Styledbody = styled.tbody`
	& tr {
		cursor: pointer;
        user-select: none;

		& td {
			font-size: 1.0em;
			height: 40px;
		}
		&:nth-child(even) {
			background-color: #f7f7f7;
		}
		&:nth-child(odd) {
			background-color: #ffffff;
		}  
		&:hover {
			background: #e3e3e3;
		}
	}
`;

const StyledButton = styled.button`
    background-color: #696969;
    border: 1px solid #000;
    color: #fff;
    font-size: 14px;
    font-weight: bold;
    padding: 8px 12px;
    margin: 0px 5px;
    text-decoration: none;

    &:disabled {
        cursor: default;
    }
`;
