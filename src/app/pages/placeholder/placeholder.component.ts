import { Component, Input, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-placeholder',
  standalone: true,
  template: `
    <section class="placeholder">
      <h1>{{ title }}</h1>
      <p>Screen coming soon.</p>
    </section>
  `,
  styles: [
    `
      .placeholder {
        background: #fff;
        border-radius: 16px;
        padding: 2rem;
        box-shadow: 0 12px 24px rgba(16, 24, 40, 0.06);
      }

      h1 {
        margin: 0 0 0.5rem;
      }

      p {
        margin: 0;
        color: #667085;
      }
    `
  ]
})
export class PlaceholderComponent implements OnInit {
  @Input() title = '';
  private route = inject(ActivatedRoute);

  ngOnInit(): void {
    if (!this.title) {
      this.title = this.route.snapshot.data['title'] ?? '';
    }
  }
}
