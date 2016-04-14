import React from 'react';
import _ from "lodash";
import { hashHistory } from 'react-router';

import Selector from "./selector";

import {STATUS, SIDE} from "./const";

class ProductItem extends React.Component {

	constructor(props) {
		super(props);

		this.product = props.info;
		this.state = {
			defect: -1
		};

		this.state = _.extend(this.state, this.product);
	}

	setOk(side) {
		var status = {
			side: side,
			status: STATUS.OK
		};

		this.props.onStatusChange(this.product.id, status);
	}

	setNotOk(side) {
		this.notOkSide = side;
		this.setState({defect: -1});
		this.refs.errorSelector.show();
	}

	setDefect(defect) {
		var status = {
			side: this.notOkSide,
			status: STATUS.NOTOK,
			defect: defect.id
		};

		this.props.onStatusChange(this.product.id, status);
	}

	changeDefect(defect) {
		this.setState({defect: defect});
	}

	render() {
		return (
			<div className="productItem">
				<div className="section">
					<h2>{_.capitalize(this.state.name)}</h2>
				</div>

				<div className="section">
						<label>Stanga</label>
						<button className="ui button green huge"
						        onClick={this.setOk.bind(this, SIDE.LEFT)}>
							Ok
						</button>
						<button className="ui button red huge"
						        onClick={this.setNotOk.bind(this, SIDE.LEFT)}>
							Defect
						</button>
				</div>

				<div className="section">
						<label>Dreapta</label>
						<button className="ui button green huge"
						        onClick={this.setOk.bind(this, SIDE.RIGHT)}>
							Ok
						</button>
						<button className="ui button red huge"
						        onClick={this.setNotOk.bind(this, SIDE.RIGHT)}>
							Defect
						</button>
				</div>


				<Selector ref="errorSelector"
				          options={this.props.defects}
				          label="name"
				          onOk={this.setDefect.bind(this)}>
				</Selector>
			</div>
		);
	}
}

class OpScreen extends React.Component {

	constructor(props) {
		super(props);
		this.stats = JSON.parse(localStorage.getItem("stats") || "[]");
		this.state = {
			user: {},
			products: [],
			defects: []
		};
	}

	componentDidMount() {
		var user = JSON.parse(localStorage.getItem("user"));
		var storedProducts = JSON.parse(localStorage.getItem("products") || "[]");

		this.setState({
			user: user,
			products: storedProducts
		});

		// get defects list
		$.ajax({
			url: config.server + "/api/v1.0/defect/all",
			success: $.proxy(function (defects) {
				this.setState({
					defects: defects
				});
			}, this)
		});
	}

	gotoLogin() {
		hashHistory.push("/login");
	}

	setStatus(prodId, status) {
		var statEntry = {
			product: prodId,
			timestamp: String(Date.now())
		};

		statEntry = _.extend(statEntry, status);

		this.stats.push(statEntry);
		localStorage.setItem("stats", JSON.stringify(this.stats));

		$.ajax({
			url: config.server + "/api/v1.0/stat/add",
			method: "POST",
			contentType: "application/json",
			data: JSON.stringify({stats: this.stats}),
			success: $.proxy(function (response) {
				if (response.added) {
					// remove from local backup the products that where added
					for (var f = 0; f < response.added.length; f++) {
						var added = response.added[f];
						for (var g = 0; g < this.stats.length; g++) {
							var stat = this.stats[g];
							if (stat.timestamp === added.timestamp) {
								this.stats.splice(g, 1);
								break;
							}
						}
					}
					localStorage.setItem("stats", JSON.stringify(this.stats));
				}
			}, this)
		});
	}

	render() {
		var productItems = [];

		for (var f = 0; f < this.state.products.length; f++) {
			var product = this.state.products[f];
			productItems.push((
				<ProductItem info={product}
				             key={product.id}
				             defects={this.state.defects}
				             onStatusChange={this.setStatus.bind(this)}>
				</ProductItem>
			));
		}

		return (
			<div id="opView">
				<link href="static/css/opScreen.css" rel="stylesheet" />
				<div id="userHeader">
					<button className="ui primary button"
					        onClick={this.gotoLogin.bind(this)}>
						<i className="user icon"></i>
						Change user
					</button>
					<h3>Operator: <b>{this.state.user.name}</b></h3>
				</div>
				{productItems}
			</div>
		);
	}
}

module.exports = OpScreen;
