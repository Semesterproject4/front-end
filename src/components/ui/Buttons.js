import styled from 'styled-components';

export const FormButton = styled.button`
	font-size: 1.1em;
	width: 100%;
	height: 40px;
	background: #7ac8ff;
	outline: none;
	border: none;
	color: black;

	&:hover {
		background: #99d5ff;
	}

	&:disabled {
		background: grey;
		color: white;
		cursor: default;
	}
`
