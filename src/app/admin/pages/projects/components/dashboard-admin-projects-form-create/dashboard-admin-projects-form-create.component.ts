import {Component, inject, OnInit} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {IftaLabel} from 'primeng/iftalabel';
import {InputText} from 'primeng/inputtext';
import {MultiSelect} from 'primeng/multiselect';
import {Button} from 'primeng/button';
import {HttpClient} from '@angular/common/http';
import {NgForOf, NgIf} from '@angular/common';
import {FloatLabel} from 'primeng/floatlabel';
import {FileSelectEvent, FileUpload} from 'primeng/fileupload';
import {Textarea} from 'primeng/textarea';
import {Observable} from 'rxjs';

type tags ={
  name: string,
}

interface UrlItem {
  type: string;
  link: string;
}

@Component({
  selector: 'app-dashboard-admin-projects-form-create',
  imports: [
    IftaLabel,
    InputText,
    ReactiveFormsModule,
    MultiSelect,
    Button,
    NgForOf,
    FloatLabel,
    FileUpload,
    Textarea,
    NgIf
  ],
  templateUrl: './dashboard-admin-projects-form-create.component.html',
})
export class DashboardAdminProjectsFormCreateComponent implements OnInit {
  formGroup!: FormGroup;
  http = inject(HttpClient);
  allUrlValidate: UrlItem[] = [];
  allPictures : File[] = [];
  previewUrls: string[] = [];

  tags: tags[] = [
    {name: 'E-commerce'},
    {name: 'Site vitrine'},
    {name: 'Application web'},
    {name: 'back Office'},
    {name: 'Wordpress'},
  ]

  typeURl: tags[] = [
    {name: 'Linkdin'},
    {name: 'Github'},
    {name: 'Gitlab'},
    {name: 'Google'},
    {name: 'Youtube'},
    {name: 'BitBucket'},
  ]

  ngOnInit() {
    this.formGroup = new FormGroup({
      title: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
      link: new FormControl('', [Validators.required]),
      tags: new FormControl('', [Validators.required]),
      typeUrl : new FormControl([], [Validators.required]),
    })
  }

  onSubmit() {
    const formData = new FormData();

    formData.append('title', this.formGroup.get('title')?.value);
    formData.append('description', this.formGroup.get('description')?.value);
    formData.append('link', JSON.stringify(this.allUrlValidate));
    formData.append('tags', JSON.stringify(this.normalizeTags(this.formGroup.get('tags')?.value)));

    // Ajout des fichiers images
    if (this.allPictures && this.allPictures.length > 0) {
      for (let i = 0; i < this.allPictures.length; i++) {
        formData.append('pictures[]', this.allPictures[i]);
      }
    }

    // Envoi au backend
    this.http.post<any>(`http://localhost:8000/api/project`, formData).subscribe({
      next:(resp) => {
        console.log(resp);
      },
      error:(err)  => {
        console.log(err)
      }
    });
  }

  addUrl() {
    const selectedTag = this.formGroup.get('typeUrl')?.value;
    const link = this.formGroup.get('link')?.value;

    if (selectedTag && link) {
      if (selectedTag.name) {
        this.allUrlValidate.push({
          type: selectedTag.name,
          link: link
        });
      }
      else if (Array.isArray(selectedTag)) {
        selectedTag.forEach(tag => {
          this.allUrlValidate.push({
            type: tag.name,
            link: link
          });
        });
      }

      this.formGroup.get('link')?.reset();
    }
  }

  normalizeTags(tags: tags[]): string[] {
    return tags.map(item => {
      return item.name
    });
  }

  handleSelect($event: FileSelectEvent) {
    if ($event.files && $event.files[0]) {
      this.allPictures.push($event.files[0]);
      this.generatePreview($event.files[0]);
    }
  }

  generatePreview(file: File) {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.previewUrls.push(e.target.result);
    };
    reader.readAsDataURL(file);
  }

}
