"use strict";

import { hashHistory } from 'react-router';

module.exports = {
	redirectToUserView: function () {
		var user = JSON.parse(localStorage.getItem("user"));
		if (user) {
			if (user.type === "su") {
				hashHistory.push("/superScreen");
			}
			else {
				hashHistory.push("/opScreen");
			}
		}
		else {
			hashHistory.push("/login");
		}
	}
};
