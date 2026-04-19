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
    const invoiceNumber = 'INV-' + Date.now();
    const baseUrl = window.location.origin;
    let packagesHTML = '';
    if (member?.memberPackageDetails) {
      packagesHTML = member.memberPackageDetails.map((pkg: any, index: number) => `
        <tr>
          <td style="padding: 8px 5px;">${index + 1}</td>
          <td style="padding: 8px 5px;">${pkg.packageName}</td>
          <td style="padding: 8px 5px;">₹${pkg.fee}</td>
          <td style="padding: 8px 5px;">₹${pkg.discountedPrice}</td>
        </tr>
      `).join('');
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
            
            <div class="invoice-title">INVOICE</div>
            
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
                  <th style="width: 5%;">S.No</th>
                  <th style="width: 50%;">Package</th>
                  <th style="width: 22%;">Amount</th>
                  <th style="width: 23%;">Discounted</th>
                </tr>
              </thead>
              <tbody>
                ${packagesHTML}
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
    return member.memberPackageDetails.reduce((sum: number, pkg: any) => sum + (pkg.discountedPrice || pkg.fee), 0);
  }

  generatePDF() {
    window.print();
  }
}
