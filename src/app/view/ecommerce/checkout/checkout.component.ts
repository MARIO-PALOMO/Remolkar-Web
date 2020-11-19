import { Renderer2, Component, OnInit, Inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { GenericService } from 'src/app/method/generic/generic.service';
import { ApiService } from 'src/app/services/api/api.service';
import { CartService } from 'src/app/services/cart/cart.service';
import { SessionService } from 'src/app/services/session/session.service';
import { ScriptService } from 'src/app/services/script/script.service';
import { environment } from 'src/environments/environment';
import { DOCUMENT } from '@angular/common';
import { NgxSpinnerService } from "ngx-spinner";
import { ActivatedRoute } from '@angular/router';

declare var $: any;

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  urls = environment;
  fmrDatosFacturacion = { "idUsuario": 0, "email": "", "rol": "", "estadoUsuario": 0, "idPersona": 0, "tipoIdentificacion": "", "identificacion": "", "nombre": "", "telefono": "", "direccion": "", "estadoPersona": 0, "idCliente": 0, "estadoCliente": "0" }

  panelesCompra = {
    panel1: true,
    panel2: false,
    panel3: false
  }

  panelProgreso = {
    panel1: false,
    panel2: false,
    panel3: false
  }

  usuario: any;

  itemsCarrito: any = {
    total: 0,
    envio: 0,
    numero: 0,
    lstCarrito: []
  };

  valores = {
    subtotal: 0,
    iva: 0,
    total: 0
  };

  url = "";
  checkoutid = "";

  data: any;

  idFormaPago = -1;
  pago: any = { "idFormaPago": 0, "tipo": "0", "nombre": "", "foto": null, "estado": 0, "tipoCuenta": null, "numeroCuenta": null, "bancoCuenta": null, "identificacionCuenta": null, "nombreCuenta": null };
  lstFormasPago = [];
  comprobante: any;
  img: any;

  constructor(private router: ActivatedRoute, public generico: GenericService, public conexion: ApiService, public cart: CartService, private toastr: ToastrService, public session: SessionService, private scripts: ScriptService, private _renderer2: Renderer2,
    @Inject(DOCUMENT) private _document: Document, private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.usuario = this.session.obtenerDatos();
    this.fmrDatosFacturacion = this.usuario.resultado;
    this.data = JSON.parse(atob(this.router.snapshot.params.data));

    this.verCarrito();
    this.listarFormasPago();
  }

  public listarFormasPago() {
    this.conexion.get("listarFormasPago", "").subscribe(
      (res: any) => {
        this.lstFormasPago = res.resultado;
      },
      err => {
        console.log(err);
      }
    );
  }

  public informacionFacturacion() {
    if (this.fmrDatosFacturacion.tipoIdentificacion.trim() == "") {
      this.toastr.warning('Seleccionar tipo de identificación', 'Datos Facturación');
    } else if (this.fmrDatosFacturacion.identificacion.trim() == "") {
      this.toastr.warning('Ingresar número de identificación', 'Datos Facturación');
    } else if (this.generico.validarIdentificacion(this.fmrDatosFacturacion.tipoIdentificacion, this.fmrDatosFacturacion.identificacion) == false) {
      this.toastr.warning('Ingresar número de identificación válido', 'Datos Facturación');
    } else if (this.fmrDatosFacturacion.nombre.trim() == "") {
      this.toastr.warning('Ingresar nombre', 'Datos Facturación');
    } else if (this.fmrDatosFacturacion.direccion.trim() == "") {
      this.toastr.warning('Ingresar dirección', 'Datos Facturación');
    } else if (this.fmrDatosFacturacion.telefono.trim() == "") {
      this.toastr.warning('Ingresar número de teléfono', 'Datos Facturación');
    } else if (this.generico.validarTelefonoCelular(this.fmrDatosFacturacion.telefono) == false) {
      this.toastr.warning('Ingresar número de teléfono válido', 'Datos Facturación');
    } else {
      this.actualizarDatosCliente();
    }
  }

  public actualizarDatosCliente() {
    var cliente = {
      identificador: 2,
      idCliente: this.fmrDatosFacturacion.idCliente,
      tipoIdentificacion: this.fmrDatosFacturacion.tipoIdentificacion,
      identificacion: this.fmrDatosFacturacion.identificacion,
      nombre: this.fmrDatosFacturacion.nombre,
      telefono: this.fmrDatosFacturacion.telefono,
      direccion: this.fmrDatosFacturacion.direccion,
      email: this.fmrDatosFacturacion.email
    }
    this.spinner.show();
    this.conexion.post("gestionCliente", this.usuario.token, cliente).subscribe(
      (res: any) => {
        this.spinner.hide();
        this.panelesCompra.panel2 = true;
        this.panelProgreso.panel1 = true;
        console.log(res.resultado);
      },
      err => {
        this.spinner.hide();
        this.toastr.warning("Error al actualizar la información de facturación, intente nuevamente.", "Información de Facturación");
        console.log(err);
      }
    );
  }

  public resumenCompra() {
    this.panelesCompra.panel3 = true;
  }
  /*
    public cargarScriptFormualrioDatafast() {
      const s = this._renderer2.createElement('script');
      s.type = 'text/javascript';
      s.src = this.url;
      this._renderer2.appendChild(this._document.body, s);
      this.cargarScriptDiferidosDatafast();
    }
  
    public cargarScriptDiferidosDatafast() {
      const s = this._renderer2.createElement('script');
      s.type = 'text/javascript';
      s.src = "assets/card-datafast/card-datafast-3-6-9-12.js";
      this._renderer2.appendChild(this._document.body, s);
    }
  
    public generarCheckoutId() {
      var datos = {
        subtotal: this.generico.redondear(this.valores.subtotal),
        iva: this.generico.redondear(this.valores.iva),
        total: this.generico.redondear(this.valores.total),
        primerNombre: "",
        segundoNombre: "",
        apellido: this.fmrDatosFacturacion.nombre,
        idCliente: this.fmrDatosFacturacion.idCliente + "" + this.fmrDatosFacturacion.idUsuario + "" + this.fmrDatosFacturacion.idPersona + this.generico.obtenerHora(""),
        idTransaccion: this.fmrDatosFacturacion.idCliente + "" + this.fmrDatosFacturacion.idUsuario + "" + this.fmrDatosFacturacion.idPersona + this.generico.obtenerHora(""),
        email: this.fmrDatosFacturacion.email,
        identificacion: this.fmrDatosFacturacion.identificacion,
        nombreProducto: "LOTE PRODUCTOS " + this.fmrDatosFacturacion.idCliente + this.fmrDatosFacturacion.idUsuario + this.fmrDatosFacturacion.idPersona
      };
  
      console.log(datos);
  
      this.conexion.post("obtenerChekoutId", this.usuario.token, datos).subscribe(
        (res: any) => {
          console.log(res.resultado);
          var resultado = res.resultado;
          this.checkoutid = resultado.id;
  
          this.panelesCompra.panel3 = true;
          this.url = environment.conexionDatafast + this.checkoutid;
          this.cargarScriptFormualrioDatafast();
  
        },
        err => {
          this.toastr.warning("Error al generar el formulario de pago, intente nuevamente.", "Formulario Pago");
          console.log(err);
        }
      );
    }*/

  public obtenerComprobante(ev) {
    this.comprobante = ev.target;
  }

  public finalizarCompra() {

    if(this.idFormaPago == 2){
      if (this.comprobante.files.length > 0) {
        let form = new FormData();
        form.append('file', this.comprobante.files[0]);
        this.spinner.show();
        this.conexion.upload("obtenerPath", form).subscribe(
          (res: any) => {
            this.spinner.hide();
            console.log(res)
            this.cart.eliminarCarrito();
            window.open(environment.conexionVista + "/", "_self");
          },
          err => {
            this.spinner.hide();
            console.log(err);
          }
        );
      }
    }else{
      this.cart.eliminarCarrito();
      window.open(environment.conexionVista + "/", "_self");
    }

  }

  public enviarEmail() {

  }

  public verCarrito() {
    this.itemsCarrito = {
      total: this.data.total,
      envio: 0,
      numero: this.cart.obtenerNumeroProductos(),
      lstCarrito: this.cart.verCarrito()
    };
    this.desglosarValores();
  }

  public eliminarCarrito() {
    this.cart.eliminarCarrito();
    this.verCarrito();
  }

  public obtenerTotalItem(cantidad, datos) {
    return this.cart.obtenerTotalItem(cantidad, datos);
  }

  public desglosarValores() {
    this.valores = this.generico.desglosarValores(this.itemsCarrito.total);
  }

  public obtenerPrecio(datos) {
    if (datos.promocion == 1) {
      return datos.precioDescuento;
    } else {
      return datos.precio
    }
  }

  public gestionPago() {
    console.log(this.idFormaPago);
    for (let pago of this.lstFormasPago) {
      if (pago.idFormaPago == this.idFormaPago) {
        this.pago = pago;
      }
    }
  }



}
