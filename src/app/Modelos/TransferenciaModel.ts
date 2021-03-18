export class TransferenciaModel{
    Forma_Pago:string = '';
    Tipo_Transferencia:string = 'Transferencia';
    Id_Transferencia:string = '';

    //DATOS DEL CAMBIO
    Moneda_Origen: '2';
    Moneda_Destino: '';
    Cantidad_Recibida: '';
    Cantidad_Transferida: '';
    Tasa_Cambio: '';
    Identificacion_Funcionario: '';
    Id_Caja: '';
    Observacion_Transferencia:'';

    //DATOS REMITENTE
    Documento_Origen: '';
    Nombre_Remitente: '';
    Telefono_Remitente: '';

    //DATOS CREDITO
    Id_Tercero: '';
    Cupo_Tercero: 0;
    Bolsa_Bolivares: 0;

    //DATOS CONSIGNACION
    Id_Cuenta_Bancaria: '';

    //DATOS PARA TRANSFERENCIAS DIRECTO A UN CLIENTE(TERCERO)
    Id_Tercero_Destino: '';
    ReciboTransferenciaDetalleModel: '';
    Cantidad_Recibida_Bolsa_Bolivares;
}