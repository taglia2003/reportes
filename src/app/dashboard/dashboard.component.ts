import { Component } from '@angular/core';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})


export class DashboardComponent {
  detenciones:any = null;
  total_detenciones:number = 0;
  total_audiencias:number = 0;
  ultimo_movimiento:Date | undefined;
  
  constructor(private httpApiService: ApiService) {
  }

  ngOnInit(){
    //call this method on component load

  }

  listDetenciones(){
    this.httpApiService.getDetenciones()
    .subscribe((response)=>{
      this.detenciones = response;
    })
  }

  calcularReporte(){
    console.log('calcular Reporte Totales')
  }

}
