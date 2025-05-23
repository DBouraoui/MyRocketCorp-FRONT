import { ResolveFn } from '@angular/router';
import { inject } from '@angular/core';
import { AdminContactsService } from '../../services/admin/admin-contacts.service';
import { Observable, tap } from 'rxjs';
import { ContactsResponse } from '../../types/Contact';

export const dashboardAdminContactResolver: ResolveFn<Observable<ContactsResponse>> = () => {
  const contactService = inject(AdminContactsService);

  return contactService.fetchContacts().pipe(
    tap(response => {
      contactService.contacts.set(response.data);
    })
  );
};
