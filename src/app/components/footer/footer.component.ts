import {Component} from '@angular/core';
import {faLinkedin, faGithub} from "@fortawesome/free-brands-svg-icons";

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css'],
})
export class FooterComponent {
  faLinkedin = faLinkedin;
  faGithub = faGithub;

  constructor() {}

}
