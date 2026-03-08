import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { Argument } from '../models/argument.model';
import { ArgumentService } from '../../api/argument.service';
import { QuillEditorComponent } from 'ngx-quill';
import { MatStepperModule } from '@angular/material/stepper';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-argument',
  templateUrl: './argument.component.html',
  styleUrl: './argument.component.scss',
  imports: [QuillEditorComponent, ReactiveFormsModule, MatCardModule, MatStepperModule, MatInputModule, MatButtonModule, MatIconModule],
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
