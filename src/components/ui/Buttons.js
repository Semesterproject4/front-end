import Styled from 'styled-components';

export const Button = Styled.button`
	width: 100%;
	height: 100%;
	border: 1px solid black;
`


export const FormButton = Styled.button`
	font-size: 1.1em;
	width: 100%;
	height: 40px;
	background: #6D8EB1;
	outline: none;
	border: none;
	color: black;

	&:hover:enabled {
		background: #4F6F92;
	}

	&:disabled {
		background: #6D8EB1;
		opacity: 0.5;
		color: black;
		cursor: not-allowed;
	}
`

export const AbortButton = Styled(Button)`
	font-size: 1.5em;
	background: #E84855;
	color: black;

	&:hover {
		background: #E42535;
	}

	&:disabled {
		background: #E84855;
		opacity: 0.5;
		color: black;
		cursor: not-allowed;
	}
`


export const DeleteButton = Styled.button`
	background-color: #E84855;
	height: 100%;
	width: 100%;
	border-top-left-radius: 8px;
  	border-bottom-left-radius: 8px;
	outline: none;
	border: none;
	padding: 0px 10px;

	&:hover {
		background-color: #E42535;		
	}
`

export const ConnectButton = Styled.button`
	background-color: #7CDF87;
	height: 100%;
	width: 100%;
	outline: none;
	border: none;
	  padding: 0px 10px;

	&:hover {
		background-color: #5BD769;		
	}
`