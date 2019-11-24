import { Component, OnInit } from '@angular/core';
import { DocumentScanner, DocumentScannerOptions } from '@ionic-native/document-scanner';
import { OCR, OCRSourceType, OCRResult } from '@ionic-native/ocr/ngx';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  selectedImage: string;
  word: string[];
  nat = "";
  passNo = "";
  expiryDate = "";
  birthDay = "";
  countryCode = "";
  constructor(private ocr: OCR) {}

  onPickImage() {
    let opts: DocumentScannerOptions = {};
     DocumentScanner.scanDoc(opts)
      .then((res: string) => {
        this.ocr.recText(OCRSourceType.NORMFILEURL, res)
        // console.log(res)
    // this.ocr.recText(OCRSourceType.NORMFILEURL, "file:///storage/emulated/0/1998CAM/lva.jpg")
    // this.ocr.recText(OCRSourceType.NORMFILEURL, "file:///storage/emulated/0/1998CAM/ehabpass.jpg")
    .then((res: OCRResult) => {
      console.log(res)
      let data = '';
      let i = res['lines']['linetext'].length;
      res['lines']['linetext'].forEach(element => {
        // if (element.match(/<{5}[0-9]{2}/gi)) {
        //   data = element
        //   console.log("--------------------------",data)
        // }
        // else if (element = res['lines']['linetext'][i-1]) {
        // else {
          if(res['lines']['linetext'][i-1]) {
          data = res['lines']['linetext'][i-1]
          console.log("--------------------------",data)
        }
      });
      data = data.replace(/\s/g,'')
      let passportNum = data.substr(0,9);
      passportNum = passportNum.replace("<<","");
      this.passNo = passportNum;
      const country = data.match(/[A-Za-z]{3}/gi)[0];
      this.countryCode = country;
      let dob = data.match(/[A-Za-z]{3}[0-9]{6}/gi)[0].substr(3)
      let expdate = data.match(/[0-9][A-Za-z][0-9]{6}/gi)[0].substr(2)
      
      if (+dob.substr(0, 2) > (new Date()).getFullYear() - 2000){
        dob = dob.substr(4,2) + "/" + dob.substr(2,2) + "/" + "19" + dob.substr(0, 2)
      } else {
        dob =  dob.substr(4,2) + "/" + dob.substr(2,2) + "/" + "20" + dob.substr(0, 2)
      }
      this.birthDay = dob;

      expdate =  expdate.substr(4,2) + "/" + expdate.substr(2,2) + "/" + "20" + expdate.substr(0, 2)
      this.expiryDate = expdate;

      let nationality = "Egyptian";
      if(country == "USA") {
        nationality = "American";
      }
      else if(country == "HRV") {
        nationality = "Croatian";
      }
      else if(country == "LVA") {
        nationality = "Latvian";
      }
      else if(country == "CHN" || country == "cHN") {
        nationality = "Chineese";
      }
      else if(country == "SAU") {
        nationality = "Saudi Arabian"
      }
      this.nat = nationality;


      console.log("Passport Num:", passportNum)
      console.log("Country Code: ", country)
      console.log("Date of birth: ", dob)
      console.log("Expiary Date: ", expdate)
      console.log("Nationality:", nationality)

      // --------------------------------
      // console.log("Passport Number", res["lines"]["linetext"][3])
      
      // console.log("Expiry Date", res["lines"]["linetext"][16])

      // for(var i=0; i<res["lines"]["linetext"].length; i++){
      //   if(res["lines"]["linetext"][i]=="Nationality"){
      //     console.log("Nationality", res["lines"]["linetext"][i+1])
      //   }
      // }
    })
    .catch((error: any) => console.error(error));
  })
      .catch((error: any) => console.error(error));
  }
 

}
