import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Notice, CreateNoticeRequest } from '../../models/notice.model';
import { NoticeService } from '../../services/notice.service';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { GeocodingService, GeocodeResult } from '../../services/geocoding.service';
import { of } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, switchMap, catchError } from 'rxjs/operators';

@Component({
  selector: 'notice-form',
  templateUrl: './notice-form.component.html',
  styleUrls: ['./notice-form.component.scss'],
  imports: [ReactiveFormsModule, CommonModule],
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
  locationInfo = '';

  isGeocoding = false;
  geocodeError = '';

  constructor(
    private fb: FormBuilder,
    private noticeService: NoticeService,
    private geocodingService: GeocodingService
  ) {
    this.noticeForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(200)]],
      content: ['', [Validators.required, Validators.maxLength(2000)]],
      author: ['', [Validators.required, Validators.maxLength(100)]],
      hasLocation: [true],
      locationInfo: [''],
      latitude: [''],
      longitude: [''],
    });
  }

  ngOnInit(): void {
    this.isEditing = !!this.notice && this.notice.id !== undefined && this.notice.id !== '';

    if (this.notice) {
      this.noticeForm.patchValue({
        title: this.notice.title,
        content: this.notice.content,
        author: this.notice.author,
        hasLocation: !!this.notice.location,
        latitude: this.notice.location?.latitude || '',
        longitude: this.notice.location?.longitude || '',
        locationInfo: this.notice.locationInfo || '',
      });
    } else {
      this.noticeForm.patchValue({
        author: this.currentUser,
      });
    }

    const locationInfoControl = this.noticeForm.get('locationInfo');
    locationInfoControl?.setValidators([Validators.required]);

    locationInfoControl?.valueChanges
      .pipe(
        debounceTime(600),
        distinctUntilChanged(),
        filter((v) => !!v && v.trim().length > 3),
        switchMap((value: string) => {
          this.locationInfo = value;
          if (!this.noticeForm.get('hasLocation')?.value) {
            return of(null);
          }
          this.isGeocoding = true;
          this.geocodeError = '';
          return this.geocodingService.geocode(value).pipe(
            catchError((err) => {
              console.error('Geocode error', err);
              this.geocodeError = 'Unable to resolve location';
              this.isGeocoding = false;
              return of(null);
            })
          );
        })
      )
      .subscribe((result: GeocodeResult | null) => {
        this.isGeocoding = false;
        if (result) {
          this.noticeForm.patchValue({
            latitude: result.latitude.toString(),
            longitude: result.longitude.toString(),
          });
        }
      });

    this.noticeForm.get('hasLocation')?.valueChanges.subscribe((hasLocation) => {});
    const latControl = this.noticeForm.get('latitude');
    const lngControl = this.noticeForm.get('longitude');
    const hasLocationControl = this.noticeForm.get('hasLocation');
    hasLocationControl?.setValue(true); // it will always be true only for pilot target

    if (hasLocationControl?.value) {
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
  }

  async onSubmit(): Promise<void> {
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
    if (formValue.hasLocation) {
      if (formValue.latitude && formValue.longitude) {
        noticeRequest.location = {
          latitude: parseFloat(formValue.latitude),
          longitude: parseFloat(formValue.longitude),
        };
      }
      if (formValue.locationInfo) {
        noticeRequest.locationInfo = formValue.locationInfo;
      }
    }

    const operation = this.isEditing
      ? await this.noticeService.updateNotice(this.notice!.id, noticeRequest)
      : await this.noticeService.addNotice(noticeRequest);

    this.formSubmit.emit();
    this.isSubmitting = false;
  }

  onCancel(): void {
    this.formCancel.emit();
  }

  // Removed manual locationInfoChanged handler; reactive pipeline handles updates

  getFieldError(fieldName: string): string {
    const field = this.noticeForm.get(fieldName);
    if (field?.errors && field?.touched) {
      if (field.errors['required']) {
        return 'field required';
      }
      if (field.errors['maxlength']) {
        return `maximum ${field.errors['maxlength'].requiredLength} characters`;
      }
      if (field.errors['min'] || field.errors['max']) {
        return 'invalid value';
      }
    }
    return '';
  }
}
