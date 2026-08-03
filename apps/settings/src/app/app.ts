import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { UserProfile, AUTH_EVENT_TYPE } from '@streaming-hub/shared-data';

@Component({
  imports: [CommonModule, RouterModule],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit, OnDestroy {
  protected title = 'settings';
  protected profile: UserProfile = {
    name: 'Test User',
    email: 'user@streamhub.demo',
    plan: 'Premium Ultra HD'
  };
  protected userEmail = 'user@streamhub.demo';
  protected userName = 'Test User';
  protected isIframe = false;
  protected isAuthenticated = false;
  protected safeGrafanaUrl!: SafeResourceUrl;

  // Grafana Health & Telemetry State
  protected isGrafanaOnline = false;
  protected isCheckingGrafana = true;
  protected latency = 14;
  protected activeViewers = 1428;
  protected bitrate = '14.2 Mbps';
  protected systemHealth = '99.98%';

  private messageListener!: (event: MessageEvent) => void;
  private metricsTimer: any;

  constructor(
    private cdr: ChangeDetectorRef,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    this.isIframe = window.parent !== window;

    // Check localStorage fallback for instant session sync on tab switch
    const savedSession = localStorage.getItem('streamhub_session');
    if (savedSession) {
      try {
        const parsed = JSON.parse(savedSession);
        if (parsed && parsed.email) {
          this.userEmail = parsed.email;
          this.userName = parsed.name || 'Test User';
          this.profile.email = parsed.email;
          this.profile.name = parsed.name || 'Test User';
          this.isAuthenticated = true;
        }
      } catch (e) {
        // Ignore JSON parse errors
      }
    }
    
    // Resolve Grafana host dynamically based on deployment location
    const host = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
    const rawGrafanaUrl = `http://${host}:3000/d/streaming-hub-metrics?orgId=1&kiosk`;
    this.safeGrafanaUrl = this.sanitizer.bypassSecurityTrustResourceUrl(rawGrafanaUrl);

    // Perform Grafana container health check
    this.checkGrafanaHealth(host);

    // Live metrics pulse timer for fallback telemetry dashboard
    this.metricsTimer = setInterval(() => {
      this.latency = 12 + Math.floor(Math.random() * 5);
      this.activeViewers = 1420 + Math.floor(Math.random() * 25);
      this.cdr.detectChanges();
    }, 3000);

    this.messageListener = (event: MessageEvent) => {
      if (event.data && event.data.type === AUTH_EVENT_TYPE) {
        const { user } = event.data.payload;
        this.userEmail = user.email;
        this.userName = user.name;
        this.profile.email = user.email;
        this.profile.name = user.name;
        this.isAuthenticated = true;
        this.cdr.detectChanges();
        console.log('Angular Settings MFE: Authenticated via @streaming-hub/shared-data!');
      }
    };

    window.addEventListener('message', this.messageListener);
  }

  private checkGrafanaHealth(host: string) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1500);

    fetch(`http://${host}:3000/api/health`, { mode: 'no-cors', signal: controller.signal })
      .then(() => {
        clearTimeout(timeoutId);
        this.isGrafanaOnline = true;
        this.isCheckingGrafana = false;
        this.cdr.detectChanges();
      })
      .catch(() => {
        clearTimeout(timeoutId);
        this.isGrafanaOnline = false;
        this.isCheckingGrafana = false;
        this.cdr.detectChanges();
      });
  }

  ngOnDestroy() {
    if (this.messageListener) {
      window.removeEventListener('message', this.messageListener);
    }
    if (this.metricsTimer) {
      clearInterval(this.metricsTimer);
    }
  }
}
