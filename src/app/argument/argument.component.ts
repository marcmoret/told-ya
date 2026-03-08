import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { trigger, transition, style, animate, group, query } from '@angular/animations';
import { Argument } from '../models/argument.model';
import { ArgumentService } from '../../api/argument.service';
import { QuillEditorComponent } from 'ngx-quill';
import { CommonModule } from '@angular/common';

const slideLeft = [
  query(':enter, :leave', style({ position: 'absolute', width: '100%' }), { optional: true }),
  group([
    query(':enter', [
      style({ transform: 'translateX(80px)', opacity: 0 }),
      animate('400ms cubic-bezier(0.22, 1, 0.36, 1)', style({ transform: 'translateX(0)', opacity: 1 })),
    ], { optional: true }),
    query(':leave', [
      animate('300ms cubic-bezier(0.22, 1, 0.36, 1)', style({ transform: 'translateX(-80px)', opacity: 0 })),
    ], { optional: true }),
  ]),
];

const slideRight = [
  query(':enter, :leave', style({ position: 'absolute', width: '100%' }), { optional: true }),
  group([
    query(':enter', [
      style({ transform: 'translateX(-80px)', opacity: 0 }),
      animate('400ms cubic-bezier(0.22, 1, 0.36, 1)', style({ transform: 'translateX(0)', opacity: 1 })),
    ], { optional: true }),
    query(':leave', [
      animate('300ms cubic-bezier(0.22, 1, 0.36, 1)', style({ transform: 'translateX(80px)', opacity: 0 })),
    ], { optional: true }),
  ]),
];

@Component({
  selector: 'app-argument',
  templateUrl: './argument.component.html',
  styleUrl: './argument.component.scss',
  imports: [CommonModule, QuillEditorComponent, ReactiveFormsModule],
  animations: [
    trigger('stepAnimation', [
      transition(':increment', slideLeft),
      transition(':decrement', slideRight),
    ]),
  ],
})
export class ArgumentComponent {
  link: string;
  personForm: FormGroup;
  topicForm: FormGroup;
  argumentForm: FormGroup;
  contactsForm: FormGroup;
  topic: string;
  personA: string;
  personB: string;
  argumentA: string;
  argumentB: string;

  currentStep = 0;
  totalSteps = 5;

  steps = [
    { label: 'Topic', icon: '💬' },
    { label: 'Names', icon: '👥' },
    { label: 'Side A', icon: '🔵' },
    { label: 'Side B', icon: '🔴' },
    { label: 'Invite', icon: '📲' },
  ];

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly argumentService: ArgumentService,
    private route: Router
  ) {
    this.personForm = this.formBuilder.group({
      personA: ['', [Validators.required]],
      personB: ['', [Validators.required]],
    });

    this.topicForm = this.formBuilder.group({
      topic: ['', [Validators.required]],
    });

    this.argumentForm = this.formBuilder.group({
      argumentA: [''],
      argumentB: [''],
    });

    this.contactsForm = this.formBuilder.group({
      contacts: this.formBuilder.array([this.createContactControl()]),
    });
  }

  get contacts(): FormArray {
    return this.contactsForm.get('contacts') as FormArray;
  }

  get progressWidth(): number {
    return (this.currentStep / (this.totalSteps - 1)) * 100;
  }

  createContactControl(): FormControl {
    return new FormControl('', [
      Validators.required,
      Validators.maxLength(10),
      Validators.minLength(10),
      Validators.pattern(/^-?(0|[1-9]\d*)?$/),
    ]);
  }

  addPhone() {
    this.contacts.push(this.createContactControl());
  }

  deletePhone(index: number) {
    this.contacts.removeAt(index);
  }

  onTopicChange(quill: any) {
    this.topic = quill.text;
  }

  onArgueA(quill: any) {
    this.argumentA = quill.text;
  }

  onArgueB(quill: any) {
    this.argumentB = quill.text;
  }

  nextStep() {
    if (this.currentStep < this.totalSteps - 1) {
      this.currentStep++;
    }
  }

  prevStep() {
    if (this.currentStep > 0) {
      this.currentStep--;
    }
  }

  goToStep(step: number) {
    if (step <= this.currentStep) {
      this.currentStep = step;
    }
  }

  isStepComplete(step: number): boolean {
    switch (step) {
      case 0: return this.topicForm.valid;
      case 1: return this.personForm.valid;
      case 2: return !!this.argumentForm.get('argumentA')?.value;
      case 3: return !!this.argumentForm.get('argumentB')?.value;
      case 4: return this.contactsForm.valid;
      default: return false;
    }
  }

  submit() {
    if (
      this.contactsForm.valid &&
      this.personForm.valid &&
      this.argumentForm.valid &&
      this.topicForm.valid
    ) {
      const numbers: string[] = this.contacts.value;
      const personA = this.personForm.get('personA').value;
      const personB = this.personForm.get('personB').value;

      const topic = this.topicForm
        .get('topic')
        .value.replace('<p>', '')
        .replace('</p>', '');

      const argumentA = this.argumentForm
        .get('argumentA')
        .value.replace('<p>', '')
        .replace('</p>', '');

      const argumentB = this.argumentForm
        .get('argumentB')
        .value.replace('<p>', '')
        .replace('</p>', '');

      const message = `
      Hey!
${personA} and ${personB} need you to settle an argument. Click the link below and vote who you think is right!
{{link}}`;

      const argument: Argument = {
        topic: topic,
        personA: personA,
        argumentA: argumentA,
        votesA: 0,
        personB: personB,
        argumentB: argumentB,
        votesB: 0,
        numbers: numbers,
        message: message,
        voter0: true,
        createdDate: new Date(),
      };

      numbers.forEach((number, i) => {
        argument[`voter${i + 1}`] = false;
      });

      this.argumentService.submitArgument(argument).then((id) => {
        this.route.navigateByUrl(`/argument/${id}0`);
      });
    }
  }
}
