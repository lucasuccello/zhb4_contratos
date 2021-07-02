sap.ui.define([], function () {
	"use strict";

	return {

		/**
		 * Rounds the number unit value to 2 digits
		 * @public
		 * @param {string} sValue the number string to be rounded
		 * @returns {string} sValue with 2 digits rounded
		 */
		numberUnit: function (sValue) {
			if (!sValue) {
				return "";
			}
			return parseFloat(sValue).toFixed(2);
		},

		highlightStatus: function (sStatus) {

			switch (sStatus) {
			case "A":
				return "Error";
			case "V":
				return "Success";
			default:
				return "Information";
			}
        },

        colorTipoCultivo: function (cultivo) {
            switch (cultivo) {
                case "Trigo" || "TR": return 1;
                case "Soja" || "SO": return 7;
                default: return 1;
            }

        },

        agregarGlufo: function(sText){
            if(sText.slice(0,5) === "Glufo"){
                return true;
            }
            else{
                return false;
            }
        },

		textoStatus: function (sStatus) {
			switch (sStatus) {
			case "A":
				return "Anulado";
			case "V":
				return "Vigente";
			default:
                return "Finalizado";
            }
		},

        colorEstado: function (estado) {
            switch (estado) {
                case "A":
                    return sap.ui.core.ValueState.Error;
                case "V":
                    return sap.ui.core.ValueState.Success;
                default:
                    return sap.ui.core.ValueState.Information;
			}
        },

		stateStatus: function (sStatus) {
			var int = 0; //Success
			switch (sStatus) {
			case "A":
				int = 3;
			case "PA":
				int = 8;
			case "E":
				int = 7;
			case "EP":
				int = 6;
			case "P":
				int = 1;
			}
			return int;
		},

		visibleBotonera: function (sStatus) {

			switch (sStatus) {
			case "V":
				return true;
			default:
				return false;
			}
        },
        
       formatearMonto: function (sValue, sMoneda) {
			if (!sValue) {
				return "0";
			}
			var iValue = parseFloat(sValue);
			// La API de UI5 presenta problemas , se remplaza por codigo estandar JS
			// var oFormatter = new sap.ui.model.type.Currency();
			// return oFormatter.formatValue(["USD",iValue]);
			// var oFormatter = sap.ui.core.format.NumberFormat.getCurrencyInstance({
			// 	decimals: 2
			// });
			// return oFormatter.format(iValue);
			// Se utiliza la localización de chile
			if (sMoneda === "CLP") {
				// iValue = iValue * 100;
				var oNumberFormat = sap.ui.core.format.NumberFormat.getFloatInstance({
					minFractionDigits: 0,
					maxFractionDigits: 0,
					groupingEnabled: true,
					groupingSeparator: ".",
					decimalSeparator: ","
				});
				var temp = oNumberFormat.format(iValue);
				return temp.toLocaleString("es-CL", {
					style: 'decimal',
					maximumFractionDigits: '2'
				});

				// return iValue.toLocaleString("es-CL", {
				// 	style: 'decimal',
				// 	maximumFractionDigits: '0'
				// });
			} else {
				var oNumberFormat = sap.ui.core.format.NumberFormat.getFloatInstance({
					minFractionDigits: 2,
					maxFractionDigits: 2,
					groupingEnabled: true,
					groupingSeparator: ".",
					decimalSeparator: ","
				});
				var temp = oNumberFormat.format(sValue);
				return temp.toLocaleString("es-CL", {
					style: 'decimal',
					maximumFractionDigits: '2'
				});
				// return iValue.toLocaleString("es-CL", {
				// 	style: 'decimal',
				// 	maximumFractionDigits: '2'
				// });
            }
        }
	};

});