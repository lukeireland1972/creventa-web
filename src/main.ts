import { provideZoneChangeDetection } from "@angular/core";
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

function renderBootFailure(error: unknown): void {
  const root = document.querySelector('app-root');
  if (!root) {
    return;
  }

  const message = escapeHtml(error instanceof Error ? error.message : 'Unknown startup error');
  root.innerHTML = `
    <section style="min-height:100vh;display:grid;place-items:center;padding:24px;background:#f8fafc;color:#0f172a;font-family:Inter,'Segoe UI',sans-serif;">
      <article style="width:min(720px,100%);background:#ffffff;border:1px solid #e2e8f0;border-radius:16px;padding:20px 22px;box-shadow:0 8px 24px rgba(15,23,42,.08);">
        <h1 style="margin:0 0 10px;font-size:1.2rem;">CreventaFlow failed to start</h1>
        <p style="margin:0 0 14px;color:#475569;">The UI could not bootstrap. Check browser console and API availability, then reload.</p>
        <pre style="margin:0;padding:12px;background:#f8fafc;border-radius:10px;border:1px solid #e2e8f0;white-space:pre-wrap;word-break:break-word;font-size:.82rem;color:#334155;">${message}</pre>
      </article>
    </section>
  `;
}

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

bootstrapApplication(AppComponent, { ...appConfig, providers: [provideZoneChangeDetection(), ...appConfig.providers] }).catch((err) => {
  console.error('Bootstrap failed:', err);
  renderBootFailure(err);
});
