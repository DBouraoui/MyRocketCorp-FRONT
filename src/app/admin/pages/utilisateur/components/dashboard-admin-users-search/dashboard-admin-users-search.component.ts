import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Button} from 'primeng/button';
import {InputText} from 'primeng/inputtext';
import {User} from '../../../../../types/User';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {Tag} from 'primeng/tag';
import {CommonModule} from '@angular/common';
import {Tooltip} from 'primeng/tooltip';
import {Drawer} from 'primeng/drawer';
import {FloatLabel} from 'primeng/floatlabel';
import {MessageService} from 'primeng/api';
import {HttpClient} from '@angular/common/http';
import {Subscription} from 'rxjs';
import {DashboardService} from '../../../../../services/dashboard.service';

@Component({
  selector: 'app-dashboard-admin-users-search',
  imports: [
    Button,
    InputText,
    FormsModule,
    Tag,
    CommonModule,
    Tooltip,
    Drawer,
    FloatLabel,
    ReactiveFormsModule
  ],
  templateUrl: './dashboard-admin-users-search.component.html',
})
export class DashboardAdminUsersSearchComponent implements OnInit, OnDestroy {
  @Input() users: User[] = [];
  searchInput = "";
  filteredUsers: User[] = [];
  visible :boolean = false;
  selectedUser!: User;
  formGroup!: FormGroup;
  isLoading:boolean = false;
  formSending!: Subscription;

  constructor(private messageService: MessageService, private http: HttpClient, private dashboardService : DashboardService) {
  }

  ngOnInit() {
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
    });
  }

  onSubmit() {
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
      uuid: this.selectedUser.uuid,
      firstname: this.formGroup.get('firstname')?.value,
      lastname: this.formGroup.get('lastname')?.value,
      companyName: this.formGroup.get('companyName')?.value,
      email: this.formGroup.get('email')?.value,
      phone: this.formGroup.get('phone')?.value,
      address: this.formGroup.get('address')?.value,
      postCode: this.formGroup.get('postCode')?.value,
      city: this.formGroup.get('city')?.value,
      country: this.formGroup.get('country')?.value,
    }

   this.formSending = this.http.put('http://localhost:8000/api/user', payload).subscribe({
      next: (resp)=>{
        this.messageService.add({
          severity: 'success',
          summary: 'Utilisateur modifier',
        });
        this.isLoading = false;
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

  openUserDetails(user: User) {
    this.visible = true;
    this.selectedUser = user;
    this.formGroup.get('firstname')?.setValue(user.firstname);
    this.formGroup.get('lastname')?.setValue(user.lastname);
    this.formGroup.get('companyName')?.setValue(user.companyName);
    this.formGroup.get('postCode')?.setValue(user.postCode);
    this.formGroup.get('email')?.setValue(user.email);
    this.formGroup.get('phone')?.setValue(user.phone);
    this.formGroup.get('address')?.setValue(user.address);
    this.formGroup.get('city')?.setValue(user.city);
    this.formGroup.get('country')?.setValue(user.country);
  }

  filterUsers() {
    if (this.searchInput != "") {
      this.filteredUsers = this.users.filter(user =>
        user.email.toLowerCase().includes(this.searchInput.toLowerCase()) ||
        (user.firstname?.toLowerCase().includes(this.searchInput.toLowerCase())) ||
        (user.lastname?.toLowerCase().includes(this.searchInput.toLowerCase()))
      );
    } else if (this.searchInput == "") {
      this.filteredUsers = [];
    }
  }

}
