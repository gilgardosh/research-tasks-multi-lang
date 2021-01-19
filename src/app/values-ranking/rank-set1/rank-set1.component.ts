import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { AudioService } from 'src/app/shared/services/audio.service';
import { Pbvs, DataService } from '../../shared/services/data.service';

@Component({
  selector: 'app-rank-set1',
  templateUrl: './rank-set1.component.html',
  styleUrls: ['./rank-set1.component.scss'],
  providers: [AudioService],
})
export class RankSet1Component implements OnInit, OnDestroy {
  @Input() culture: string;
  @Output() gotRanking: EventEmitter<boolean> = new EventEmitter<boolean>();
  isMale = true;
  title: string;
  stage = 1;
  calculating = false;
  playerSubscription: Subscription;
  playerworking: Subscription;

  orderedValues = {
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

  valuesStages = [
    'veryvery',
    'notnot',
    'very1',
    'very2',
    'not1',
    'not2',
    'average1',
    'average2',
    'average3',
    'average4',
  ];

  constructor(
    private audioService: AudioService,
    public dataService: DataService
  ) {}

  ngOnInit(): void {
    this.isMale = this.dataService.gender === 'M';
    this.playSound();
    this.playerworking = this.audioService
      .getPlayerStatus()
      .subscribe((res) => {
        if (res !== 'ended') {
          this.calculating = true;
        } else {
          this.calculating = false;
        }
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe(this.playerSubscription);
    this.unsubscribe(this.playerworking);
  }

  unsubscribe(sub: Subscription) {
    if (sub) {
      sub.unsubscribe();
    }
  }

  stepback() {
    this.calculating = true;
    this.unsubscribe(this.playerSubscription);
    this.audioService.pauseAudio();
    this.stage -= 1;
    while (this.stage >= 7) {
      this.stage -= 1;
      this.orderedValues[this.valuesStages[this.stage]].isStock = true;
      this.orderedValues[this.valuesStages[this.stage]].rank = null;
      this.orderedValues[this.valuesStages[this.stage]] = null;
    }
    if (this.stage >= 1) {
      this.orderedValues[this.valuesStages[this.stage - 1]].isStock = true;
      this.orderedValues[this.valuesStages[this.stage - 1]].rank = null;
      this.orderedValues[this.valuesStages[this.stage - 1]] = null;
      this.playSound();
    }
    this.calculating = false;
  }

  valueClick(val: Pbvs) {
    if (!this.calculating) {
      this.calculating = true;
      this.unsubscribe(this.playerSubscription);
      this.stage += 1;
      this.playSound();
      val.isStock = false;
      this.orderedValues[this.valuesStages[this.stage - 2]] = val;
      val.rank = this.getRank(this.valuesStages[this.stage - 2]);
      if (this.stage >= 7) {
        const subscription = this.audioService.getPlayerStatus();
        // inner delated func
        const stage7 = () => {
          this.playerSubscription = subscription.subscribe((res) => {
            if (res === 'ended') {
              for (let i = 1; i <= 10; i++) {
                if (this.dataService['pbvs' + i].isStock) {
                  const value = this.dataService['pbvs' + i];
                  this.stage += 1;
                  value.isStock = false;
                  value.rank = this.getRank(this.valuesStages[this.stage - 2]);
                  this.orderedValues[this.valuesStages[this.stage - 2]] = value;
                }
              }
              this.calculating = false;
            }
          });
        };
        setTimeout(stage7, 1000);
      } else {
        this.calculating = false;
      }
    }
  }

  playSound() {
    const createSoundLink = (num: number): string => {
      return `../../assets/values-ranking/guidance_aud/${
        this.culture === 'jewish' ? 'heb' : 'arab'
      }/inst-${num}-${this.isMale ? 'M' : 'F'}.mp3`;
    };
    const titles = (num: number): string => {
      const titlesDict = [
        {
          arab: {
            M:
              'برأس الصفحة يمكنك أن ترى أنه مكتوب " مهم جدا “. اختر صورة واحدة هي الأكثر أهمية بالنسبة لك وكيف تود أن تكون في المستقبل. الآن اضغط على تلك الصورة',
            F:
              'برأس الصفحة يمكنكِ أن تري أنه مكتوب " مهم جدا “. اختاري صورة واحدة هي الأكثر أهمية بالنسبة لكِ وكيف تودين أن تكوني في المستقبل. الآن اضغطي على تلك الصورة',
          },
          heb: {
            M:
              'בראש העמוד אתה יכול לראות שרשום "חשוב מאוד". בחר תמונה אחת שהכי חשובה לך ולאיך שתרצה להיות בחייך, ולחץ עליה',
            F:
              'בראש העמוד את יכולה לראות שרשום "חשוב מאוד". בחרי תמונה אחת שהכי חשובה לך ולאיך שתרצי להיות בחייך, ולחצי עליה',
          },
        },
        {
          arab: {
            M:
              'بالتأكيد هنالك أمور وأشياء أخرى غير مهمة أبداً بالنسبة لك “. اختر صورة واحدة أبدا غير مهمة لك وليس لها علاقة بما تود أن تكون في المستقبل',
            F:
              'بالتأكيد هنالك أمور وأشياء أخرى غير مهمة أبداً بالنسبة لكِ. اختاري صورة واحدة أبدا غير مهمة لكِ وليس لها علاقة بما تودين أن تكوني في المستقبل.',
          },
          heb: {
            M:
              'בטח יש דברים שבכלל לא חשובים לך. בחר תמונה שלא חשובה לך בכלל ולא חשובה לאיך שתרצה להיות בעתיד',
            F:
              'בטח יש דברים שבכלל לא חשובים לך. בחרי תמונה שלא חשובה לך בכלל ולא חשובה לאיך שתרצי להיות בעתיד',
          },
        },
        {
          arab: {
            M:
              'وصلنا الآن للسطر الثاني، بالتأكيد هنالك عدة أشياء تعتبر مهمة بالنسبة لك. اختر صورتين فيهما الأشياء المهمة لك.',
            F:
              'وصلنا الآن للسطر الثاني، بالتأكيد هنالك عدة أشياء تعتبر مهمة بالنسبة لكِ. اختاري صورتين فيهما الأشياء المهمة لك.',
          },
          heb: {
            M:
              'עכשיו הגענו לשורה השנייה. בטח יש עוד כמה דברים שחשובים לך. בחר 2 תמונות שמראות משהו שחשוב לך',
            F:
              'עכשיו הגענו לשורה השנייה. בטח יש עוד כמה דברים שחשובים לך. בחרי 2 תמונות שמראות משהו שחשוב לך',
          },
        },
        {
          arab: {
            M:
              'الآن وصلنا للسطر قبل الأخير:  "هذا السطر يتضمن الأشياء الغير مهمة بالنسبة لك . اختر صورتين لهذا السطر.',
            F:
              'الآن وصلنا للسطر قبل الأخير:  "هذا السطر يتضمن الأشياء الغير مهمة بالنسبة لك . اختاري صورتين لهذا السطر.',
          },
          heb: {
            M:
              'עכשיו נגיע לשורה אחת לפני האחרונה. היא שייכת לדברים שלא ממש חשובים לך. בחר עוד 2 תמונות בשביל השורה הזאת',
            F:
              'עכשיו נגיע לשורה אחת לפני האחרונה. היא שייכת לדברים שלא ממש חשובים לך. בחרי עוד 2 תמונות בשביל השורה הזאת',
          },
        },
        {
          arab: {
            M: 'بقي لك 4 صور نضعهم بالسطر الوسط.',
            F: 'بقي لك 4 صور نضعهم بالسطر الوسط.',
          },
          heb: {
            M: 'נשארו לך 4 תמונות. נשים אותן בשורה האמצעית',
            F: 'נשארו לך 4 תמונות. נשים אותן בשורה האמצעית',
          },
        },
      ];
      return titlesDict[num - 1][this.culture === 'jewish' ? 'heb' : 'arab'][
        this.isMale ? 'M' : 'F'
      ];
    };
    switch (this.stage) {
      case 1: {
        this.title = titles(1);
        this.audioService.setAudio(createSoundLink(1));
        break;
      }
      case 2: {
        this.title = titles(2);
        this.audioService.setAudio(createSoundLink(2));
        break;
      }
      case 3: {
        this.audioService.setAudio(createSoundLink(3));
      }
      case 4: {
        this.title = titles(3);
        break;
      }
      case 5: {
        this.audioService.setAudio(createSoundLink(4));
      }
      case 6: {
        this.title = titles(4);
        break;
      }
      case 7: {
        this.title = titles(5);
        this.audioService.setAudio(createSoundLink(5));
        break;
      }
      default: {
        break;
      }
    }
  }

  getRank(rank: string) {
    let renkVal: number;
    switch (rank) {
      case 'veryvery': {
        renkVal = 5;
        break;
      }
      case 'very2' || 'very1': {
        renkVal = 4;
        break;
      }
      case 'not2' || 'not1': {
        renkVal = 2;
        break;
      }
      case 'notnot': {
        renkVal = 1;
        break;
      }
      case 'average4' || 'average3' || 'average2' || 'average1': {
        renkVal = 3;
        break;
      }
    }
    return renkVal;
  }

  getImgLink(num: number) {
    return `../../assets/values-ranking/values_img/val${num}.png`;
  }
}
