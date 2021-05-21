import styled from 'styled-components';

export const Form = styled.form`
	-webkit-box-shadow: 0px 0px 10px 2px rgba(0, 0, 0, 0.1);
	box-shadow: 0px 0px 10px 2px rgba(0, 0, 0, 0.1);  
	width: ${(props) => props.width}%;

	& select {
		font-size: 1.1em;
		height: 40px;
		width: 100%;
		padding-left: 10px;
		border: none;
		border-bottom: 1px solid #EFEFEF;

		&:focus {
			outline: none;
		}
	}

	& input {
		font-size: 1.1em;
		height: 40px;
		width: 100%;
		border: 0px;
		padding-left: 5px;
		border-bottom: 1px solid #EFEFEF;

		&:focus {
			outline: none;
			border-bottom: 1px solid #7ac8ff;
		}

		@media only screen and (max-width: 1024px) {
			font-size: 1.0em;
		}

		@media only screen and (max-width: 850px) {
			font-size: 0.8em;
		}
	}
`