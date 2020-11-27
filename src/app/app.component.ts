import { Component, OnInit } from '@angular/core';
import { UmanaCourseService } from './service/umana-course.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor(
    public umanaCourseService: UmanaCourseService
  ) { }

  ngOnInit(): void {
    this.umanaCourseService.checkAlive();
  }

  describeAlive(): string {
    if (this.umanaCourseService.isAlive === undefined) {
      return "sconosciuto";
    } else if (this.umanaCourseService.isAlive === false) {
      return "down";
    } else {
      return "up";
    }
  }

  loginUser(event: Event): void {
    this.umanaCourseService.login("user", "passord");
  }

  loginAdmin(event: Event): void {
    this.umanaCourseService.login("admin", "password");
  }
}
