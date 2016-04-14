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
	},

	cachedAjax: function (url, name, method) {
		return new Promise(function (resolve, reject) {
			method = method || "get";

			$.ajax({
				url: config.server + url,
				method: method,
				success: function (response) {
					console.log("Got:", response);
					localStorage.setItem(name, JSON.stringify(response));
					resolve(response);
				},
				error: function () {
					var cachedResponse = localStorage.getItem(name);
					if (cachedResponse) {
						cachedResponse = JSON.parse(cachedResponse);
						resolve(cachedResponse);
					}
					else {
						reject();
					}
				}
			});
		});
	}
};
