import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Auth } from '../auth/auth';
import {
  ReactiveFormsModule,
  FormBuilder,
  Validators,
  FormGroup,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  reminders: any[] = [];
  form: FormGroup;
  editingIndex: number | null = null;
  showForm = false;
  showConfirmDelete = false;
  deleteIndex: number | null = null;
  filterDate: string = '';
  filterType: string = '';
  reminderTypes: string[] = ['Work', 'Personal', 'Other'];

  get filteredReminders() {
    return this.reminders.filter(reminder => {
      const matchesDate = this.filterDate ? reminder.datetime.startsWith(this.filterDate) : true;
      const matchesType = this.filterType ? reminder.type === this.filterType : true;
      return matchesDate && matchesType;
    });
  }

  constructor(
    private auth: Auth,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      title: ['', Validators.required],
      datetime: ['', Validators.required],
      type: ['', Validators.required],
      notes: [''],
    });
    this.loadReminders();
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }

  loadReminders() {
    const data = localStorage.getItem('reminders');
    this.reminders = data ? JSON.parse(data) : [];
  }

  saveReminders() {
    localStorage.setItem('reminders', JSON.stringify(this.reminders));
  }

  openForm(editIndex: number | null = null) {
    this.showForm = true;
    this.editingIndex = editIndex;
    if (editIndex !== null) {
      const reminder = this.reminders[editIndex];
      this.form.setValue({
        title: reminder.title,
        datetime: reminder.datetime,
        type: reminder.type || '',
        notes: reminder.notes || '',
      });
    } else {
      this.form.reset();
    }
  }

  closeForm() {
    this.showForm = false;
    this.editingIndex = null;
    this.form.reset();
  }

  onSubmit() {
    if (this.form.invalid) return;
    const value = this.form.value;
    if (this.editingIndex !== null) {
      this.reminders[this.editingIndex] = { ...value };
    } else {
      this.reminders.push({ ...value });
    }
    this.saveReminders();
    this.closeForm();
  }

  editReminder(index: number) {
    this.openForm(index);
  }

  confirmDelete(index: number) {
    this.showConfirmDelete = true;
    this.deleteIndex = index;
  }

  deleteReminder() {
    if (this.deleteIndex !== null) {
      this.reminders.splice(this.deleteIndex, 1);
      this.saveReminders();
      this.showConfirmDelete = false;
      this.deleteIndex = null;
    }
  }

  cancelDelete() {
    this.showConfirmDelete = false;
    this.deleteIndex = null;
  }
}
