import {
  AbstractControl,
  FormArray,
  FormControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';

import { ArgumentService } from '../../api/argument.service';
import { ArgumentDraft, getVoterKey } from '../shared/models/argument';

const MAX_CONTACTS = 8;

const phoneNumberValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  const digits = extractDigits(`${control.value ?? ''}`);
  const isValidNorthAmericanNumber =
    digits.length === 10 || (digits.length === 11 && digits.startsWith('1'));

  return isValidNorthAmericanNumber ? null : { phoneNumber: true };
};

const duplicatePhoneNumbersValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  const values = Array.isArray(control.value) ? control.value : [];
  const normalized = values
    .map((value) => normalizePhoneNumber(`${value ?? ''}`))
    .filter((value) => value.startsWith('+'));

  return normalized.length === new Set(normalized).size
    ? null
    : { duplicatePhoneNumbers: true };
};

function extractDigits(value: string): string {
  return value.replace(/\D/g, '');
}

function normalizePhoneNumber(value: string): string {
  const digits = extractDigits(value);

  if (digits.length === 10) {
    return `+1${digits}`;
  }

  if (digits.length === 11 && digits.startsWith('1')) {
    return `+${digits}`;
  }

  return value.trim();
}

function sanitizeSingleLine(value: string): string {
  return value.replace(/\s+/g, ' ').trim();
}

function sanitizeParagraphs(value: string): string {
  return value.replace(/\r\n/g, '\n').trim().replace(/\n{3,}/g, '\n\n');
}

function buildShareMessageTemplate(
  personA: string,
  personB: string,
  topic: string
): string {
  return `Hey! ${personA} and ${personB} need help settling a disagreement about "${topic}". Vote here: {{link}}`;
}

@Component({
  selector: 'app-argument',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './argument.component.html',
  styleUrl: './argument.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArgumentComponent {
  private readonly formBuilder = inject(FormBuilder).nonNullable;
  private readonly argumentService = inject(ArgumentService);
  private readonly router = inject(Router);

  protected readonly submitting = signal(false);
  protected submitError = '';

  protected readonly form = this.formBuilder.group({
    topic: ['', [Validators.required, Validators.maxLength(120)]],
    personA: ['', [Validators.required, Validators.maxLength(40)]],
    personB: ['', [Validators.required, Validators.maxLength(40)]],
    argumentA: ['', [Validators.required, Validators.maxLength(600)]],
    argumentB: ['', [Validators.required, Validators.maxLength(600)]],
    contacts: this.formBuilder.array([this.createContactControl()], {
      validators: duplicatePhoneNumbersValidator,
    }),
  });

  protected get contacts(): FormArray<FormControl<string>> {
    return this.form.controls.contacts;
  }

  protected get previewMessage(): string {
    const rawValue = this.form.getRawValue();
    const personA = sanitizeSingleLine(rawValue.personA) || 'Alex';
    const personB = sanitizeSingleLine(rawValue.personB) || 'Jordan';
    const topic = sanitizeSingleLine(rawValue.topic) || 'who made the better call';

    return buildShareMessageTemplate(personA, personB, topic).replace(
      '{{link}}',
      'https://toldya.ca/argument/example/1'
    );
  }

  protected addContact(): void {
    if (this.contacts.length >= MAX_CONTACTS) {
      return;
    }

    this.contacts.push(this.createContactControl());
  }

  protected removeContact(index: number): void {
    if (this.contacts.length === 1) {
      return;
    }

    this.contacts.removeAt(index);
    this.contacts.markAsTouched();
    this.contacts.updateValueAndValidity();
  }

  protected async submit(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitError = '';
    this.submitting.set(true);

    try {
      const rawValue = this.form.getRawValue();
      const personA = sanitizeSingleLine(rawValue.personA);
      const personB = sanitizeSingleLine(rawValue.personB);
      const topic = sanitizeSingleLine(rawValue.topic);
      const argumentA = sanitizeParagraphs(rawValue.argumentA);
      const argumentB = sanitizeParagraphs(rawValue.argumentB);
      const numbers = rawValue.contacts.map(normalizePhoneNumber);

      const argument: ArgumentDraft = {
        topic,
        personA,
        personB,
        argumentA,
        argumentB,
        votesA: 0,
        votesB: 0,
        numbers,
        shareMessageTemplate: buildShareMessageTemplate(personA, personB, topic),
        createdDate: new Date(),
      };

      argument[getVoterKey('0')] = true;
      numbers.forEach((_, index) => {
        argument[getVoterKey(String(index + 1))] = false;
      });

      const argumentId = await this.argumentService.submitArgument(argument);
      await this.router.navigate(['/argument', argumentId, '0']);
    } catch {
      this.submitError = 'Could not create the vote right now. Try again in a moment.';
    } finally {
      this.submitting.set(false);
    }
  }

  private createContactControl(): FormControl<string> {
    return this.formBuilder.control('', [Validators.required, phoneNumberValidator]);
  }
}
