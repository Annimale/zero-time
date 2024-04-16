import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { WatchService } from '../watch.service';

@Component({
  selector: 'app-add-watch',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './add-watch.component.html',
  styleUrl: './add-watch.component.css'
})
export class AddWatchComponent {
  images: File[] = [];

  watchForm = new FormGroup({
    brand: new FormControl('', Validators.required),
    model: new FormControl('', Validators.required),
    description: new FormControl(''),
    movement: new FormControl('', Validators.required),
    condition: new FormControl('', Validators.required),
    caseSize: new FormControl('', [Validators.required, Validators.min(1)]),
    caseThickness: new FormControl('', [Validators.required, Validators.min(1)]),
  })
  constructor(private watchService: WatchService) { }

  onSubmit(): void {
    if (this.watchForm.valid) {
      this.watchService.addWatch(this.watchForm.value).subscribe({
        next: (response) => console.log('Watch added successfully', response),
        error: (error) => console.error('Error adding watch', error)
      });
    } else {
      console.log('Form is not valid');
    }
  }
}
