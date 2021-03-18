export class SessionDataModel{
    private _idCaja:string;
    private _idOficina:string;
    private _funcionarioData:any;

    
    public get idCaja():string {
        return JSON.parse(localStorage.getItem('Caja'));
    }
    
    public set idCaja(value:string) {
        localStorage.setItem("Caja", value);
        this._idCaja = value; 
    }
    
    public get idOficina():string {
        return JSON.parse(localStorage.getItem('Oficina'));
    }
    
    public set idOficina(value:string) {      
        localStorage.setItem("Oficina", value);
        this._idOficina = value;
    }

    public get funcionarioData():any {
        return JSON.parse(localStorage.getItem('User'));
    }
}