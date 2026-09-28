// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-root',
//   templateUrl: './app.component.html',
//   styleUrls: ['./app.component.css']
// })
// export class AppComponent {
//   title = 'AUBSystem.UI';
// }
// import { Component, NgZone } from '@angular/core';
// import { Router } from '@angular/router';

// @Component({
//   selector: 'app-root',
//   templateUrl: './app.component.html',
//   styleUrls: ['./app.component.css']
// })
// export class AppComponent {
//   title = 'AUBSystem.UI';

//   constructor(private router: Router, private zone: NgZone) {
//     (window as any).angularComponentRef = {
//       zone: this.zone,
//       router: this.router
//     };
//   }
// }


import { Component, NgZone } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'AUBSystem.UI';

  constructor(private router: Router, private zone: NgZone) {}

  ngOnInit(): void {
    (window as any).angularComponentRef = {
      zone: this.zone,
      router: this.router
    };
  }
}
