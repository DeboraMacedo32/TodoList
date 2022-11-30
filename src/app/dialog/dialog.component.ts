import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'


@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit {

   statusLista = ["Concluída", "Não Concluída", "Em Andamento"];
   tarefaForm !: FormGroup;
   actionBtn : string = "Salvar"

  constructor(private formBuilder : FormBuilder,
     private api : ApiService,
     @Inject(MAT_DIALOG_DATA) public editData : any,
      private dialogRef : MatDialogRef<DialogComponent>) { }

  ngOnInit(): void {

    this.tarefaForm = this.formBuilder.group({
      taskName : ['', Validators.required],
      category : ['', Validators.required],
      statusTask : ['', Validators.required],
      comment : ['', Validators.required],
      date1 : ['', Validators.required],
      date2 : ['', Validators.required]

    });
    if(this.editData){
      this.actionBtn = "Atualizar";
      this.tarefaForm.controls['taskName'].setValue(this.editData.taskName);
      this.tarefaForm.controls['category'].setValue(this.editData.category);
      this.tarefaForm.controls['statusTask'].setValue(this.editData.statusTask);
      this.tarefaForm.controls['comment'].setValue(this.editData.comment);
      this.tarefaForm.controls['date1'].setValue(this.editData.date1);
      this.tarefaForm.controls['date2'].setValue(this.editData.date2);
      
    }
  }

  addTask() {
   if(!this.editData){
    if(this.tarefaForm.valid){
      this.api.postTask(this.tarefaForm.value)
      .subscribe({
        next:(res)=>{
          alert("Tarefa adicionada com sucesso!");
          this.tarefaForm.reset();
          this.dialogRef.close('salvar');
          
        },
        error:()=>{
          alert("Erro ao add a tarefa")
        }
      })
     }
   }else{
    this.updateTask()

   }
   
  }

  updateTask(){
    this.api.putTask(this.tarefaForm.value, this.editData.id)
    .subscribe({
      next:(res)=>{
        alert("Tarefa atualizada com sucesso!");
        this.tarefaForm.reset();
        this.dialogRef.close('update');
        
      },
      error:()=>{
        alert("Erro ao atualizar o registro!")
      }
    })
    
  }
}
