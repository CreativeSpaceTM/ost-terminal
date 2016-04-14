import React from 'react';
import Keypad from "./keypad";
import Modal from "./modal";
import utils from "./utils";

class Login extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			password: "",
			wrongPassword: false,
			users: [],
			currentUser: null
		};
	}

	updatePassword(value) {
		this.setState({
			password: value,
			wrongPassword: false
		});
	}

	userClicked(user) {
		this.refs.keypad.clearValue();
		this.setState({currentUser: user, password: ""}, function () {
			this.refs.modal.show();
		});
	}

	componentDidMount() {
		utils.cachedAjax("/api/v1.0/user/all", "users").then($.proxy(function (users) {
			this.setState({
				users: users
			});
		}, this));
	}

	login(okBtn) {
		console.log(this.state.currentUser);
		$.ajax({
			url: config.server + "/api/v1.0/user/login",
			method: "POST",
			dataType: "json",
			data: {
				username: this.state.currentUser.username,
				password: this.state.password
			},
			success: $.proxy(function () {
				okBtn.parents(".modal").modal("hide");
				localStorage.setItem("user", JSON.stringify(this.state.currentUser));
				utils.redirectToUserView();
			}, this),
			error: $.proxy(function () {
				this.setState({wrongPassword: true});
			}, this)
		});

		return false;
	}

	render() {
		var usersList = [];

		for (var f = 0; f < this.state.users.length; f++) {
			var user = this.state.users[f];
			usersList.push((
				<div className="column userItem" key={user.id} onClick={this.userClicked.bind(this, user)}>
					<div className="ui fluid card">
						<div className="image">
							<img src="static/img/defaultAvatar.png" />
						</div>
						<div className="content">
							<a className="header">{user.name}</a>
						</div>
					</div>
				</div>
			));
		}

		return (
			<div id="loginView">
				<h1>Login</h1>
				<div id="usersList" className="ui three column grid">
					{usersList}
				</div>

				<Modal ref="modal" onOk={this.login.bind(this)}>
					<div id="loginModalPicture">
						<img src="static/img/defaultAvatar.png" className="avatar"/>
						<div>
							{this.state.currentUser && this.state.currentUser.name}
						</div>
					</div>

					<div id="loginModalKeypad">
						<div className="ui pointing below red basic label" hidden={!this.state.wrongPassword}>
							Parola este incorecta
						</div>
						<div className="ui left icon input large">
							<input type="password" value={this.state.password}/>
							<i className="lock icon" />
						</div>

						<Keypad ref="keypad" onChange={this.updatePassword.bind(this)} />
					</div>
				</Modal>
			</div>
		);
	}
}

module.exports = Login;
