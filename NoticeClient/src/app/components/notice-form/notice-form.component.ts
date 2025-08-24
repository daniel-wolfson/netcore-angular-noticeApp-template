import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Notice, CreateNoticeRequest } from '../../models/notice.model';
import { NoticeService } from '../../services/notice.service';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'notice-form',
  templateUrl: './notice-form.component.html',
  styleUrls: ['./notice-form.component.scss'],
  imports: [ReactiveFormsModule],
  standalone: true,
})
export class NoticeFormComponent implements OnInit {
  @Input() notice: Notice | null = null;
  @Input() currentUser: string = '';
  @Output() formSubmit = new EventEmitter<void>();
  @Output() formCancel = new EventEmitter<void>();

  noticeForm: FormGroup;
  isEditing = false;
  isSubmitting = false;
  error = '';

  constructor(private fb: FormBuilder, private noticeService: NoticeService) {
    this.noticeForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(200)]],
      content: ['', [Validators.required, Validators.maxLength(2000)]],
      author: ['', [Validators.required, Validators.maxLength(100)]],
      hasLocation: [false],
      latitude: [''],
      longitude: [''],
    });
  }

  ngOnInit(): void {
    this.isEditing = !!this.notice;

    if (this.notice) {
      this.noticeForm.patchValue({
        title: this.notice.title,
        content: this.notice.content,
        author: this.notice.author,
        hasLocation: !!this.notice.location,
        latitude: this.notice.location?.latitude || '',
        longitude: this.notice.location?.longitude || '',
      });
    } else {
      this.noticeForm.patchValue({
        author: this.currentUser,
      });
    }

    // Watch for location checkbox changes
    this.noticeForm.get('hasLocation')?.valueChanges.subscribe((hasLocation) => {
      const latControl = this.noticeForm.get('latitude');
      const lngControl = this.noticeForm.get('longitude');

      if (hasLocation) {
        latControl?.setValidators([Validators.required, Validators.min(-90), Validators.max(90)]);
        lngControl?.setValidators([Validators.required, Validators.min(-180), Validators.max(180)]);
      } else {
        latControl?.clearValidators();
        lngControl?.clearValidators();
        latControl?.setValue('');
        lngControl?.setValue('');
      }

      latControl?.updateValueAndValidity();
      lngControl?.updateValueAndValidity();
    });
  }

  onSubmit(): void {
    if (this.noticeForm.invalid || this.isSubmitting) {
      return;
    }

    this.isSubmitting = true;
    this.error = '';

    const formValue = this.noticeForm.value;
    const noticeRequest: CreateNoticeRequest = {
      title: formValue.title.trim(),
      content: formValue.content.trim(),
      author: formValue.author.trim(),
    };

    // Add location if specified
    if (formValue.hasLocation && formValue.latitude && formValue.longitude) {
      noticeRequest.location = {
        latitude: parseFloat(formValue.latitude),
        longitude: parseFloat(formValue.longitude),
      };
    }

    const operation = this.isEditing
      ? this.noticeService.updateNotice(this.notice!.id, noticeRequest)
      : this.noticeService.addNotice(noticeRequest);

    operation.subscribe({
      next: () => {
        this.formSubmit.emit();
        this.isSubmitting = false;
      },
      error: (error) => {
        this.error = this.isEditing ? 'שגיאה בעדכון המודעה' : 'שגיאה ביצירת המודעה';
        this.isSubmitting = false;
        console.error('Form submission error:', error);
      },
    });
  }

  onCancel(): void {
    this.formCancel.emit();
  }

  getFieldError(fieldName: string): string {
    const field = this.noticeForm.get(fieldName);
    if (field?.errors && field?.touched) {
      if (field.errors['required']) {
        return 'שדה חובה';
      }
      if (field.errors['maxlength']) {
        return `מקסימום ${field.errors['maxlength'].requiredLength} תווים`;
      }
      if (field.errors['min'] || field.errors['max']) {
        return 'ערך לא חוקי';
      }
    }
    return '';
  }
}
