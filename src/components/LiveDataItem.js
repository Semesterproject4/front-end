import React from 'react'
import { Icon } from '@iconify/react-with-api';

export const LiveDataItem = (props) => {
	return (
		<div>
			<Icon icon={props.icon} style={{width: "60px", height: "60px"}}/>	
			<p>{props.text}</p>
			<h1>{props.data}</h1>
		</div>
	);
}