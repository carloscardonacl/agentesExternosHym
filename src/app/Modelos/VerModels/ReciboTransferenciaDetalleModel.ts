import { TransferenciaModel } from '../TransferenciaModel';

export class ReciboTransferenciaDetalleModel extends TransferenciaModel{
    
    public Remitente:string = '';
    public Destinatarios:Array<any> = [];
    public CodigoRecibo:string = '';
    public Fecha:string = '';
    public Cajero:string = '';
    public Codigo_Moneda_Origen:string = '';
    public Codigo_Moneda_Destino:string = '';
    public Monto_Transferido:string = '';
}