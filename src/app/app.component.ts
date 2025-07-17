import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ExtractdataComponent } from "./extractdata/extractdata.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ExtractdataComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'datashift_v2_web';
}
