import Styled from 'styled-components';

export const Switch = Styled.label`
	position: relative;
	display: inline-block;
	width: 60px;
	height: 28px;

	& input {
		opacity: 0;
		width: 0;
		height: 0;
	}
`;

export const SwitchSlider = Styled.span`
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  -webkit-transition: .1s;
  transition: .1s;

  &:before {
    position: absolute;
    content: "";
    height: 20px;
    width: 20px;
    left: 4px;
    bottom: 4px;
    background-color: white;
    -webkit-transition: .1s;
    transition: .1s;
  }
`;

export const SwitchInput = Styled.input`
	&:checked + ${SwitchSlider} {
		background-color: #3C6997;
	}

	&:focus + ${SwitchSlider} {
		box-shadow: 0 0 1px #3C6997;
	}

	&:checked + ${SwitchSlider}:before {
		-webkit-transform: translateX(32px);
		-ms-transform: translateX(32px);
		transform: translateX(32px);
	}
`;