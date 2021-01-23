import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Pbvs } from 'src/app/shared/services/data.service';

@Component({
  selector: 'app-value-dialog',
  templateUrl: './value-dialog.component.html',
  styleUrls: ['./value-dialog.component.scss'],
})
export class ValueDialogComponent implements OnInit {
  ref: MatDialogRef<any>;
  @ViewChild(TemplateRef) template: TemplateRef<any>;
  config = {
    disableClose: false,
    panelClass: 'custom-overlay-pane-class',
    hasBackdrop: true,
    backdropClass: '',
  };
  @Output() clicked: EventEmitter<Pbvs> = new EventEmitter();
  value: Pbvs;

  constructor(public dialog: MatDialog) {}

  ngOnInit() {}

  public open(value: Pbvs) {
    this.value = value;
    console.log(value.text);
    this.ref = this.dialog.open(this.template, this.config);
  }

  confirm() {
    this.clicked.emit(this.value);
    this.close();
  }

  cancel() {
    this.clicked.emit(null);
    this.close();
  }

  close() {
    this.ref.close();
  }
}
