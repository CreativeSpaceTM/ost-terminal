"use strict";
import React from 'react';

document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);

class Selector extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			hidden: true,
			selected: -1
		};
	}

	show() {
		this.setState({
			hidden: false,
			selected: -1
		}, function () {
			var selector = $(this.refs.selector);

			// After the view is updated, we init the scroller
			this.myScroll = new IScroll('.selectorContent', {
				mouseWheel: true,
				tap: "tapEvent"
			});


			// Bind the action buttons
			var actions = selector.find(".actions");

			actions.find(".cancel").click((function () {
				this.setState({
					hidden: true
				});
			}).bind(this));

			actions.find(".ok").click((function () {
				this.props.onOk(this.props.options[this.state.selected]);
				this.setState({
					hidden: true
				});
			}).bind(this));


			// Enable selecting items
			var items = selector.find(".selectorContent li");
			items.on("tapEvent", (function (e) {
				var index = parseInt($(e.target).attr("data-index"), 10);

				this.setState({
					selected: index
				});
			}).bind(this));
		});
	}

	render() {
		var options = [];
		for (var f = 0; f < this.props.options.length;f++) {
			var option = this.props.options[f];
			options.push((
				<li key={f}
				    data-index={f}
				    className={this.state.selected === f ? "selected" : ""}>
					{option[this.props.label]}
				</li>
			));
		}

		return (
			<div hidden={this.state.hidden}
			     ref="selector"
			     className="selector">
				<div className="selectorContent">
					<ul>
						{options}
					</ul>
				</div>
				<div className="actions">
					<div className="ui cancel red button">
						<i className="remove icon" />
						Cancel
					</div>
					<div className="ui ok green button">
						<i className="checkmark icon" />
						Submit
					</div>
				</div>
			</div>
		);
	}
}

module.exports = Selector;
