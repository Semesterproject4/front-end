import Styled from 'styled-components';

export const Grid = Styled.div`
    display: flex;
    flex-flow: column wrap;
    gap: 12px;
    justify-content: ${(props) => props.justify};
    align-items:  ${(props) => props.align};
    width: ${(props) => props.width}%;
`;

export const Col = Styled.div`
    flex: ${(props) => props.size};
    background-color: ${(props) => props.backgroundColor};
    padding: ${(props) => props.padding}px;
    align-items: ${(props) => props.align};
    align-content: ${(props) => props.alignContent};
    justify-content: ${(props) => props.justify};
    order: ${(props) => props.order};
	text-align: ${(props) => props.textAlign};
`;

export const Row = Styled.div`
	display: flex;
	flex-flow: nowrap;
	gap: ${(props) => props.gap}px;
	justify-content: ${(props) => props.justify};
	${(props) => props.colwrap && media[props.colwrap](`
	    flex-flow: column wrap;
	`)};
	min-height: ${(props) => props.minheight}px;
	align-items: ${(props) => props.align};
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
    `
}

export const HeaderCol = Styled(Col)`
	@media only screen and (max-width: 850px) {
		text-align: center;
	}
`;

export const HeaderRow = Styled(Row)`
	@media only screen and (max-width: 850px) {
		flex-flow: column wrap;
		align-items: center;
	}
`;

