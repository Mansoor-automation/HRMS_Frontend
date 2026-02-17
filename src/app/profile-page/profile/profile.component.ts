import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { CandidateService, Employee } from '../../services/pre-onboarding.service';
import { EmployeeService } from '../../services/employee.service';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
  ]
})

export class ProfileComponent implements OnChanges {
  @Input() currentEmployee: any;

  currentCandidate$!: Observable<any>;
  currentEmployee$!: Observable<Employee | null>;
  Isedit: boolean = false;
  isAdress: boolean = false;
  IsDetails: boolean = false;
  constructor(private candidateService: CandidateService, private employeeService: EmployeeService) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['currentEmployee']?.currentValue) {
      console.log(
        '✅ AboutusComponent received employee:',
        this.currentEmployee
      );
    }
  }
  isEditDetails() {
    this.IsDetails = !this.IsDetails;
  }
  isEditForm() {
    this.Isedit = !this.Isedit;
  }
  isEditAddress() {
    this.isAdress = !this.isAdress;
  }

  onSubmitDetails() {
    if (!this.currentEmployee) return;
    const updatedData: any = {
      DateOfBirth: this.currentEmployee.DateOfBirth,
      // Add other fields as needed
    };
    this.employeeService.updateMyProfile(updatedData).subscribe({
      next: () => {
        // Optionally refresh employee data or show success message
        this.IsDetails = false;
      },
      error: (err: any) => {
        // Handle error
        console.error('Failed to update profile:', err);
      }
    });
  }
}
