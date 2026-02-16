import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { EmployeeProfileModalComponent } from '../employee-profile-modal/employee-profile-modal.component';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-employee-list-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, IonicModule],
  templateUrl: './employee-list-modal.component.html',
  styleUrls: ['./employee-list-modal.component.scss'],
})
export class EmployeeListModalComponent implements OnInit {

  /** ✅ DATA FROM HEADER */
  @Input() employees: any[] = [];

  employeeList: any[] = [];
  apiBaseUrl: string = '';

  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {
    this.employeeList = this.employees || [];

    this.apiBaseUrl = environment.apiURL.startsWith('http')
      ? environment.apiURL
      : `http://${environment.apiURL}`;

    console.log('✅ Employees received in modal:', this.employeeList);
  }

  /** ✅ PROFILE IMAGE HANDLER */
  getEmployeeImage(emp: any): string {

    if (emp?.profile_image) {
      return emp.profile_image.startsWith('http')
        ? emp.profile_image
        : `${this.apiBaseUrl}/${emp.profile_image}`;
    }

    if (emp?.image) {
      return emp.image.startsWith('http')
        ? emp.image
        : `${this.apiBaseUrl}/${emp.image}`;
    }

    // ✅ DEFAULT IMAGE
    return 'assets/icon/Default-user.svg';
  }

  /** OPEN EMPLOYEE PROFILE */
  async openEmployeeProfile(employee: any) {
    // Normalize employee object for modal
    const normalized = {
      full_name: employee.full_name || employee.FullName || employee.first_name + ' ' + (employee.last_name || ''),
      job_title: employee.job_title || employee.JobTitle || employee.designation || '',
      location: employee.location || employee.Location || '',
      work_email: employee.work_email || employee.workEmail || employee.email || '',
      business_unit: employee.business_unit || employee.BusinessUnit || '',
      department: employee.department || employee.Department || '',
      reporting_to: employee.reporting_to || employee.ReportingManager || employee.reporting_manager || '',
      active_status: employee.active_status || employee.status || '',
      profile_image: employee.profile_image || employee.image || '',
    };
    const modal = await this.modalCtrl.create({
      component: EmployeeProfileModalComponent,
      componentProps: { selectedEmployee: normalized },
      cssClass: 'profile-modal'
    });
    await modal.present();
  }

  close() {
    this.modalCtrl.dismiss();
  }
}
