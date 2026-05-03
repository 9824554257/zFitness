import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AppService } from '../app-service';
import { SharedService } from '../shared-service';
import { LoaderService } from '../loader-service';

@Component({
  selector: 'app-member-list',
  imports: [CommonModule, RouterModule],
  templateUrl: './member-list.html',
  styleUrl: './member-list.css',
  standalone: true,
})
export class MemberList implements OnInit {
  @ViewChild('delModal') modal!: ElementRef<HTMLDialogElement>;
  selectedMemberToDelete: any = null;

  selectedMember: any;

  selectedFile: File | null = null;
  isUploading: boolean = false;

  constructor(
    private appService: AppService,
    public sharedService: SharedService,
    public router: Router,
    public loaderService: LoaderService,
  ) {}

  ngOnInit(): void {
    this.fetchMemberDetails();
  }

  openInvoiceModal(member: any) {
    this.selectedMember = member;
    const invoiceWindow = window.open('', '_blank', 'width=800,height=600');
    if (invoiceWindow) {
      invoiceWindow.document.write(this.generateInvoiceHTML());
      invoiceWindow.document.close();
    }
  }

  deleteMember(member: any) {
    this.selectedMemberToDelete = member;
    this.modal.nativeElement.showModal();
  }

  closeModal() {
    this.modal.nativeElement.close();
  }

  confirmDelete() {
    this.closeModal();
    if (this.selectedMemberToDelete) {
      this.deleteMemberCall(this.selectedMemberToDelete);
    }
  }

  generateInvoiceHTML(): string {
    const member = this.selectedMember;
    const total = this.calculateTotal(member);
    const invoiceDate = new Date().toLocaleDateString();
    const invoiceNumber = 'RCPT-' + Date.now();
    const baseUrl = window.location.origin;
    let paymentsHTML = '';
    if (member?.memberPackageDetails) {
      const donePackages = member.memberPackageDetails.filter((pkg: any) => pkg.status === 'DONE');
      donePackages.forEach((pkg: any, index: number) => {
        const totalPaid = pkg.paymentDetails ? pkg.paymentDetails.reduce((sum: number, payment: any) => sum + Number(payment.amount || 0), 0) : 0;
        paymentsHTML += `
        <tr>
          <td style="padding: 8px 5px;">${index + 1}</td>
          <td style="padding: 8px 5px;">${pkg.packageName}</td>
          <td style="padding: 8px 5px;">₹${totalPaid}</td>
        </tr>
        `;
      });
    }
    return `
      <html>
        <head>
          <title>Z Fitness Invoice</title>
          <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
          <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
          <style>
            * { margin: 0; padding: 0; }
            body { 
              font-family: 'Poppins', sans-serif; 
              font-size: 13px; 
              color: #333; 
              background: white; 
              padding: 10px; 
            }
            .invoice-container { 
              max-width: 8.5in;
              height: auto;
              margin: 0 auto; 
              background: white; 
              padding: 20px; 
              box-sizing: border-box;
              display: flex;
              flex-direction: column;
            }
            .header { 
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
              color: white; 
              padding: 12px 15px; 
              display: flex; 
              justify-content: space-between; 
              align-items: center; 
              margin-bottom: 15px;
              border-radius: 6px;
            }
            .logo { max-width: 80px; height: 80px; object-fit: contain; }
            .company-info { text-align: right; font-size: 11px; line-height: 1.3; }
            .company-info h4 { margin: 0; font-size: 16px; font-weight: 700; }
            .invoice-title { 
              text-align: center; 
              font-size: 22px; 
              font-weight: 700; 
              color: #667eea; 
              margin: 8px 0;
            }
            .invoice-details { 
              display: flex; 
              justify-content: space-between; 
              margin-bottom: 12px; 
              gap: 15px;
            }
            .bill-to, .invoice-info { flex: 1; }
            .bill-to h6, .invoice-info h6 { 
              margin-bottom: 6px; 
              color: #667eea; 
              font-weight: 600; 
              font-size: 12px;
              border-bottom: 1px solid #667eea; 
              padding-bottom: 2px; 
            }
            .bill-to p, .invoice-info p { margin: 3px 0; font-size: 12px; }
            .table { 
              margin: 10px 0; 
              font-size: 12px;
            }
            .table th { 
              background: #667eea; 
              color: white; 
              font-weight: 600; 
              font-size: 11px; 
              padding: 6px 5px !important;
              text-transform: uppercase;
              letter-spacing: 0.5px;
            }
            .table td { padding: 6px 5px !important; }
            .total-section { 
              text-align: right; 
              margin: 10px 0;
              padding: 8px 10px;
              background: #f8f9fa;
              border-radius: 4px;
              border-left: 3px solid #667eea;
            }
            .total-section p { 
              margin: 0; 
              font-size: 14px; 
              font-weight: 600; 
              color: #333; 
            }
            .address-section {
              text-align: center;
              margin: 15px 0;
              padding: 10px 0;
              border-top: 1px solid #ddd;
            }
            .address-section h6 {
              font-size: 12px;
              font-weight: 600;
              color: #667eea;
              margin-bottom: 8px;
            }
            .address-img { 
              max-width: 100%; 
              max-height: 150px;
              height: auto;
              border-radius: 4px;
            }
            .footer { 
              background: #667eea; 
              color: white; 
              text-align: center; 
              padding: 8px; 
              margin-top: 10px; 
              font-size: 11px;
              border-radius: 4px;
            }
            .print-btn { 
              display: block; 
              margin: 10px auto 0; 
              padding: 8px 20px; 
              background: #667eea; 
              color: white; 
              border: none; 
              border-radius: 20px; 
              font-size: 13px; 
              font-weight: 600; 
              cursor: pointer; 
            }
            .print-btn:hover { 
              background: #5a67d8; 
            }
            @media print {
              body { background: white; padding: 0; margin: 0; }
              .invoice-container { box-shadow: none; height: auto; padding: 0; margin: 0; }
              .print-btn { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="invoice-container">
            <div class="header">
              <img src="${baseUrl}/assets/images/ZFitnessLogo.png" alt="Z Fitness Logo" class="logo">
              <div class="company-info">
                <h4>Z Fitness Gym</h4>
                <p>123 Fitness Street | City, State 12345</p>
                <p>Phone: (123) 456-7890 | Email: info@zfitness.com</p>
              </div>
            </div>
            
            <div class="invoice-title">RECEIPT</div>
            
            <div class="invoice-details">
              <div class="bill-to">
                <h6>Bill To:</h6>
                <p><strong>${member?.fullName || ''}</strong></p>
                <p>ID: ${member?.memberNo || ''}</p>
                <p>${member?.email || ''}</p>
                <p>${member?.mobileNumber || ''}</p>
              </div>
              <div class="invoice-info">
                <h6>Invoice Details:</h6>
                <p><strong>#:</strong> ${invoiceNumber}</p>
                <p><strong>Date:</strong> ${invoiceDate}</p>
                <p><strong>Join:</strong> ${member?.joinDate ? new Date(member.joinDate).toLocaleDateString() : ''}</p>
              </div>
            </div>
            
            <table class="table table-bordered" style="margin-bottom: 5px;">
              <thead>
                <tr>
                  <th style="width: 10%;">S.No</th>
                  <th style="width: 60%;">Package</th>
                  <th style="width: 30%;">Total Paid</th>
                </tr>
              </thead>
              <tbody>
                ${paymentsHTML}
              </tbody>
            </table>
            
            <div class="total-section">
              <p>Total Amount: ₹${total}</p>
            </div>
            
            <div class="footer">
              <p>Thank you for choosing Z Fitness Gym! | Terms: Non-refundable | Contact: info@zfitness.com</p>
            </div>
          </div>
          
          <button class="print-btn" onclick="window.print()">🖨️ Print & Save PDF</button>
        </body>
      </html>
    `;
  }

  fetchMemberDetails() {
    this.loaderService.show.set(true);
    this.appService.getAllMemberDetails().subscribe(
      (data: any) => {
        if (!this.sharedService.checkIfValueIsEmpty(data)) {
          this.sharedService.memberDetails.set(data['data']);
          this.loaderService.show.set(false);
        }
      },
      (error: any) => {
        this.loaderService.show.set(false);
      },
    );
  }

  editMemberDetails(member: any) {
    this.router.navigate(['/newMember']);
    this.sharedService.savedMemberDataResponse.set(member);
  }

  deleteMemberCall(member : any) {
    this.loaderService.show.set(true);
    this.appService.deleteMemberDetails(member._id).subscribe((data : any) => {
      this.loaderService.show.set(false);
      // let deltedIndex : any = this.sharedService.memberDetails().findIndex((singleObj : any) => singleObj._id === member._id);
      // if(deltedIndex !== -1) {
        this.sharedService.memberDetails.set(
          this.sharedService.memberDetails().filter((item: any) => item._id !== member._id)
        );
        // this.cdr.detectChanges();
      // }
    }, (err : any) => {
      this.loaderService.show.set(false);
    })
  }

  calculateTotal(member: any): number {
    if (!member || !member.memberPackageDetails) return 0;
    return member.memberPackageDetails
      .filter((pkg: any) => pkg.status === 'DONE')
      .reduce((sum: number, pkg: any) => {
        if (pkg.paymentDetails) {
          return sum + pkg.paymentDetails.reduce((pkgSum: number, payment: any) => pkgSum + Number(payment.amount || 0), 0);
        }
        return sum;
      }, 0);
  }

  generatePDF() {
    window.print();
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  uploadMemberData() {
    if (!this.selectedFile) {
      this.sharedService.snackBar.open('Please select a file first.', 'Close', {
        duration: 3000,
        panelClass: ['snackbar-warning']
      });
      return;
    }

    this.isUploading = true;

    this.appService.uploadMemberData(this.selectedFile).subscribe(
      (response: any) => {
        this.isUploading = false;

        // Handle successful response
        if (response.successful !== undefined) {
          const { successful, failed, message } = response;

          if (failed === 0) {
            // Complete success
            this.sharedService.snackBar.open(`${message} - All members uploaded successfully!`, 'Close', {
              duration: 5000,
              panelClass: ['snackbar-success']
            });
          } else if (successful > 0) {
            // Partial success
            this.sharedService.snackBar.open(`${message} - ${successful} uploaded, ${failed} failed. Check console for details.`, 'Close', {
              duration: 7000,
              panelClass: ['snackbar-warning']
            });
            console.log('Upload Results:', response);
          } else {
            // Complete failure
            this.sharedService.snackBar.open(`${message} - No members were uploaded.`, 'Close', {
              duration: 5000,
              panelClass: ['snackbar-error']
            });
          }

          // Refresh the member list if at least one member was uploaded
          if (successful > 0) {
            this.fetchMemberDetails();
          }
        } else {
          // Fallback for unexpected success response
          this.sharedService.snackBar.open('Member data uploaded successfully!', 'Close', {
            duration: 5000,
            panelClass: ['snackbar-success']
          });
          this.fetchMemberDetails();
        }

        this.selectedFile = null;
        // Reset file input
        const fileInput = document.getElementById('excelFile') as HTMLInputElement;
        if (fileInput) {
          fileInput.value = '';
        }
      },
      (error: any) => {
        this.isUploading = false;

        // Handle different error types
        if (error.status === 401) {
          this.sharedService.snackBar.open('Authentication failed. Please log in again.', 'Close', {
            duration: 5000,
            panelClass: ['snackbar-error']
          });
        } else if (error.status === 400) {
          const errorData = error.error;

          if (errorData.message === 'File cannot be empty') {
            this.sharedService.snackBar.open('Please select a valid Excel file.', 'Close', {
              duration: 4000,
              panelClass: ['snackbar-error']
            });
          } else if (errorData.message === 'Excel file must contain exactly one sheet') {
            this.sharedService.snackBar.open('Excel file must contain exactly one worksheet.', 'Close', {
              duration: 5000,
              panelClass: ['snackbar-error']
            });
          } else if (errorData.message === 'Excel file contains no data') {
            this.sharedService.snackBar.open('Excel file contains no data rows.', 'Close', {
              duration: 4000,
              panelClass: ['snackbar-error']
            });
          } else if (errorData.message?.includes('Missing required columns')) {
            this.sharedService.snackBar.open(`Missing required columns: ${errorData.message.replace('Missing required columns: ', '')}`, 'Close', {
              duration: 7000,
              panelClass: ['snackbar-error']
            });
          } else if (errorData.message === 'Validation failed' && errorData.errors) {
            const totalErrors = errorData.errors.length;
            const firstError = errorData.errors[0];
            this.sharedService.snackBar.open(`Validation failed: ${totalErrors} row(s) have errors. Check console for details.`, 'Close', {
              duration: 8000,
              panelClass: ['snackbar-error']
            });
            console.log('Validation Errors:', errorData.errors);
          } else if (errorData.message === 'Duplicate member numbers found in database' && errorData.errors) {
            const totalDuplicates = errorData.errors.length;
            this.sharedService.snackBar.open(`Duplicate member numbers found: ${totalDuplicates} conflict(s). Check console for details.`, 'Close', {
              duration: 7000,
              panelClass: ['snackbar-error']
            });
            console.log('Duplicate Errors:', errorData.errors);
          } else {
            // Generic 400 error
            this.sharedService.snackBar.open(errorData.message || 'Invalid file format or data.', 'Close', {
              duration: 5000,
              panelClass: ['snackbar-error']
            });
          }
        } else if (error.status === 500) {
          this.sharedService.snackBar.open('Server error occurred. Please try again later.', 'Close', {
            duration: 5000,
            panelClass: ['snackbar-error']
          });
        } else {
          // Network or other errors
          this.sharedService.snackBar.open('Upload failed. Please check your connection and try again.', 'Close', {
            duration: 5000,
            panelClass: ['snackbar-error']
          });
        }

        console.error('Upload error:', error);
      }
    );
  }
}
