import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  imports: [CommonModule, RouterModule],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit, OnDestroy {
  protected title = 'settings';
  protected userEmail = 'user@streamhub.demo';
  protected userName = 'Test User';
  protected isIframe = false;
  protected isAuthenticated = false;
  protected grafanaUrl = 'http://localhost:3000/d/streaming-hub-metrics?orgId=1&kiosk';

  private messageListener!: (event: MessageEvent) => void;

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.isIframe = window.parent !== window;
    
    // Resolve Grafana host dynamically based on deployment location
    const host = window.location.hostname;
    this.grafanaUrl = `http://${host}:3000/d/streaming-hub-metrics?orgId=1&kiosk`;

    this.messageListener = (event: MessageEvent) => {
      if (event.data && event.data.type === 'STREAMHUB_AUTH') {
        const { user } = event.data.payload;
        this.userEmail = user.email;
        this.userName = user.name;
        this.isAuthenticated = true;
        this.cdr.detectChanges(); // Trigger manual change detection
        console.log('Angular Settings MFE: Authenticated!');
      }
    };

    window.addEventListener('message', this.messageListener);
  }

  ngOnDestroy() {
    if (this.messageListener) {
      window.removeEventListener('message', this.messageListener);
    }
  }
}
