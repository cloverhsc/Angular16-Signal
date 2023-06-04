import { Component, EffectRef, Signal, computed, effect, signal } from '@angular/core';

import { toSignal, toObservable } from '@angular/core/rxjs-interop'

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  title = signal('ngSignal');
  anotherTitle: Signal<string> | undefined = undefined;
  computeValue = computed(() => {
    return this.title() + ' is awesome!';
  })

  dataset = signal<number[]>([]);
  EffectRef: EffectRef | undefined = undefined;

  // use toObservable() to convert a Signal to an RxJS Observable
  title$ = toObservable(this.title);

  // use toSignal() to convert an RxJS Observable to a Signal
  title2 = toSignal(this.title$);

  // use asReadonly() to convert a Signal to a ReadonlySignal
  readonlyTitle = this.title.asReadonly();


  constructor() {
    this.EffectRef = effect(() => {
      console.log('%c dataset changed', 'color: #bada55', this.dataset().length);
    })
  }

  ngOnInit(): void {
    this.anotherTitle = signal('Another Title');
  }

  changeTitle() {
    this.title.set('New Title 🤞')
  }
  updateTitle() {
    this.title.update((originalValue) => originalValue + ' 📤️')
  }

  mutateDataset() {
    this.dataset.mutate((oldAry: number[]) => {
      oldAry.push(Math.floor(Math.random() * 100));
    });
    console.log(this.dataset());

    setTimeout(() => {
      this.EffectRef?.destroy();
      if (this.EffectRef) {
        console.log('Dataset effect reference destroyed');
      }
    }, 0);
  }
}
