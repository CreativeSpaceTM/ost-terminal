import React from 'react';
import Modal from "./modal";

class Selector extends React.Component {

	show() {
		this.refs.modal.show();
		this.myScroll = new IScroll('.selectorList');
	}

	render() {
		var options = [];
		for (var f = 0; f < this.props.options.length;f++) {
			var option = this.props.options[f];
			options.push((
				<li>{option.name}</li>
			));
		}

		return (
			<Modal ref="modal" className="selector">
				<div className="selectorList">
					<ul>
						{options}
					</ul>
				</div>
			</Modal>
		);
	}
}

module.exports = Selector;
