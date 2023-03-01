import { Component } from '@angular/core';
import { ApiService } from '../api.service';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { merge, Observable, of as observableOf } from 'rxjs';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})

export class DashboardComponent {
  detenciones:any = null;
  total_detenciones:number = 0;
  total_audiencias:number = 0;
  personas_array:any = [];
  total_menores:number = 0;
  ultimo_movimiento: Date | undefined;
  expandedElement: DashboardComponent | undefined;
  columnsToDisplay: string[] = ['id', 'fecha', 'nombre', 'dias', 'dependencia', 'delito', 'edad'];
  age: number = 0;
  totales_por_dependencia:any = [];
  storage_key: string = 'REP_DET';

  CalculateAge(birthdate: Date){
    let date = new Date(birthdate);
    var timeDiff = Math.abs(Date.now() - new Date(date).getTime());
    let ages = Math.floor(timeDiff / (1000 * 3600 * 24) / 365.25);
    return ages;
  }

  constructor(private httpApiService: ApiService) {}

  ngOnInit(){
    //this.listDetenciones()
    localStorage.removeItem(this.storage_key);
  }

  public saveData(key: string, value: string) {
    localStorage.setItem(key, value);
  }

  listDetenciones(){
    this.httpApiService.getDetenciones()
      .subscribe((response)=>{
      response = response.sort(function(a, b) {
          var c:any = new Date(a.fecha);
          var d:any = new Date(b.fecha);
          return d-c;
      });

      this.ultimo_movimiento = response[0].fecha;
      this.detenciones = response;
      this.total_detenciones = response.length;

      this.total_menores = 0;
      // Agrupar datos
      let arr_personas = this.detenciones.reduce((c:any, v:any) => c.concat(v), []).map((o: { persona: any; }) => o.persona);
      console.log(arr_personas);

      const persYMap =  (arr_personas: any[]) => arr_personas.reduce((acc:any, cur:any) => {
        const { fecha_nacimiento } = cur;
        const entry = acc[`${fecha_nacimiento}`];
        const menedad = this.CalculateAge(fecha_nacimiento);
        if (menedad < 18 ) {
          acc[`${menedad}`] = { fecha_nacimiento };
        }

        return acc;
      }, {});

      const persArray = (XYMap: { [s: string]: unknown; } | ArrayLike<unknown>) => Object.values(XYMap);
      this.personas_array = persArray(persYMap(arr_personas));
      console.log(persArray(persYMap(arr_personas)));

    })
  }

  calcularReporte(){
    this.totales_por_dependencia = [];
    // Agrupar dependencias
    let arr_dependencias = this.detenciones.reduce((c:any, v:any) => c.concat(v), []).map((o: { dependencia: any; }) => o.dependencia);
    console.log(arr_dependencias);

    const makeXYMap =  (arr_dependencias: any[]) => arr_dependencias.reduce((acc:any, cur:any) => {
      const { descripcion } = cur;
      const entry = acc[`${descripcion}`];

      if (entry) {
        acc[`${descripcion}`] = {...entry, count: entry.count + 1};
      } else {
        acc[`${descripcion}`] = { descripcion, count: 1 };
      }

      return acc;
    }, {});

    const makeArray = (XYMap: { [s: string]: unknown; } | ArrayLike<unknown>) => Object.values(XYMap);
    this.totales_por_dependencia = makeArray(makeXYMap(arr_dependencias));
    console.log(makeArray(makeXYMap(arr_dependencias)));
  }

  guardar_reporte(){
    var inputValue = (<HTMLInputElement>document.getElementById('input_obs')).value;
    var ls_totales = "Total Detenciones:"+this.total_detenciones+"; "+"Total Menores:"+this.personas_array.length+"; "+"obs: "+inputValue;

    if (localStorage.getItem(this.storage_key) === null) {
      localStorage.setItem(this.storage_key, ls_totales);
      alert('CORRECTO! informacion guardada con exito');
    } else {
      alert('ERROR! Los datos ya fueron cargados con anterioridad');
    }

  }
}

