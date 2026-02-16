import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { ModalController, IonicModule } from '@ionic/angular';
import { Candidate } from 'src/app/services/pre-onboarding.service';
import { AttendanceService } from 'src/app/services/attendance.service';

@Component({
  selector: 'app-employee-profile-modal',
  templateUrl: './employee-profile-modal.component.html',
  styleUrls: ['./employee-profile-modal.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule],
})
export class EmployeeProfileModalComponent implements OnInit {
  @Input() selectedEmployee: any;
  selectedObeject: any;
  attendanceStatus: 'in' | 'out' | '' = '';

  constructor(private modalCtrl: ModalController, private attendanceService: AttendanceService) { }

  ngOnInit() {
    // If the API response is { employee: {...}, ... }, use employee object for details
    this.selectedObeject = this.selectedEmployee?.employee || this.selectedEmployee;
    // Try to get attendance status if employee_id is available
    if (this.selectedObeject && (this.selectedObeject.employee_id || this.selectedObeject.id)) {
      const empId = this.selectedObeject.employee_id || this.selectedObeject.id;
      this.attendanceService.checkLoginOrLoggedOut(empId).subscribe({
        next: (res: any) => {
          console.log('Attendance status response for employee', empId, res);
          this.attendanceStatus = res?.status === 'in' ? 'in' : 'out';
        },
        error: () => {
          this.attendanceStatus = '';
        }
      });
    } else {
      this.attendanceStatus = this.selectedObeject?.active_status || '';
    }
    console.log('Employee data in profile modal:', this.selectedObeject);
  }


  // 🛠️ Function to extract initials from the full name


  getInitials(fullName: string): string {
    if (!fullName) {
      return '??';
    }

    // Split the name by spaces and filter out empty strings
    const nameParts = fullName.trim().split(/\s+/).filter(part => part.length > 0);

    if (nameParts.length === 0) {
      return '??';
    }

    let initials = '';

    if (nameParts.length === 1) {
      // Use the first two letters if only one word is provided
      initials = nameParts[0].substring(0, 2);
    } else {
      // Use the first letter of the first and last word
      const firstInitial = nameParts[0].charAt(0);
      const lastInitial = nameParts[nameParts.length - 1].charAt(0);
      initials = firstInitial + lastInitial;
    }

    return initials.toUpperCase();
  }

  // 🎨 Optional: Function to generate a dynamic background color
  getAvatarColor(name: string): string {
    // Implement a simple hash function here to return a color based on the name
    // For now, return a fixed color or implement logic like below:
    const colors = ['#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5', '#2196f3', '#00bcd4', '#009688'];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % colors.length;
    return colors[index];
  }





  close() {
    this.modalCtrl.dismiss();
  }

}
