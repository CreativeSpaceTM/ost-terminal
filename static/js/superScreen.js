import React from 'react';
import _ from 'lodash';
import { hashHistory } from 'react-router';
import Selector from "./selector";
import utils from "./utils";

class SuperScreen extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			products: [],
			selectedProducts: [],
			product: "",
			maxProducts: 6,
			user: {}
		};
	}

	componentDidMount() {
		utils.cachedAjax("/api/v1.0/product/all").then($.proxy(function (products) {
			this.setState({
				products: products
			});
		}, this));

		this.state.user = JSON.parse(localStorage.getItem("user"));

		var storedProducts = localStorage.getItem("products");

		if (storedProducts) {
			this.setState({
				selectedProducts: JSON.parse(storedProducts)
			});
		}
	}

	gotoLogin() {
		hashHistory.push("/login");
	}

	handleProductChange(e) {
		this.setState({product: e.target.value});
	}

	updateProductStore() {
		localStorage.setItem("products", JSON.stringify(this.state.selectedProducts));
	}

	showProductPicker() {
		this.refs.productSelector.show();
	}

	addProduct(product) {
		this.setState({
			selectedProducts: this.state.selectedProducts.concat([product]),
			product: ""
		}, this.updateProductStore);
	}

	removeProduct(index) {
		this.state.selectedProducts.splice(index, 1);
		this.setState({
			selectedProducts: this.state.selectedProducts
		}, this.updateProductStore);
	}

	isProductListDisabled() {
		return this.state.selectedProducts.length === this.state.maxProducts;
	}

	isProductSelected(product) {
		return _.find(this.state.selectedProducts, function (item) {
			return item.id === product.id;
		});
	}

	filterOutSelectedProducts() {
		return _.xorBy(this.state.products, this.state.selectedProducts, "id");
	}

	render() {
		var selectedProducts = [];

		for (var f = 0; f < this.state.selectedProducts.length; f++) {
			var selectedProduct = this.state.selectedProducts[f];

			selectedProducts.push((
				<tr key={f}>
					<td>{f + 1}</td>
					<td>{_.capitalize(selectedProduct.project)}</td>
					<td>{selectedProduct.leftPn}</td>
					<td>{selectedProduct.rightPn}</td>
					<td className="minCell">
						<button className="ui icon red button"
						        onClick={this.removeProduct.bind(this, f)}>
							<i className="remove square icon"></i>
						</button>
					</td>
				</tr>
			));
		}

		return (
			<div id="superView">
				<div id="userHeader">
					<button className="ui primary button"
									onClick={this.gotoLogin.bind(this)}>
						<i className="user icon"></i>
						Change user
					</button>
					<h3>Supervisor: <b>{this.state.user.name}</b></h3>
				</div>

				<button className="ui icon green button"
				        disabled={this.isProductListDisabled()}
				        onClick={this.showProductPicker.bind(this)}>
					<i className="add square icon"></i> Add product
				</button>

				<Selector ref="productSelector"
				          options={this.filterOutSelectedProducts()}
				          label="project"
				          onOk={this.addProduct.bind(this)}>
				</Selector>

				<h3 hidden={this.state.selectedProducts.length === 0}>Selected products</h3>
				<table className="ui single line table striped"
				       hidden={this.state.selectedProducts.length === 0}>
					<thead>
						<tr>
							<th>#</th>
							<th>Product name</th>
							<th>Left PN</th>
							<th>Right PN</th>
							<th></th>
						</tr>
					</thead>
					<tbody>
						{selectedProducts}
					</tbody>
				</table>
			</div>
		);
	}
}

module.exports = SuperScreen;
