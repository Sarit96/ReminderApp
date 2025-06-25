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

  // Popup state for upcoming reminders
  upcomingPopup: { show: boolean; reminder: any } = { show: false, reminder: null };
  shownPopupIds: Set<string> = new Set();
  intervalId: any;

  get filteredReminders() {
    return this.reminders.filter(reminder => {
      const matchesDate = this.filterDate ? reminder.datetime.startsWith(this.filterDate) : true;
      const matchesType = this.filterType ? reminder.type === this.filterType : true;
      return matchesDate && matchesType;
    });
  }

  get upcomingReminders() {
    const now = new Date();
    const twoDaysLater = new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000);
    return this.reminders.filter(reminder => {
      if (!reminder.datetime) return false;
      const reminderTime = new Date(reminder.datetime);
      return reminderTime > now && reminderTime <= twoDaysLater;
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
      invite: [''],
    });
    this.loadReminders();
    this.startUpcomingReminderCheck();
  }

  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  startUpcomingReminderCheck() {
    this.intervalId = setInterval(() => {
      const now = new Date();
      for (const reminder of this.reminders) {
        if (!reminder.datetime) continue;
        const reminderTime = new Date(reminder.datetime);
        const diff = (reminderTime.getTime() - now.getTime()) / 60000; // minutes
        // Use title+datetime as a unique id for session
        const popupId = reminder.title + reminder.datetime;
        if (diff > 0 && diff <= 5 && !this.shownPopupIds.has(popupId)) {
          this.upcomingPopup = { show: true, reminder };
          this.shownPopupIds.add(popupId);
          break;
        }
      }
    }, 60000); // check every minute
  }

  closeUpcomingPopup() {
    this.upcomingPopup = { show: false, reminder: null };
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
        invite: reminder.invite || '',
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
