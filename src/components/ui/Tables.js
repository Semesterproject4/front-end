import Styled from 'styled-components';

export const Table = Styled.table`
	border-collapse: collapse;
	width: 100%;
	background: white;  
	-webkit-box-shadow: 0px 5px 10px 2px rgba(0, 0, 0, 0.1);
		box-shadow: 0px 5px 10px 2px rgba(0, 0, 0, 0.1); 

`

export const Head = Styled.thead`
& tr {
	& th {
		font-size: 1.2em;
		height: 25px;
		font-weight: bold;
		padding: 10px 0px;
		user-select: none;
	}
}
`

export const Body = Styled.tbody`
& tr {
	cursor: ${(props) => props.cursor};

	& td {
		font-size: 1.0em;
		padding: 0px;  
		height: 40px;
		user-select: none;
		border-top: 1px solid whitesmoke;
		text-align: center;
	}

	&:nth-child(even) {
		background-color: #f7f7f7;
	}

	&:nth-child(odd) {
		background-color: #ffffff;
	}  

	&:hover {
		background: #D7E0EA;
	}

}
`

export const SortableBody = Styled(Body)`
	& tr {
		counter-increment: row-num;

		& td:first-child::after {
			content: " #" counter(row-num);
			font-size: 0.8em;
		}


	}
`
export const HidingTH = Styled.th`
	@media only screen and (max-width: 675px) {
		display: none;
	}
`

export const HidingTD = Styled.td`
	@media only screen and (max-width: 675px) {
		display: none;
	}
`