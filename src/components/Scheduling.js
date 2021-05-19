import React, {useState, useEffect} from 'react'
import { SchedulingForm } from './SchedulingForm'
import { SchedulingList } from './SchedulingList'
 
export const Scheduling = () => {
	const [products, setProducts] = useState([]);
	const [scheduled, setScheduled] = useState([]);

	useEffect(() => {
		fetchProducts();
		fetchScheduled();
	}, [])

	const fetchScheduled = async () => {
		const url = 'http://localhost:8080/api/scheduled-batches';
		const data = await fetch(url);
		const result = await data.json();
		setScheduled(result);
	};

	const fetchProducts = async () => {
		const url = 'http://localhost:8080/api/machines/products';
		const data = await fetch(url);
		const result = await data.json();
		setProducts(result.products)
	};

	return (
			<div>
				{products.length && <SchedulingForm products={products} update={fetchScheduled} />}

				{<SchedulingList scheduled={scheduled} update={fetchScheduled} />}
			</div>
	);
};