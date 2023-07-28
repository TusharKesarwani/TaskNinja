import { Component, Input } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalDismissReasons, NgbDatepickerModule, NgbModal, NgbActiveModal, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { saveAs } from 'file-saver';
import { Papa } from 'ngx-papaparse';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})

export class AppComponent {
  title = 'TaskNinja';

  constructor(private modalService: NgbModal, private papa: Papa) {}

  closeResult:any;
  sortByDueDate: boolean = false;
  sortByPriority: boolean = false;
  collapsed = true;

  taskForm = new FormGroup({
    taskTitle: new FormControl('', [Validators.required, Validators.minLength(1)]),
    taskDesc: new FormControl('', [Validators.required]),
    taskDate: new FormControl('', [Validators.required]),
    taskPrio: new FormControl('3', [Validators.required, Validators.pattern('[1-3]')]),
    taskStat: new FormControl('To-do', [Validators.required]),
  });

  editTaskForm = new FormGroup({
    editTaskTitle: new FormControl('', [Validators.required, Validators.minLength(1)]),
    editTaskDesc: new FormControl('', [Validators.required]),
    editTaskDate: new FormControl('', [Validators.required]),
    editTaskPrio: new FormControl('3', [Validators.required, Validators.pattern('[1-3]')]),
    editTaskStat: new FormControl('To-do', [Validators.required]),
  });

  list: any[] = [];
  tempList: any[] = [];
  addTask(taskTitle:any, taskDesc:any, taskDate:any, taskPrio:any, taskStat:any) {
    const newTask = {
      id: this.list.length,
      taskTitle: this.taskForm.value.taskTitle,
      taskDesc: this.taskForm.value.taskDesc,
      taskDate: this.taskForm.value.taskDate,
      taskPrio: this.taskForm.value.taskPrio,
      taskStat: this.taskForm.value.taskStat,
      history: [],
    };
    this.list.push(newTask);
    taskTitle.value=null;
    taskDesc.value=null;
    taskDate.value=null;
    taskPrio.value=null;
    this.taskForm.reset({taskTitle:'',taskDesc:'',taskDate:'',taskPrio:'3',taskStat: 'To-do'});

  }
  
  removeTask(id: number) {
    this.list = this.list.filter((item) => item.id !== id);
  }
  
  
  open(content:any, id:any) {
    this.editTaskForm.reset({editTaskTitle:this.list[id].taskTitle,editTaskDesc:this.list[id].taskDesc,editTaskDate:this.list[id].taskDate,editTaskPrio:this.list[id].taskPrio,editTaskStat: this.list[id].taskStat});
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then(
      (result) => {
        this.closeResult = `Closed with: ${result}`;
			},
			(reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
			},
      );
      this.editTaskForm.value.editTaskTitle = this.list[id].taskTitle;
      console.log(this.editTaskForm.value);
  }

	private getDismissReason(reason: any): string {
		if (reason === ModalDismissReasons.ESC) {
			return 'by pressing ESC';
		} else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
			return 'by clicking on a backdrop';
		} else {
			return `with: ${reason}`;
		}
  }

  editTask(idNum: any) {

    const editedTask = {
      taskTitle: this.list[idNum].taskTitle,
      taskDesc: this.list[idNum].taskDesc,
      taskDate: this.list[idNum].taskDate,
      taskPrio: this.list[idNum].taskPrio,
      taskStat: this.list[idNum].taskStat,
    };
    this.tempList = this.list[idNum].history || [];
    this.tempList.push(editedTask);
    this.list[idNum].history = this.tempList;

    this.list[idNum].taskTitle = this.editTaskForm.value.editTaskTitle;
    this.list[idNum].taskDesc = this.editTaskForm.value.editTaskDesc;
    this.list[idNum].taskDate = this.editTaskForm.value.editTaskDate;
    this.list[idNum].taskPrio = this.editTaskForm.value.editTaskPrio;
    this.list[idNum].taskStat = this.editTaskForm.value.editTaskStat;
    console.log(this.list[idNum].history);
    this.editTaskForm.reset({editTaskTitle:'',editTaskDesc:'',editTaskDate:'',editTaskPrio:'3',editTaskStat: 'To-do'});
  }

  getTasksByStatus(status: string) {
    return this.list.filter((task) => task.taskStat === status);
  }


  sortTasksByDueDate() {
    if (this.sortByDueDate) {
      this.list.sort((a, b) => {
        const dateA = new Date(a.taskDate).getTime();
        const dateB = new Date(b.taskDate).getTime();
        return dateA - dateB;
      });
    } else {
      this.list.sort((a, b) => {
        const dateA = new Date(a.taskDate).getTime();
        const dateB = new Date(b.taskDate).getTime();
        return dateB - dateA;
      });
    }
    this.sortByDueDate = !this.sortByDueDate;
    this.sortByPriority = false;
  }

  sortTasksByPriority() {
    if (this.sortByPriority){
      this.list.sort((a, b) => a.taskPrio - b.taskPrio);
    } else {
      this.list.sort((a, b) => b.taskPrio - a.taskPrio);
    }
    this.sortByPriority = !this.sortByPriority;
    this.sortByDueDate = false;
  }

  exportToCSV() {
    const csvData = this.papa.unparse(this.list);
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'tasks.csv');
  }

}
