import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppService } from '../app-service';
import { SharedService } from '../shared-service';
import { CommonModule, DatePipe } from '@angular/common';
import { LoaderService } from '../loader-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-member',
  imports: [FormsModule, CommonModule],
  providers: [DatePipe],
  templateUrl: './add-member.html',
  styleUrl: './add-member.css',
})
export class AddMember implements OnInit, OnDestroy {
  @ViewChild('delModal') modal!: ElementRef<HTMLDialogElement>;
  @ViewChild('ptDelModal') ptModal!: ElementRef<HTMLDialogElement>;
  @ViewChild('paymentModal') paymentModal!: ElementRef<HTMLDialogElement>;
  @ViewChild('webcamModal') webcamModal!: ElementRef<HTMLDialogElement>;
  @ViewChild('webcamVideo') webcamVideo!: ElementRef<HTMLVideoElement>;
  @ViewChild('webcamCanvas') webcamCanvas!: ElementRef<HTMLCanvasElement>;
  
  selectedPackageToDelete: any = null;
  selectedPackageForPayment: any = null;
  paymentAmount: string = '';
  selectedPtToDelete: any = null;

  minDate: any = null;
  maxDate: any = null;
  
  // Image upload properties
  selectedPhotoFile: File | null = null;
  currentImageUrl: string | null = null;
  isWebcamSupported: boolean = false;
  isWebcamActive: boolean = false;
  webcamStream: MediaStream | null = null;
  memberDetails: any = {
    memberNumber: '',
    fullName: '',
    emailAddress: '',
    mobileNumber: '',
    dateOfBirth: '',
    inquiryDate: '',
    occupation: '',
    packageType: '',
    joinDate: '',
    dueDate: '',
    remarks: '',
    gender: '',
    period: '',
    personalTrainer: '',
    ptAmount: '',
    age: '',
    maritalStatus: '',
    address: '',
    shiftType: '',
    time: '',
    joinWeight: '',
    paidDate: '',
    packageDetails: {
      packageName: '',
      period: '',
      startDate: '',
      endDate: '',
      amount: '',
    },
    memberPackageDetails: [],
    memberTrainerDetails: [],
    ptDetails: {
      uniqueId: '',
      ptName: '',
      ptPeriod: '',
      amount: '',
      startDate: '',
      endDate: '',
      remarks: '',
    },
  };

  constructor(
    private appService: AppService,
    public sharedService: SharedService,
    public cdr: ChangeDetectorRef,
    public loaderService: LoaderService,
    public router: Router,
    private datePipe: DatePipe,
  ) {
    const today = new Date();
    this.maxDate = today.toISOString().split('T')[0];
    const pastDate = new Date();
    pastDate.setFullYear(today.getFullYear() - 150);
    this.minDate = pastDate.toISOString().split('T')[0];
  }

  private formatDateForNgModel(dateValue: any): string {
    if (this.sharedService.checkIfValueIsEmpty(dateValue)) return '';
    const date = new Date(dateValue);
    return this.datePipe.transform(date, 'yyyy-MM-dd') || '';
  }

  populateMemberDetailsFromResponse() {
    if (!this.sharedService.checkIfValueIsEmpty(this.sharedService.savedMemberDataResponse())) {
      this.memberDetails.memberNumber = this.sharedService.savedMemberDataResponse().memberNo || '';
      this.memberDetails.fullName = this.sharedService.savedMemberDataResponse().fullName || '';
      this.memberDetails.emailAddress = this.sharedService.savedMemberDataResponse().email || '';
      this.memberDetails.mobileNumber =
        this.sharedService.savedMemberDataResponse().mobileNumber || '';
      this.memberDetails.dateOfBirth = this.formatDateForNgModel(
        this.sharedService.savedMemberDataResponse().dateOfBirth,
      );
      this.memberDetails.occupation = this.sharedService.savedMemberDataResponse().occupation || '';
      this.memberDetails.amount = this.sharedService.savedMemberDataResponse().amount || '';
      this.memberDetails.startDate = this.formatDateForNgModel(
        this.sharedService.savedMemberDataResponse().planStartDate,
      );
      this.memberDetails.endDate = this.formatDateForNgModel(
        this.sharedService.savedMemberDataResponse().planEndDate,
      );
      this.memberDetails.dueDate = this.formatDateForNgModel(
        this.sharedService.savedMemberDataResponse().memberDueDate ??
          this.sharedService.savedMemberDataResponse().dueDate,
      );
      this.memberDetails.remarks = this.sharedService.savedMemberDataResponse().remarks || '';
      this.memberDetails.gender = this.sharedService.savedMemberDataResponse().gender || '';
      this.memberDetails.joinDate = this.formatDateForNgModel(
        this.sharedService.savedMemberDataResponse().joinDate,
      );
      this.memberDetails.joinWeight = this.sharedService.savedMemberDataResponse().joinWeight || '';
      this.memberDetails.joinHeight = this.sharedService.savedMemberDataResponse().joinHeight || '';
      this.memberDetails.age = this.sharedService.savedMemberDataResponse().age || '';
      this.memberDetails.period = this.sharedService.savedMemberDataResponse().period || '';
      this.memberDetails.personalTrainer =
        this.sharedService.savedMemberDataResponse().personalTrainer || '';
      this.memberDetails.ptAmount = this.sharedService.savedMemberDataResponse().ptAmount || '';
      this.memberDetails.maritalStatus =
        this.sharedService.savedMemberDataResponse().maritalStatus || '';
      this.memberDetails.address = this.sharedService.savedMemberDataResponse().address || '';
      this.memberDetails.shiftType = this.sharedService.savedMemberDataResponse().shiftType || '';
      this.memberDetails.time = this.sharedService.savedMemberDataResponse().time || '';
      this.memberDetails.paidDate = this.formatDateForNgModel(
        this.sharedService.savedMemberDataResponse().paidDate,
      );
      this.memberDetails.memberPackageDetails =
        this.sharedService.savedMemberDataResponse().memberPackageDetails || [];
      this.memberDetails.memberTrainerDetails =
        this.sharedService.savedMemberDataResponse().memberTrainerDetails || [];

      // Set current image URL for display
      this.currentImageUrl = this.sharedService.savedMemberDataResponse().userImageUrl || null;

      this.validateDOB();
    }
  }

  ngOnInit(): void {
    this.loaderService.show.set(true);
    this.populateMemberDetailsFromResponse();
    this.fetchPackageDetails();
    this.getMiscDataFromType();
  }

  ngOnDestroy(): void {
    this.resetMemberDetails();
    this.sharedService.savedMemberDataResponse.set({});
    this.stopWebcam();
  }

  // Image upload methods
  checkWebcamSupport() {
    this.isWebcamSupported = !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
  }

  onPhotoFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 1 * 1024 * 1024) { // 1MB limit
        this.sharedService.snackBar.open('File size must be less than 1MB', 'Close', { duration: 3000 });
        return;
      }
      this.selectedPhotoFile = file;
      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        this.currentImageUrl = e.target?.result as string;
        this.cdr.detectChanges();
      };
      reader.readAsDataURL(file);
    }
  }

  openWebcamModal() {
    this.checkWebcamSupport();
    if (!this.isWebcamSupported) {
      this.sharedService.snackBar.open('Webcam not supported on this device', 'Close', { duration: 3000 });
      return;
    }
    this.webcamModal.nativeElement.showModal();
    this.startWebcam();
  }

  closeWebcamModal() {
    this.webcamModal.nativeElement.close();
    this.stopWebcam();
  }

  startWebcam() {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 480 } })
        .then((stream) => {
          this.webcamStream = stream;
          this.isWebcamActive = true;
          if (this.webcamVideo) {
            this.webcamVideo.nativeElement.srcObject = stream;
          }
          this.cdr.detectChanges();
        })
        .catch((error) => {
          console.error('Error accessing webcam:', error);
          this.isWebcamActive = false;
          
          if (error.name === 'NotAllowedError') {
            this.sharedService.snackBar.open('Camera access denied. Please enable camera permissions in your browser settings.', 'Close', { duration: 5000 });
          } else if (error.name === 'NotFoundError') {
            this.sharedService.snackBar.open('No camera found on this device.', 'Close', { duration: 3000 });
          } else if (error.name === 'NotReadableError') {
            this.sharedService.snackBar.open('Camera is already in use by another application.', 'Close', { duration: 3000 });
          } else {
            this.sharedService.snackBar.open('Error accessing webcam. Please try again.', 'Close', { duration: 3000 });
          }
          
          this.closeWebcamModal();
        });
    }
  }

  stopWebcam() {
    if (this.webcamStream) {
      this.webcamStream.getTracks().forEach(track => track.stop());
      this.webcamStream = null;
    }
    this.isWebcamActive = false;
  }

  capturePhoto() {
    if (!this.webcamVideo || !this.webcamCanvas) return;

    const video = this.webcamVideo.nativeElement;
    const canvas = this.webcamCanvas.nativeElement;
    const context = canvas.getContext('2d');

    if (context) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      canvas.toBlob((blob) => {
        if (blob) {
          if (blob.size > 1 * 1024 * 1024) {
            this.sharedService.snackBar.open('Captured photo is too large. Please try again with less detail or lower lighting.', 'Close', { duration: 5000 });
            return;
          }
          const file = new File([blob], 'webcam-photo.jpg', { type: 'image/jpeg' });
          this.selectedPhotoFile = file;
          this.currentImageUrl = canvas.toDataURL('image/jpeg');
          this.closeWebcamModal();
          this.cdr.detectChanges();
        }
      }, 'image/jpeg', 0.8);
    }
  }

  deleteCurrentImage() {
    this.selectedPhotoFile = null;
    this.currentImageUrl = null;
    // If editing existing member, we might need to delete from server
    if (this.sharedService.savedMemberDataResponse() && this.sharedService.savedMemberDataResponse().userImageUrl) {
      if (confirm('Are you sure you want to delete the current photo?')) {
        this.loaderService.show.set(true);
        this.appService.deleteUserImage(this.sharedService.savedMemberDataResponse()._id).subscribe(
          () => {
            this.loaderService.show.set(false);
            this.sharedService.savedMemberDataResponse.set({
              ...this.sharedService.savedMemberDataResponse(),
              userImageUrl: null,
              userImageId: null
            });
            this.sharedService.snackBar.open('Photo deleted successfully!', 'Close', { duration: 3000 });
          },
          (error) => {
            this.loaderService.show.set(false);
            this.sharedService.snackBar.open('Failed to delete photo', 'Close', { duration: 3000 });
          }
        );
      }
    }
  }

  uploadMemberImage(memberId: string) {
    if (!this.selectedPhotoFile) return;

    this.appService.uploadUserImage(this.selectedPhotoFile, memberId).subscribe(
      (response: any) => {
        // Update the saved member data with the new image URL
        const updatedMember = { ...this.sharedService.savedMemberDataResponse() };
        if (response.member) {
          updatedMember.userImageUrl = response.member.userImageUrl;
          updatedMember.userImageId = response.member.userImageId;
          this.sharedService.savedMemberDataResponse.set(updatedMember);
          this.currentImageUrl = response.member.userImageUrl;
        }
        this.selectedPhotoFile = null;
        this.sharedService.snackBar.open('Photo uploaded successfully!', 'Close', { duration: 3000 });
      },
      (error) => {
        console.error('Image upload failed:', error);
        this.sharedService.snackBar.open('Failed to upload photo. Please try again.', 'Close', { duration: 3000 });
      }
    );
  }

  resetMemberDetails() {
    this.memberDetails = {
      memberNumber: '',
      fullName: '',
      emailAddress: '',
      mobileNumber: '',
      dateOfBirth: '',
      inquiryDate: '',
      occupation: '',
      packageType: '',
      joinDate: '',
      dueDate: '',
      remarks: '',
      gender: '',
      period: '',
      personalTrainer: '',
      ptAmount: '',
      age: '',
      maritalStatus: '',
      address: '',
      shiftType: '',
      time: '',
      joinWeight: '',
      paidDate: '',
      packageDetails: {
        packageName: '',
        period: '',
        startDate: '',
        endDate: '',
        amount: '',
      },
      memberPackageDetails: [],
      memberTrainerDetails: [],
      ptDetails: {
        ptName: '',
        ptPeriod: '',
        amount: '',
        startDate: '',
        endDate: '',
        remarks: '',
        uniqueId: '',
      },
    };
  }

  printData() {
    console.log(this.memberDetails);
  }

  validateDOB() {
    if (!this.memberDetails.dateOfBirth) return;

    const selected = new Date(this.memberDetails.dateOfBirth);
    const min = new Date(this.minDate);
    const max = new Date(this.maxDate);

    // Check if date is in the future OR more than 150 years old
    if (selected > max || selected < min) {
      alert('Date must be between ' + this.minDate + ' and ' + this.maxDate);
      this.memberDetails.dateOfBirth = ''; // Clear ngModel
      this.memberDetails.age = '';
    } else {
      const today = new Date();
      let age = today.getFullYear() - selected.getFullYear();
      const monthDiff = today.getMonth() - selected.getMonth();

      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < selected.getDate())) {
        age--;
      }

      this.memberDetails.age = age;
    }
  }

  validateEmail() {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (this.memberDetails.emailAddress && !emailRegex.test(this.memberDetails.emailAddress)) {
      this.sharedService.snackBar.open('Invalid email.');
      this.memberDetails.emailAddress = '';
    }
  }

  validateMobileNumber() {
    const mobileRegex = /^[6-9]\d{9}$/;
    if (this.memberDetails.mobileNumber && !mobileRegex.test(this.memberDetails.mobileNumber)) {
      this.sharedService.snackBar.open('Invalid mobile number.');
      this.memberDetails.mobileNumber = '';
    }
  }

  savememberDetails(redirect: boolean) {
    let isValid: any = true;
    let validationArray: any = [
      {
        ngModelValue: 'memberNumber',
        requiredMessage: 'Member number is mandatory',
      },
      {
        ngModelValue: 'fullName',
        requiredMessage: 'Member full name is mandatory',
      },
      // {
      //   ngModelValue: 'emailAddress',
      //   requiredMessage: 'Member email is mandatory',
      // },
      // {
      //   ngModelValue: 'mobileNumber',
      //   requiredMessage: 'Member mobile number is mandatory',
      // },
      {
        ngModelValue: 'dateOfBirth',
        requiredMessage: 'Member date of birth is mandatory',
      },
      {
        ngModelValue: 'occupation',
        requiredMessage: 'Member occupation is mandatory',
      },
      {
        ngModelValue: 'joinDate',
        requiredMessage: 'Member joining date is mandatory',
      },
      {
        ngModelValue: 'gender',
        requiredMessage: 'Member gender is mandatory',
      },
      {
        ngModelValue: 'maritalStatus',
        requiredMessage: 'Marital Status is mandatory',
      },
      {
        ngModelValue: 'address',
        requiredMessage: 'Address is mandatory',
      },
      {
        ngModelValue: 'shiftType',
        requiredMessage: 'Shift Type is mandatory',
      },
      {
        ngModelValue: 'joinWeight',
        requiredMessage: 'Member joining weight is mandatory',
      },
    ];

    validationArray.forEach((singleObj: any) => {
      if (
        this.sharedService.checkIfValueIsEmpty(this.memberDetails[singleObj['ngModelValue']]) &&
        isValid
      ) {
        this.sharedService.snackBar.open(singleObj['requiredMessage']);
        isValid = false;
      }
    });

    if (isValid) {
      this.loaderService.show.set(true);
      let request: any = {
        memberNo: !this.sharedService.checkIfValueIsEmpty(this.memberDetails.memberNumber)
          ? this.memberDetails.memberNumber
          : '',
        fullName: !this.sharedService.checkIfValueIsEmpty(this.memberDetails.fullName)
          ? this.memberDetails.fullName
          : '',
        email: !this.sharedService.checkIfValueIsEmpty(this.memberDetails.emailAddress)
          ? this.memberDetails.emailAddress
          : '',
        mobileNumber: !this.sharedService.checkIfValueIsEmpty(this.memberDetails.mobileNumber)
          ? this.memberDetails.mobileNumber
          : '',
        dateOfBirth: !this.sharedService.checkIfValueIsEmpty(this.memberDetails.dateOfBirth)
          ? this.datePipe.transform(new Date(this.memberDetails.dateOfBirth), 'yyyy-MM-dd')
          : null,
        occupation: !this.sharedService.checkIfValueIsEmpty(this.memberDetails.occupation)
          ? this.memberDetails.occupation
          : '',
        amount: !this.sharedService.checkIfValueIsEmpty(this.memberDetails.amount)
          ? this.memberDetails.amount
          : null,
        planStartDate: !this.sharedService.checkIfValueIsEmpty(this.memberDetails.startDate)
          ? this.memberDetails.startDate
          : null,
        planEndDate: !this.sharedService.checkIfValueIsEmpty(this.memberDetails.endDate)
          ? this.memberDetails.endDate
          : null,
        dueDate: !this.sharedService.checkIfValueIsEmpty(this.memberDetails.dueDate)
          ? this.memberDetails.dueDate
          : null,
        memberDueDate: !this.sharedService.checkIfValueIsEmpty(this.memberDetails.dueDate)
          ? this.memberDetails.dueDate
          : null,
        remarks: !this.sharedService.checkIfValueIsEmpty(this.memberDetails.remarks)
          ? this.memberDetails.remarks
          : '',
        gender: !this.sharedService.checkIfValueIsEmpty(this.memberDetails.gender)
          ? this.memberDetails.gender
          : '',
        joinDate: !this.sharedService.checkIfValueIsEmpty(this.memberDetails.joinDate)
          ? this.datePipe.transform(new Date(this.memberDetails.joinDate), 'yyyy-MM-dd')
          : null,
        joinWeight: !this.sharedService.checkIfValueIsEmpty(this.memberDetails.joinWeight)
          ? this.memberDetails.joinWeight
          : null,
        joinHeight: !this.sharedService.checkIfValueIsEmpty(this.memberDetails.joinHeight)
          ? this.memberDetails.joinHeight
          : null,
        age: !this.sharedService.checkIfValueIsEmpty(this.memberDetails.age)
          ? this.memberDetails.age
          : null,
        period: !this.sharedService.checkIfValueIsEmpty(this.memberDetails.period)
          ? this.memberDetails.period
          : '',
        personalTrainer: !this.sharedService.checkIfValueIsEmpty(this.memberDetails.personalTrainer)
          ? this.memberDetails.personalTrainer
          : '',
        ptAmount: !this.sharedService.checkIfValueIsEmpty(this.memberDetails.ptAmount)
          ? this.memberDetails.ptAmount
          : null,
        maritalStatus: !this.sharedService.checkIfValueIsEmpty(this.memberDetails.maritalStatus)
          ? this.memberDetails.maritalStatus
          : '',
        address: !this.sharedService.checkIfValueIsEmpty(this.memberDetails.address)
          ? this.memberDetails.address
          : '',
        shiftType: !this.sharedService.checkIfValueIsEmpty(this.memberDetails.shiftType)
          ? this.memberDetails.shiftType
          : '',
        time: !this.sharedService.checkIfValueIsEmpty(this.memberDetails.time)
          ? this.memberDetails.time
          : '',
        paidDate: !this.sharedService.checkIfValueIsEmpty(this.memberDetails.paidDate)
          ? this.memberDetails.paidDate
          : null,
      };

      if (!this.sharedService.checkIfValueIsEmpty(this.sharedService.savedMemberDataResponse())) {
        request['uniqueId'] = this.sharedService.savedMemberDataResponse()._id;
      }
      this.appService[
        !this.sharedService.checkIfValueIsEmpty(this.sharedService.savedMemberDataResponse())
          ? 'updateMemberDetailsByUniqueId'
          : 'saveMemberDetails'
      ](request).subscribe(
        (data: any) => {
          if (!this.sharedService.checkIfValueIsEmpty(data)) {
            this.loaderService.show.set(false);
            this.sharedService.savedMemberDataResponse.set(data['data']);
            
            // Upload image if selected
            if (this.selectedPhotoFile) {
              this.uploadMemberImage(data['data']._id);
            }
            
            if (redirect) {
              this.memberDetails = {
                memberNumber: '',
                fullName: '',
                emailAddress: '',
                mobileNumber: '',
                dateOfBirth: '',
                inquiryDate: '',
                occupation: '',
                packageType: '',
                joinDate: '',
                dueDate: '',
                remarks: '',
                gender: '',
                period: '',
                personalTrainer: '',
                ptAmount: '',
                age: '',
                maritalStatus: '',
                address: '',
                shiftType: '',
                time: '',
                joinWeight: '',
                paidDate: '',
                packageDetails: {
                  packageName: '',
                  period: '',
                  startDate: '',
                  endDate: '',
                  amount: '',
                },
                ptDetails: {
                  uniqueId: '',
                  ptName: '',
                  ptPeriod: '',
                  amount: '',
                  startDate: '',
                  endDate: '',
                  remarks: '',
                },
              };
              this.selectedPhotoFile = null;
              this.currentImageUrl = null;
              this.sharedService.savedMemberDataResponse.set([]);
              this.router.navigate(['/newMemberList']);
            }
            this.sharedService.snackBar.open('Member details saved successfully.');
          }
        },
        (err: any) => {
          this.loaderService.show.set(false);
        },
      );
    }
  }

  fetchPackageDetails() {
    this.sharedService.masterPackageDetailsList.set([]);
    this.appService.getMasterPackageDetails().subscribe(
      (data: any) => {
        if (!this.sharedService.checkIfValueIsEmpty(data)) {
          this.sharedService.masterPackageDetailsList.set(data['data']);
          this.loaderService.show.set(false);
        }
      },
      (error: any) => {
        this.loaderService.show.set(false);
      },
    );
  }
  miscData: any;
  occupationList: any;
  maritalStatusList: any;
  shiftList: any;

  getMiscDataFromType() {
    let request = { headerTypes: ['Occupation', 'Marital Status', 'Shift type'] };
    this.appService.getMiscMasterDataFromType(request).subscribe(
      (data: any) => {
        if (!this.sharedService.checkIfValueIsEmpty(data)) {
          //Misc data to assign to different variables
          this.miscData = data['data'];
          this.occupationList = this.miscData.filter(
            (singleData: any) => singleData.headerType === 'Occupation',
          )[0].keyValuePairs;
          this.maritalStatusList = this.miscData.filter(
            (singleData: any) => singleData.headerType === 'Marital Status',
          )[0].keyValuePairs;
          this.shiftList = this.miscData.filter(
            (singleData: any) => singleData.headerType === 'Shift type',
          )[0].keyValuePairs;
          this.loaderService.show.set(false);
          this.cdr.detectChanges();
        }
      },
      (error) => {
        //this.loaderService.show.set(false);
        alert('Error in fetching data for selected Misc Type.');
      },
    );
  }

  updatePackageDetails() {
    if (!this.sharedService.checkIfValueIsEmpty(this.memberDetails.packageName)) {
      let selectedObjForPackage: any = this.sharedService
        .masterPackageDetailsList()
        .filter((singleObj: any) => singleObj['_id'] === this.memberDetails.packageName);
      if (selectedObjForPackage.length > 0) {
        this.memberDetails.period = selectedObjForPackage[0]['duration'];
        this.memberDetails.amount = selectedObjForPackage[0]['fee'];
        this.memberDetails.selectedPackageName = selectedObjForPackage[0]['packageName'];
        this.memberDetails.packageActualFee = selectedObjForPackage[0]['fee'];
      }
    }
  }

  addPackage(redirect: boolean) {
    if (this.sharedService.checkIfValueIsEmpty(this.sharedService.savedMemberDataResponse())) {
      this.sharedService.snackBar.open('Please save member details first.');
      return;
    }

    let isValid: any = true;
    const validationArray: any = [
      {
        ngModelValue: 'packageName',
        requiredMessage: 'Please select a package.',
      },
      {
        ngModelValue: 'startDate',
        requiredMessage: 'Package start date is mandatory.',
      },
      {
        ngModelValue: 'endDate',
        requiredMessage: 'Package end date is mandatory.',
      },
    ];

    validationArray.forEach((singleObj: any) => {
      if (
        this.sharedService.checkIfValueIsEmpty(this.memberDetails[singleObj['ngModelValue']]) &&
        isValid
      ) {
        this.sharedService.snackBar.open(singleObj['requiredMessage']);
        isValid = false;
      }
    });

    if (!isValid) {
      return;
    }

    let request: any = {
      memberNo: this.sharedService.savedMemberDataResponse().memberNo,
      memberID: this.sharedService.savedMemberDataResponse()._id,
      masterPackageId: !this.sharedService.checkIfValueIsEmpty(this.memberDetails.packageName)
        ? this.memberDetails.packageName
        : null,
      packageName: !this.sharedService.checkIfValueIsEmpty(this.memberDetails.selectedPackageName)
        ? this.memberDetails.selectedPackageName
        : null,
      fee: !this.sharedService.checkIfValueIsEmpty(this.memberDetails.packageActualFee)
        ? this.memberDetails.packageActualFee
        : null,
      startDate: !this.sharedService.checkIfValueIsEmpty(this.memberDetails.startDate)
        ? this.datePipe.transform(new Date(this.memberDetails.startDate), 'yyyy-MM-dd')
        : null,
      endDate: !this.sharedService.checkIfValueIsEmpty(this.memberDetails.endDate)
        ? this.datePipe.transform(new Date(this.memberDetails.endDate), 'yyyy-MM-dd')
        : null,
      remarks: !this.sharedService.checkIfValueIsEmpty(this.memberDetails.remarks)
        ? this.memberDetails.remarks
        : null,
      discountedPrice: !this.sharedService.checkIfValueIsEmpty(this.memberDetails.amount)
        ? this.memberDetails.amount
        : null,
    };
    this.appService.saveMemberPackageDetails(request).subscribe(
      (data: any) => {
        if (this.sharedService.checkIfValueIsEmpty(this.memberDetails.memberPackageDetails)) {
          this.memberDetails.memberPackageDetails = [];
        }
        this.memberDetails.memberPackageDetails.push(data['data']);
        this.cdr.detectChanges();
        if (redirect) {
          this.router.navigate(['newMemberList']);
        }
      },
      (error: any) => {},
    );
  }

  resetPtDetailsForm() {
    this.memberDetails.ptDetails = {
      uniqueId: '',
      ptName: '',
      ptPeriod: '',
      amount: '',
      startDate: '',
      endDate: '',
      remarks: '',
    };
  }

  savePtDetails(redirect: boolean) {
    if (this.sharedService.checkIfValueIsEmpty(this.sharedService.savedMemberDataResponse())) {
      this.sharedService.snackBar.open('Please save member details first.');
      return;
    }

    let isValid: any = true;
    const validationArray: any = [
      {
        ngModelValue: 'ptName',
        requiredMessage: 'PT Name is mandatory.',
      },
      {
        ngModelValue: 'ptPeriod',
        requiredMessage: 'PT Period is mandatory.',
      },
      {
        ngModelValue: 'amount',
        requiredMessage: 'PT amount is mandatory.',
      },
      {
        ngModelValue: 'startDate',
        requiredMessage: 'PT start date is mandatory.',
      },
      {
        ngModelValue: 'endDate',
        requiredMessage: 'PT end date is mandatory.',
      },
    ];

    validationArray.forEach((singleObj: any) => {
      if (
        this.sharedService.checkIfValueIsEmpty(this.memberDetails.ptDetails[singleObj['ngModelValue']]) &&
        isValid
      ) {
        this.sharedService.snackBar.open(singleObj['requiredMessage']);
        isValid = false;
      }
    });

    if (!isValid) {
      return;
    }

    let request: any = {
      memberNo: this.sharedService.savedMemberDataResponse().memberNo,
      memberID: this.sharedService.savedMemberDataResponse()._id,
      duration: !this.sharedService.checkIfValueIsEmpty(this.memberDetails.ptDetails.ptPeriod)
        ? this.memberDetails.ptDetails.ptPeriod
        : null,
      startDate: !this.sharedService.checkIfValueIsEmpty(this.memberDetails.ptDetails.startDate)
        ? this.datePipe.transform(new Date(this.memberDetails.ptDetails.startDate), 'yyyy-MM-dd')
        : null,
      endDate: !this.sharedService.checkIfValueIsEmpty(this.memberDetails.ptDetails.endDate)
        ? this.datePipe.transform(new Date(this.memberDetails.ptDetails.endDate), 'yyyy-MM-dd')
        : null,
      remarks: !this.sharedService.checkIfValueIsEmpty(this.memberDetails.ptDetails.remarks)
        ? this.memberDetails.ptDetails.remarks
        : '',
      amount: !this.sharedService.checkIfValueIsEmpty(this.memberDetails.ptDetails.amount)
        ? this.memberDetails.ptDetails.amount
        : null,
      ptName: !this.sharedService.checkIfValueIsEmpty(this.memberDetails.ptDetails.ptName)
        ? this.memberDetails.ptDetails.ptName
        : '',
    };

    if (!this.sharedService.checkIfValueIsEmpty(this.memberDetails.ptDetails.uniqueId)) {
      request['uniqueId'] = this.memberDetails.ptDetails.uniqueId;
    }

    const apiCall = !this.sharedService.checkIfValueIsEmpty(this.memberDetails.ptDetails.uniqueId)
      ? this.appService.updateMemberTrainerByUniqueId(request)
      : this.appService.saveMemberTrainerDetails(request);

    this.loaderService.show.set(true);
    apiCall.subscribe(
      (data: any) => {
        this.loaderService.show.set(false);
        if (this.sharedService.checkIfValueIsEmpty(data)) {
          return;
        }

        const response = data['data'];
        if (this.sharedService.checkIfValueIsEmpty(this.memberDetails.memberTrainerDetails)) {
          this.memberDetails.memberTrainerDetails = [];
        }

        if (!this.sharedService.checkIfValueIsEmpty(this.memberDetails.ptDetails.uniqueId)) {
          const index = this.memberDetails.memberTrainerDetails.findIndex(
            (item: any) => item._id === this.memberDetails.ptDetails.uniqueId,
          );
          if (index !== -1) {
            this.memberDetails.memberTrainerDetails[index] = response;
          } else {
            this.memberDetails.memberTrainerDetails.push(response);
          }
        } else {
          this.memberDetails.memberTrainerDetails.push(response);
        }

        this.resetPtDetailsForm();
        this.cdr.detectChanges();
        if (redirect) {
          this.router.navigate(['newMemberList']);
        }
      },
      (error: any) => {
        this.loaderService.show.set(false);
      },
    );
  }

  editPtDetails(singlePt: any) {
    this.memberDetails.ptDetails = {
      uniqueId: singlePt._id,
      ptName: singlePt.ptName || '',
      ptPeriod: singlePt.duration || '',
      amount: singlePt.amount || '',
      startDate: this.formatDateForNgModel(singlePt.startDate),
      endDate: this.formatDateForNgModel(singlePt.endDate),
      remarks: singlePt.remarks || '',
    };
  }

  deletePtDetails(pt: any) {
    this.selectedPtToDelete = pt;
    this.ptModal.nativeElement.showModal();
  }

  closePtModal() {
    this.ptModal.nativeElement.close();
  }

  confirmPtDelete() {
    this.closePtModal();
    if (this.selectedPtToDelete) {
      this.deletePtDetailsCall(this.selectedPtToDelete);
    }
  }

  deletePtDetailsCall(singlePt: any) {
    this.loaderService.show.set(true);
    this.appService.deleteMemberTrainer(singlePt._id).subscribe(
      (data: any) => {
        this.loaderService.show.set(false);
        const deletedIndex: any = this.memberDetails.memberTrainerDetails.findIndex(
          (item: any) => item._id === singlePt._id,
        );
        if (deletedIndex !== -1) {
          this.memberDetails.memberTrainerDetails.splice(deletedIndex, 1);
          this.cdr.detectChanges();
        }
      },
      (err: any) => {
        this.loaderService.show.set(false);
      },
    );
  }

  deletePackage(pkg: any) {
    this.selectedPackageToDelete = pkg;
    this.modal.nativeElement.showModal();
  }

  packagePaidAmount: number = 0;
  totalPayable: number = 0;
  paymentBalance: number = 0;

  openPaymentModal(singlePackage: any) {
    this.selectedPackageForPayment = singlePackage;
    this.paymentAmount = '';
    this.totalPayable = Number(singlePackage?.discountedPrice ?? singlePackage?.fee ?? 0);
    this.packagePaidAmount = this.calculatePackagePaidAmount(singlePackage);
    this.paymentBalance = Math.max(this.totalPayable - this.packagePaidAmount, 0);
    this.paymentModal.nativeElement.showModal();
  }

  closePaymentModal() {
    this.paymentModal.nativeElement.close();
  }

  private calculatePackagePaidAmount(pkg: any): number {
    if (!pkg?.paymentDetails?.length) {
      return 0;
    }
    return pkg.paymentDetails.reduce((sum: number, payment: any) => sum + Number(payment.amount || 0), 0);
  }

  savePaymentDetails() {
    const amountValue = Number(this.paymentAmount);
    const maxBalance = Number(this.paymentBalance ?? 0);

    if (!this.selectedPackageForPayment) {
      this.sharedService.snackBar.open('Please select a package for payment.');
      return;
    }

    if (!amountValue || amountValue <= 0) {
      this.sharedService.snackBar.open('Please enter a valid payment amount.');
      return;
    }

    if (amountValue > maxBalance) {
      this.sharedService.snackBar.open('Amount cannot exceed the remaining balance.');
      return;
    }

    const request = {
      memberPackageId: this.selectedPackageForPayment._id,
      amount: amountValue,
    };

    this.loaderService.show.set(true);
    this.appService.savePaymentDetails(request).subscribe(
      () => {
        this.loaderService.show.set(false);
        this.closePaymentModal();
        this.sharedService.snackBar.open('Payment saved successfully.');
      },
      (error: any) => {
        this.loaderService.show.set(false);
        this.sharedService.snackBar.open('Error saving payment. Please try again.');
      },
    );
  }

  printPackageReceipt(packageRecord: any) {
    const member = this.sharedService.savedMemberDataResponse();
    const total = (packageRecord.paymentDetails || []).reduce((sum: number, payment: any) => sum + Number(payment.amount || 0), 0);
    const invoiceDate = new Date().toLocaleDateString();
    const invoiceNumber = 'RCPT-' + Date.now();
    const baseUrl = window.location.origin;
    let paymentsHTML = '';
    if (packageRecord?.paymentDetails) {
      paymentsHTML = packageRecord.paymentDetails.map((payment: any, index: number) => `
        <tr>
          <td style="padding: 8px 5px;">${index + 1}</td>
          <td style="padding: 8px 5px;">${payment._id}</td>
          <td style="padding: 8px 5px;">₹${payment.amount}</td>
          <td style="padding: 8px 5px;">${payment.createdDate ? new Date(payment.createdDate).toLocaleDateString() : ''}</td>
        </tr>
      `).join('');
    }
    const html = `
      <html>
        <head>
          <title>Z Fitness Receipt</title>
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
                <h6>Receipt Details:</h6>
                <p><strong>#:</strong> ${invoiceNumber}</p>
                <p><strong>Date:</strong> ${invoiceDate}</p>
                <p><strong>Package:</strong> ${packageRecord.packageName}</p>
              </div>
            </div>
            
            <table class="table table-bordered" style="margin-bottom: 5px;">
              <thead>
                <tr>
                  <th style="width: 5%;">S.No</th>
                  <th style="width: 30%;">Payment ID</th>
                  <th style="width: 30%;">Amount</th>
                  <th style="width: 35%;">Date</th>
                </tr>
              </thead>
              <tbody>
                ${paymentsHTML}
              </tbody>
            </table>
            
            <div class="total-section">
              <p>Total Paid: ₹${total}</p>
            </div>
            
            <div class="footer">
              <p>Thank you for choosing Z Fitness Gym! | Terms: Non-refundable | Contact: info@zfitness.com</p>
            </div>
          </div>
          
          <button class="print-btn" onclick="window.print()">🖨️ Print & Save PDF</button>
        </body>
      </html>
    `;

    const receiptWindow = window.open('', '_blank', 'width=800,height=600');
    if (receiptWindow) {
      receiptWindow.document.write(html);
      receiptWindow.document.close();
    }
  }

  closeModal() {
    this.modal.nativeElement.close();
  }

  confirmDelete() {
    this.closeModal();
    if (this.selectedPackageToDelete) {
      this.deletePackageCall(this.selectedPackageToDelete);
    }
  }

  deletePackageCall(singlePackage: any) {
    this.loaderService.show.set(true);
    this.appService.deleteMemberPackage(singlePackage._id).subscribe(
      (data: any) => {
        this.loaderService.show.set(false);
        let deltedIndex: any = this.memberDetails.memberPackageDetails.findIndex(
          (singleObj: any) => singleObj._id === singlePackage._id,
        );
        if (deltedIndex !== -1) {
          this.memberDetails.memberPackageDetails.splice(deltedIndex, 1);
          this.cdr.detectChanges();
        }
      },
      (err: any) => {
        this.loaderService.show.set(false);
      },
    );
  }
}
