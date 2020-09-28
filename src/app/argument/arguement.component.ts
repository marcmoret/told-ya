import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormArray,
  FormControl,
} from '@angular/forms';

@Component({
  selector: 'app-arguement',
  templateUrl: './argument.component.html',
  styleUrls: ['./argument.component.scss'],
})
export class ArgumentComponent implements OnInit {
  personForm: FormGroup;
  topicForm: FormGroup;
  argumentForm: FormGroup;
  contactsForm: FormGroup;
  contactArray = [{}];
  Object = Object;

  constructor(private readonly formBuilder: FormBuilder) {
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
      contact0: ['', Validators.required, Validators.email],
    });
  }

  addEmail(index: number) {
    console.log(index);

    this.contactsForm.addControl(`contact${index}`, new FormControl(''));
    this.contactsForm.controls[`contact${index}`].setValidators([
      Validators.email,
      Validators.maxLength(30),
      Validators.required,
    ]);
    this.contactsForm.controls[`contact${index}`].updateValueAndValidity();
    console.log(this.contactsForm);
  }

  ngOnInit(): void {}

  deleteEmail(index: number) {
    console.log(`contact${index}`);

    this.contactsForm.removeControl(`contact${index}`);
  }

  onTopicChange(quill: any) {
    console.log(quill.text);
  }

  submit() {}
}
