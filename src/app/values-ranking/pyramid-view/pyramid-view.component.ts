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
  selector: 'app-pyramid-view',
  templateUrl: './pyramid-view.component.html',
  styleUrls: ['./pyramid-view.component.scss'],
})
export class PyramidViewComponent implements OnInit {
  ref: MatDialogRef<any>;
  @ViewChild(TemplateRef) template: TemplateRef<any>;
  config = {
    disableClose: false,
    // panelClass: 'custom-overlay-pane-class',
    hasBackdrop: true,
    backdropClass: '',
  };
  values: {
    veryvery: Pbvs;
    very1: Pbvs;
    very2: Pbvs;
    average1: Pbvs;
    average2: Pbvs;
    average3: Pbvs;
    average4: Pbvs;
    not1: Pbvs;
    not2: Pbvs;
    notnot: Pbvs;
  };

  @Input() culture: 'jewish' | 'druze' | 'christian' | 'muslim' = 'jewish';
  @Input() set setValues(values: {
    veryvery: Pbvs;
    very1: Pbvs;
    very2: Pbvs;
    average1: Pbvs;
    average2: Pbvs;
    average3: Pbvs;
    average4: Pbvs;
    not1: Pbvs;
    not2: Pbvs;
    notnot: Pbvs;
  }) {
    this.values = values;
  }
  @Output() clicked: EventEmitter<boolean> = new EventEmitter();
  value: Pbvs;

  constructor(public dialog: MatDialog) {
    this.values = {
      veryvery: null,
      very1: null,
      very2: null,
      average1: null,
      average2: null,
      average3: null,
      average4: null,
      not1: null,
      not2: null,
      notnot: null,
    };
  }

  ngOnInit() {}

  public open(values: {
    veryvery: Pbvs;
    very1: Pbvs;
    very2: Pbvs;
    average1: Pbvs;
    average2: Pbvs;
    average3: Pbvs;
    average4: Pbvs;
    not1: Pbvs;
    not2: Pbvs;
    notnot: Pbvs;
  }) {
    this.values = values;
    this.ref = this.dialog.open(this.template, this.config);
  }

  confirm() {
    this.clicked.emit(true);
    this.close();
  }

  cancel() {
    this.clicked.emit(false);
    this.close();
  }

  close() {
    this.ref.close();
  }
}
