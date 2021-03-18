export class DestinatarioModel{
    public Id_Destinatario:string = '';
    public Nombre:string = '';
    public Estado:string = 'Activo';
    public Tipo_Documento:string = '';
    public Id_Pais:string = '';
    public Cuentas:Array<any> = [];
    public Id_Agente_Externo:String ='';
}