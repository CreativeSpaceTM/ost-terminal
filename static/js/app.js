import React from 'react';
import ReactDOM from 'react-dom';
import Login from './login';
import SuperScreen from './superScreen';
import OpScreen from './opScreen';
import { Router, hashHistory } from 'react-router';
import utils from "./utils";

class App extends React.Component {

	constructor(props) {
		super(props);
	}

	componentDidMount() {
		utils.redirectToUserView();
	}

	render() {
		return (
			<div id="appWrap">
				{this.props.children}
			</div>
		);
	}
}

const routes = {
	path: "/",
	component: App,
	childRoutes: [
		{path: "login", component: Login},
		{path: "superScreen", component: SuperScreen},
		{path: "opScreen", component: OpScreen},
	]
};

ReactDOM.render(<Router history={hashHistory} routes={routes} />, document.getElementById("app"));
