import Styled from 'styled-components';

export const Table = Styled.table`
border-collapse: collapse;
width: 100%;
background: white;  
-webkit-box-shadow: 0px 0px 10px 2px rgba(0, 0, 0, 0.1);
	box-shadow: 0px 0px 10px 2px rgba(0, 0, 0, 0.1); 

`

export const Head = Styled.thead`
& tr {
	& th {
		font-size: 1.2em;
		height: 25px;
		font-weight: bold;
		padding: 20px;
		user-select: none;
	}
}
`

export const Body = Styled.tbody`
& tr {
	cursor: pointer;

	& td {
		font-size: 1.0em;
		padding: 0px;  
		height: 40px;
		user-select: none;
		border-top: 1px solid whitesmoke;
	}

	&:nth-child(even) {
		background-color: #f7f7f7;
	}

	&:nth-child(odd) {
		background-color: #ffffff;
	}  

	&:hover {
		background: #dbf0ff;
	}

}
`