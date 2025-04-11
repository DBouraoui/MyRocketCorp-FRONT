import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {Button} from "primeng/button";
import {IftaLabel} from "primeng/iftalabel";
import {InputText} from "primeng/inputtext";
import {Password} from "primeng/password";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {SelectButton} from "primeng/selectbutton";
import {User} from '../../../../../types/User';
import {Subscription} from 'rxjs';
import {MessageService} from 'primeng/api';
import {HttpClient} from '@angular/common/http';
import {ActivatedRoute} from '@angular/router';
import {DashboardService} from '../../../../../services/dashboard.service';

@Component({
  selector: 'app-create-user-form',
    imports: [
        Button,
        IftaLabel,
        InputText,
        Password,
        ReactiveFormsModule,
        SelectButton
    ],
  templateUrl: './create-user-form.component.html',
})
export class CreateUserFormComponent implements OnInit, OnDestroy {
  adminUsersService = inject(DashboardService);
  formGroup!:FormGroup;
  isLoading = false;
  formSending! : Subscription;
  userOptions = [
    {
      label: 'Particulier',
      value: false,
    },
    {
      label: 'Professionnel',
      value: true,
    }
  ];


  constructor(private messageService:MessageService,
              private http : HttpClient,
              private activatedRoute: ActivatedRoute
  ) {
  }

  ngOnInit(): void {
    this.formGroup = new FormGroup({
      firstname: new FormControl(''),
      lastname: new FormControl(''),
      companyName: new FormControl(''),
      email: new FormControl('',[Validators.required]),
      phone: new FormControl('',[Validators.required]),
      address: new FormControl('',[Validators.required]),
      postCode: new FormControl('',[Validators.required]),
      city: new FormControl('',[Validators.required]),
      country: new FormControl('', [Validators.required]),
      password: new FormControl('',[Validators.required]),
      isCompany: new FormControl(false, [Validators.required]),
    });

    this.formGroup.get('isCompany')?.valueChanges.subscribe(isCompany => {
      if (isCompany) {
        this.formGroup.get('companyName')?.setValidators([Validators.required]);

        this.formGroup.get('firstname')?.clearValidators();
        this.formGroup.get('firstname')?.reset();
        this.formGroup.get('lastname')?.clearValidators();
        this.formGroup.get('lastname')?.reset();

      } else {
        this.formGroup.get('firstname')?.setValidators([Validators.required]);
        this.formGroup.get('lastname')?.setValidators([Validators.required]);

        this.formGroup.get('companyName')?.clearValidators();
        this.formGroup.get('companyName')?.reset();
      }
    })
  }

  onSubmite() {
    this.isLoading = true;
    if (this.formGroup.invalid) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Erreur dans le formulair',
        detail: 'Impossible d\'envoyer le formulaire imcomplet ou incorrect',
      });
      this.isLoading = false;
      return
    }

    const payload = {
      firstname: this.formGroup.get('firstname')?.value,
      lastname: this.formGroup.get('lastname')?.value,
      companyName: this.formGroup.get('companyName')?.value,
      email: this.formGroup.get('email')?.value,
      phone: this.formGroup.get('phone')?.value,
      address: this.formGroup.get('address')?.value,
      postCode: this.formGroup.get('postCode')?.value,
      city: this.formGroup.get('city')?.value,
      country: this.formGroup.get('country')?.value,
      password: this.formGroup.get('password')?.value,
    }

    this.http.post('http://localhost:8000/api/user/register', payload).subscribe({
      next: (resp)=>{
        this.messageService.add({
          severity: 'success',
          summary: 'Utilisateur créer',
        });
        this.isLoading = false;
        this.adminUsersService.refreshUsers().subscribe();
      },
      error: (err)=>{
        this.messageService.add({
          severity: 'error',
          summary: 'Erreur utilisateur non créer',
        });
        this.isLoading = false;
        console.log(err)
      }
    })
  }

  ngOnDestroy(): void {
    if (this.formSending) {
      this.formSending.unsubscribe();
      this.formGroup.reset();
    }
  }
}
