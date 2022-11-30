import { Component, OnInit, ViewChild } from '@angular/core';
import {MatDialog, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { DialogComponent } from './dialog/dialog.component';
import { ApiService } from './services/api.service';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'TodoTarefa';
  displayedColumns: string[] = ['taskName', 'category',  'comment', 'date1', 'date2','statusTask', 'action'];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

constructor(private dialog : MatDialog, private api : ApiService){

}
  ngOnInit(): void {
    this.getAllTasks();
  }

  openDialog() {
    this.dialog.open(DialogComponent, {
      width: '30%'
    }).afterClosed().subscribe(val=>{
      if(val === 'salvar'){
        this.getAllTasks();
      }
    })
  }

  getAllTasks(){
    this.api.getTask()
    .subscribe({
      next:(res)=>{
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error:(err)=>{
        alert("Erro ao buscar os registros! ")
      }
    })
  }

  editTask(row : any){
    this.dialog.open(DialogComponent,{
      width: '30%',
      data:row
    }).afterClosed().subscribe(val=>{
      if(val=== 'atualizar'){
        this.getAllTasks();
      }
    })

  }
  deleteTask(id:number){
    this.api.deleteTask(id)
    .subscribe({
      next:(res=>{
        alert("Tarefa deletada com sucesso!");
        this.getAllTasks();
      }),
      error:()=>{
        alert("Erro ao deletar a tarefa!")
      }
    })
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  
}

