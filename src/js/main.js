/*=======================================================================================================
 lib
========================================================================================================*/
function Lib() {
  // recupera los parametros de una url.
  function getParamsByURL(url) {
    if (url == "") return {};
    var obj = {};
    for (var i = 0; i < url.length; ++i) {
      var param = url[i].split('=', 2);
      if (param.length == 1)
        obj[param[0]] = "";
      else
        obj[param[0]] = decodeURIComponent(param[1].replace(/\+/g, " "));
    }
    return obj;
  };

  // recupera los parametros de la url actual.
  function getParamsByCurrentURL() {
    var urlParams = window.location.search.substr(1).split('&');
    return getParamsByURL(urlParams);
  };

  function strToBool(value) {
    switch (String(value).toLowerCase()) {
      case 'undefined':
      case 'null':
      case 'nan':
      case 'false':
      case 'no':
      case 'f':
      case 'n':
      case '0':
      case 'off':
      case '':
        return false;
        break;
      default:
        return true;
    };
  }

  return {
    getParamsByURL: getParamsByURL,
    getParamsByCurrentURL: getParamsByCurrentURL,
    strToBool: strToBool,
  }
}

// export public
var lib = new Lib();
//console.log('lib', lib);

/*=======================================================================================================
 config 
========================================================================================================*/
function ConfigLendismart() {
  var paramsURL = lib.getParamsByCurrentURL();
  //console.log('params', paramsURL);

  var cfgParams = {
    sandbox: lib.strToBool(paramsURL["sandbox"]) || true,
    publicKey: paramsURL["publicKey"] || "65c485ef-25d9-41a5-b5db-9fd003461d38",
    merchantCode: paramsURL["merchantCode"] || "VORWERK_KOBOLD_PB",
    goodsTypeCode: paramsURL["goodsTypeCode"] || "TM_STANDARD_PROMO_1",
    title: paramsURL["title"] || "Producto #1",
    purchaseAmount: paramsURL["purchaseAmount"] || 668.99,
  }
  //console.log('cfgParams', cfgParams);

  // config general
  var Sdk = {
    primaryColor: "#004f9a",
    language: "es",
    sandbox: cfgParams.sandbox,
    publicKey: cfgParams.publicKey,
    merchantCode: cfgParams.merchantCode,
  };

  // config para la simulacion
  var OpenSimulator = {
    goodsTypeCode: cfgParams.goodsTypeCode,
    title: cfgParams.title,
    purchaseAmount: cfgParams.purchaseAmount,
    showRequestedAmount: false, // BUG en el IE si True
  };

  return {
    Sdk: Sdk,
    OpenSimulator: OpenSimulator,
  }
}

/*=======================================================================================================
 Lendismart setup 
========================================================================================================*/
window.onLendismartSdkReady = function (lsSDK) {
  var configLendismart = ConfigLendismart();
  //console.log("configLendismart", configLendismart)

  // Setup Lendismart sdk manual
  lsSDK.Widgets.config(configLendismart.Sdk);

  // declare method
  function handleOpenSimulator() {
    lsSDK.Widgets.openCreditSimulator(configLendismart.OpenSimulator);
  };

  // fire event
  handleOpenSimulator();
};