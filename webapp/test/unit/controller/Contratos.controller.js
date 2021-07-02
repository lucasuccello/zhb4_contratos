/*global QUnit*/

sap.ui.define([
	"zhb4/zhb4_contratos/controller/Contratos.controller"
], function (Controller) {
	"use strict";

	QUnit.module("Contratos Controller");

	QUnit.test("I should test the Contratos controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
