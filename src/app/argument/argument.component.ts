import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Argument } from 'model/arguement.model';
import { ArgumentService } from 'src/api/argument.service';

export class MyTel {
  constructor(
    public area: string,
    public exchange: string,
    public subscriber: string
  ) {}
}

@Component({
  selector: 'app-arguement',
  templateUrl: './argument.component.html',
  styleUrls: ['./argument.component.scss'],
})
export class ArgumentComponent implements OnInit {
  link: string;
  personForm: FormGroup;
  topicForm: FormGroup;
  argumentForm: FormGroup;
  contactsForm: FormGroup;
  topic: string;
  personA: string;
  personB: string;
  arguementA: string;
  arguementB: string;

  Object = Object;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly arguementService: ArgumentService,
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
      contact0: [
        '',
        [
          Validators.required,
          Validators.maxLength(10),
          Validators.minLength(10),
          Validators.pattern(/^-?(0|[1-9]\d*)?$/),
        ],
      ],
    });
  }

  ngOnInit(): void {}

  addPhone(index: number) {
    this.contactsForm.addControl(`contact${index}`, new FormControl(''));
    this.contactsForm.controls[`contact${index}`].setValidators([
      Validators.maxLength(10),
      Validators.minLength(10),
      Validators.required,
      Validators.pattern(/^-?(0|[1-9]\d*)?$/),
    ]);
    this.contactsForm.controls[`contact${index}`].updateValueAndValidity();
  }

  deletePhone(index: number) {
    this.contactsForm.removeControl(`contact${index}`);
  }

  onTopicChange(quill: any) {
    this.topic = quill.text;
  }

  onArgueA(quill: any) {
    this.arguementA = quill.text;
  }

  onArgueB(quill: any) {
    this.arguementB = quill.text;
  }

  submit() {
    if (
      this.contactsForm.valid &&
      this.personForm.valid &&
      this.argumentForm.valid &&
      this.topicForm.valid
    ) {
      const numbers: string[] = Object.values(this.contactsForm.value);
      const personA = this.personForm.get('personA').value;
      const personB = this.personForm.get('personB').value;

      // Quilljs sends the HTML tags so I had to remove the <p> tags.
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

      this.arguementService.submitArgument(argument).then((id) => {
        this.route.navigateByUrl(`/argument/${id}0`);
      });
    }
  }
}
