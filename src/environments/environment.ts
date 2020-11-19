// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  conexionVista: 'http://localhost:4200/',
  conexionApi: 'http://localhost:3105/',
  conexionImagenes: 'https://www.remolkar.com/imagenes/productos/',
  conexionVideos: 'https://www.remolkar.com/imagenes/videos/',
  conexionDatafast: "https://test.oppwa.com/v1/paymentWidgets.js?checkoutId=",
  conexionDatafastVerificacion: "http://localhost:4200/compra/verificacion"
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
