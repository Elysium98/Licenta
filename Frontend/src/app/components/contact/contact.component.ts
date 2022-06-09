import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Email } from 'src/app/models/email';
import { EmailService } from 'src/app/services/email.service';
import { CommonService } from 'src/app/shared/common.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
})
export class ContactComponent implements OnInit {
  contactFormGroup: FormGroup;
  image2: string =
    '../../../assets/img/Contact us-rafiki copy_VERSIUNE_NOUA.png';
  image2$: Promise<any>;
  constructor(
    private fb: FormBuilder,
    private emailService: EmailService,
    private commonService: CommonService
  ) {
    this.image2$ = this.commonService.loadImage(this.image2);
  }

  ngOnInit() {
    this.contactFormGroup = this.fb.group({
      emailTo: ['', [Validators.email, Validators.required]],
      message: ['', Validators.required],
    });
  }

  onSubmit() {
    let model: Email = {
      emailTo: 'justst4r699@gmail.com',
      subject: this.contactFormGroup.value.emailTo,
      body: this.contactFormGroup.value.message,
    };

    this.emailService.sendEmail$(model).subscribe((data) => {
      console.log(data),
        this.commonService.showSnackBarMessage(
          'Mesaj trimis cu succes !',
          'right',
          'bottom',
          3000,
          'notif-success'
        );
    });
  }

  hasError(controlName: string, errorName: string) {
    return this.contactFormGroup.controls[controlName].hasError(errorName);
  }
}
