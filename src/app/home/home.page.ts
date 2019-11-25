import { Component, OnInit } from '@angular/core';
import { OCR, OCRSourceType, OCRResult } from '@ionic-native/ocr/ngx';
import { Camera } from '@ionic-native/camera/ngx';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  selectedImage: string;
  word: string[];
  nat = '';
  passNo = '';
  expiryDate = '';
  birthDay = '';
  countryCode = '';
  constructor(private ocr: OCR, private camera: Camera) { }

  onPickImage() {
    const cameraOptions = {
      encodingType: this.camera.EncodingType.JPEG,
      correctOrientation: true
    };

    this.camera.getPicture(cameraOptions).then((res) => {
      console.log(res);
      const firstParam = 'lines';
      const secondParam = 'linetext';
      this.ocr.recText(OCRSourceType.NORMFILEURL, res).then((res2: OCRResult) => {
        console.log(res2[firstParam][secondParam]);
        let data = '';
        this.passNo = '';
        this.countryCode = '';
        this.birthDay = '';
        this.expiryDate = '';
        this.nat = '';
        res2[firstParam][secondParam].forEach(element => {
          element = element.replace(/\s/g, '');
          const line = element.match(/.{10}[A-Za-z]{3}[0-9]{7}[A-Za-z]{1}[0-9]{7}/gi);
          if (line) {
            data = line[0];
          }
        });
        if (data) {
          console.log(data);
          let passportNum = data.substr(0, 9);
          console.log(passportNum);
          passportNum = passportNum.replace('<<', '');
          this.passNo = passportNum;
          const country = data.match(/[A-Za-z]{3}/gi)[0];
          this.countryCode = country;
          let dob = data.match(/[A-Za-z]{3}[0-9]{6}/gi)[0].substr(3);
          let expdate = data.match(/[0-9][A-Za-z][0-9]{6}/gi)[0].substr(2);
          if (+dob.substr(0, 2) > (new Date()).getFullYear() - 2000) {
            dob = dob.substr(4, 2) + '/' + dob.substr(2, 2) + '/' + '19' + dob.substr(0, 2);
          } else {
            dob = dob.substr(4, 2) + '/' + dob.substr(2, 2) + '/' + '20' + dob.substr(0, 2);
          }
          this.birthDay = dob;
          expdate = expdate.substr(4, 2) + '/' + expdate.substr(2, 2) + '/' + '20' + expdate.substr(0, 2);
          this.expiryDate = expdate;
          let nationality = 'Egyptian';
          if (country === 'USA') {
            nationality = 'American';
          } else if (country === 'HRV') {
            nationality = 'Croatian';
          } else if (country === 'LVA') {
            nationality = 'Latvian';
          } else if (country === 'CHN' || country === 'cHN') {
            nationality = 'Chineese';
          } else if (country === 'SAU') {
            nationality = 'Saudi Arabian';
          }
          this.nat = nationality;
          console.log('Passport Num: ', passportNum);
          console.log('Country Code: ', country);
          console.log('Date of birth: ', dob);
          console.log('Expiary Date: ', expdate);
          console.log('Nationality:', nationality);
        } else {
          alert('Please retake the picture');
        }
      })
        .catch((error: any) => console.error(error));
    }, (err) => {
      console.log(err);
    });

  }
}
