sap.ui.define([
	"./BaseController",
	"sap/ui/model/json/JSONModel",
	"../model/formatter",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/core/routing/History",
	"sap/m/Dialog",
	"sap/m/DialogType",
	"sap/m/Button",
	"sap/m/ButtonType",
	"sap/m/MessageToast",
	"sap/ui/layout/HorizontalLayout",
	"sap/ui/layout/VerticalLayout",
	"sap/m/Text",
    "sap/m/TextArea",
    "sap/ui/core/BusyIndicator",
    "sap/ui/core/Fragment",
    "hb4/zhb4_mispedidos/includes/firma",
    "sap/m/MessageBox"
], function (BaseController, JSONModel, formatter, Filter, FilterOperator, History, Dialog, DialogType, Button, ButtonType, MessageToast,
	HorizontalLayout,
	VerticalLayout, Text, TextArea, BusyIndicator, Fragment, Firma, MessageBox) {
	"use strict";
	var oController;
	var oJSONModel = new JSONModel();
	var oMessage;
	return BaseController.extend("zhb4.zhb4contratos.controller.Lotes", {
        
        formatter: formatter,
		/* =========================================================== */
		/* lifecycle methods                                           */
		/* =========================================================== */

		/**
		 * Called when the worklist controller is instantiated.
		 * @public
		 */
        onInit: function () {
            oController = this;
        },

        onCargarPDFContratos: function(oEvent){
            var vKey = oEvent.getSource().getBindingContextPath().getProperty("Pedido");
            if (vKey){
                var aFilters = [];
                aFilters.push(new sap.ui.model.Filter("Documento", sap.ui.model.FilterOperator.EQ, vKey));
                this.getView().getModel().read("/contratoPdfListadoSet",{
                    filters: aFilters,
                    success: function (oData) {
                        var oTableJSON = new sap.ui.model.json.JSONModel();
                        var Anexos = {
                            Datos: oData.results
                        };                        
                        oTableJSON.setData(Anexos);
                        this.getView().byId("__tblContratosAnexos").setModel(oTableJSON, "Anexos");
                    }.bind(this)
                });
            }
        },

        onVisualizarAnexo: function (oEvent) {
            var oItem = oEvent.getSource().getParent();
			var oTabla = oEvent.getSource().getParent().getParent();
            var oDatos = oTabla.getModel("Anexos").getProperty(oItem.getBindingContextPath());
            var lv_path;
            if (oDatos.Extension === "HTM" || oDatos.Extension === "HTML") {
                 lv_path = "";
                 lv_path = oDatos.Anexo;
                this.getView().byId("framePDFContrato").setContent("<iframe title=\"Anexos\" src=\"" + lv_path +
                        "\" width=\"92%\" height=\"600\" seamless></iframe>");
            } else{
                var oRootPath = jQuery.sap.getModulePath("hb4.zhb4_mispedidos");
                var sRead = oRootPath + "/sap/opu/odata/sap/ZOS_HB4_MODIFICACION_PEDIDO_SRV/contratoPdfSet('" + oDatos.Anexo + "')/" + "$" + "value";
                this.getView().byId("framePDFContrato").setContent("<iframe title=\"Contrato\" src=\"" + sRead +
                        "\" width=\"92%\" height=\"600\" seamless></iframe>");
            }
        },

        onAnularContrato: function(oEvent){
            oController.aAnularPedido = oEvent.getSource().getBindingContextPath().getProperty("Pedido");
            oController.aAnularContrato = oEvent.getSource().getBindingContextPath().getProperty("NroCartaOferta");
            if (!oController._DialogMotivoAnular) {
				oController._DialogMotivoAnular = sap.ui.xmlfragment("zhb4.zhb4contratos.view.Anular", oController);
				var i18nModel = new sap.ui.model.resource.ResourceModel({
					bundleUrl: "i18n/i18n.properties"
				});
				oController._DialogMotivoAnular.setModel(i18nModel, "i18n");
			}
			sap.ui.getCore().byId("_iMotivoAnular").setValue(null);
			oController._DialogMotivoAnular.open();
        },

		onAnular: function () {
			if (sap.ui.getCore().byId("_iMotivoAnular").getValue()) {
				if (!this.oAnularDialog) {
					this.oAnularDialog = new Dialog({
						type: DialogType.Message,
						title: "Confirmación Anulación",
						content: new Text({
							text: "¿Confirma Solicitud de Anulación de Contrato?"
						}),
						beginButton: new Button({
							type: ButtonType.Emphasized,
							text: "Confirmar",
							press: function () {
								oController.onConfirmaAnular();
								this.oAnularDialog.close();
							}.bind(this)
						}),
						endButton: new Button({
							text: "Cancelar",
							press: function () {
								this.oAnularDialog.close();
							}.bind(this)
						})
					});
				}

				this.oAnularDialog.open();
			} else {
				MessageToast.show("Debe ingresar el motivo de solicitud de anulación de Contrato");
			}

		},

		onConfirmaAnular: function () {
			var motivo = sap.ui.getCore().byId("_iMotivoAnular").getValue();
			var sPath = this.getView().getModel().createKey("/lotesSet", {
				Pedido: oController.aAnularPedido,
				NroCartaOferta: oController.aAnularContrato
			});
			
			oController._DialogMotivoAnular.close();
			oController._DialogMotivoAnular.destroy();
			oController._DialogMotivoAnular = null;	
			this.getView().setBusy(true);
			var oEntidad = {
                Pedido: oController.aAnularPedido,
                Cultivo: "",
                Anio: "",
				NroCartaOferta: oController.aAnularContrato,
				materialLote: vMaterialLote,
                Fecha: "",
                TnTotales: "",
                HaTotales: "",
                Aporte: "",
                CantLotes: "",
                Estado: "",
				Motivo: motivo
			};

			this.getView().getModel().update(sPath, oEntidad, {
				success: function (resultado) {
					MessageToast.show("Solicitud de anulación enviada correctamente");
					this.getView().setBusy(false);
				}.bind(this),
				error: function (error) {
					MessageToast.show("No se pudo enviar la solicitud");
					oController.getView().setBusy(false);
				}
			});
		},

		onCancelarAnular: function () {
			oController._DialogMotivoAnular.close();
			oController._DialogMotivoAnular.destroy();
			oController._DialogMotivoAnular = null;
        },

        onPressAltaContrato: function () {
            
        },
    });
});