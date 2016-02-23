import React from 'react';
import _ from 'lodash';
import { hashHistory } from 'react-router';

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
		$.ajax({
			url: "/api/v1.0/product/all",
			success: $.proxy(function (products) {
				this.setState({
					products: products
				});
			}, this)
		});

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

	addProduct() {
		this.setState({
			selectedProducts: this.state.selectedProducts.concat([this.state.products[this.state.product]]),
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

	render() {
		var productOptions = [];

		for (var f = 0; f < this.state.products.length; f++) {
			var product = this.state.products[f];

			productOptions.push((
				<option value={f}
				        key={product.id}
				        hidden={this.isProductSelected(product)}>
					{_.capitalize(product.name)}
				</option>
			));
		}

		var selectedProducts = [];

		for (f = 0; f < this.state.selectedProducts.length; f++) {
			var selectedProduct = this.state.selectedProducts[f];

			selectedProducts.push((
				<tr key={selectedProduct.id}>
					<td>{selectedProduct.pn}</td>
					<td>{_.capitalize(selectedProduct.name)}</td>
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

				<div className="ui grid">
					<div className="fourteen wide column">
						<label>Product</label>
						<select onChange={this.handleProductChange.bind(this)}
						        value={this.state.product}
						        disabled={this.isProductListDisabled()}
						        className="ui fluid normal dropdown">
							<option value="">-- Select product --</option>
							{productOptions}
						</select>
					</div>

					<div className="two wide column padded" id="logoutWrap">
						<button className="ui icon green button"
						        disabled={!this.state.product}
						        onClick={this.addProduct.bind(this)}>
							<i className="add square icon"></i>
						</button>
					</div>
				</div>

				<h3 hidden={this.state.selectedProducts.length === 0}>Selected products</h3>
				<table className="ui single line table striped"
				       hidden={this.state.selectedProducts.length === 0}>
					<thead>
						<tr>
							<th>PN</th>
							<th>Product name</th>
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
