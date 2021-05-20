import styled from 'styled-components';

export const Form = styled.form`
	-webkit-box-shadow: 0px 0px 10px 2px rgba(0, 0, 0, 0.1);
		box-shadow: 0px 0px 10px 2px rgba(0, 0, 0, 0.1);  

	& select {
		font-size: 1.1em;
		width: ${(props) => props.selectWidth}%;
		height: 40px;
		padding-left: 10px;
		border: 0px;

		&:focus {
			outline: none;
		}
	}

	& input {
		font-size: 1.1em;
		width: ${(props) => props.inputWidth}%;
		height: 40px;
		border: 0px;
		padding-left: 10px;
		transform: translate(0px, -1px);
		border-left: ${(props) => props.leftBorder};

		&:focus {
			outline: none;
			border-bottom: 1px solid #7ac8ff;
		}
	}
`