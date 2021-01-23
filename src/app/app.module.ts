import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppRoutingModule } from './app.routing';
import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';
import { ValuesRankingComponent } from './values-ranking/values-ranking.component';
import { MenuComponent } from './menu/menu.component';
import { ValuesSet1Component } from './values-ranking/values-set1/values-set1.component';
import { RankSet1Component } from './values-ranking/rank-set1/rank-set1.component';
import { ValuesSet2Component } from './values-ranking/values-set2/values-set2.component';
import { RankSet2Component } from './values-ranking/rank-set2/rank-set2.component';
import { SummaryComponent } from './values-ranking/summary/summary.component';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ValueDialogComponent } from './values-ranking/value-dialog/value-dialog.component';
import { PyramidViewComponent } from './values-ranking/pyramid-view/pyramid-view.component';

@NgModule({
  declarations: [
    AppComponent,
    ValuesRankingComponent,
    MenuComponent,
    ValuesSet1Component,
    RankSet1Component,
    ValuesSet2Component,
    RankSet2Component,
    SummaryComponent,
    ValueDialogComponent,
    PyramidViewComponent,
  ],
  imports: [
    BrowserModule,
    CommonModule,
    SharedModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
