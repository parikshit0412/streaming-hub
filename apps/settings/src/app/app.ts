import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserProfile, AUTH_EVENT_TYPE } from '@streaming-hub/shared-data';

export interface DeviceSession {
  id: string;
  name: string;
  location: string;
  lastActive: string;
  isCurrent: boolean;
  icon: string;
}

@Component({
  imports: [CommonModule, RouterModule, FormsModule],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit, OnDestroy {
  protected title = 'settings';
  protected isIframe = false;
  protected isAuthenticated = false;

  // Active Settings Section Tab
  protected activeSection: 'profile' | 'playback' | 'telemetry' | 'security' = 'profile';

  // User Profile Form State
  protected profile: UserProfile = {
    name: 'Test User',
    email: 'user@streamhub.demo',
    plan: 'Premium 4K Ultra HD'
  };
  protected editName = 'Test User';
  protected editEmail = 'user@streamhub.demo';

  // Playback Preferences State
  protected videoQuality = 'Ultra HD (4K HDR)';
  protected audioOutput = 'Dolby Atmos 7.1';
  protected autoplayNext = true;
  protected autoplayPreviews = true;
  protected downloadQuality = 'High Quality (1080p)';

  // Telemetry Engine State
  protected latency = 14;
  protected activeViewers = 1428;
  protected bitrate = '14.8 Mbps';
  protected systemHealth = '99.98%';
  protected bufferRate = '0.02%';
  protected totalNodes = '24 / 24 Online';

  // Security & Connected Devices State
  protected twoFactorEnabled = true;
  protected devices: DeviceSession[] = [
    { id: '1', name: 'Chrome on Windows 11', location: 'New York, USA', lastActive: 'Active Now', isCurrent: true, icon: '💻' },
    { id: '2', name: 'StreamHub App on iPhone 15 Pro', location: 'New York, USA', lastActive: '2 hours ago', isCurrent: false, icon: '📱' },
    { id: '3', name: 'Samsung Smart TV 4K', location: 'Living Room', lastActive: 'Yesterday', isCurrent: false, icon: '📺' }
  ];

  // Toast Notification
  protected toastMessage: string | null = null;
  private toastTimer: any;
  private metricsTimer: any;
  private messageListener!: (event: MessageEvent) => void;

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.isIframe = typeof window !== 'undefined' && window.parent !== window;

    // Load saved session fallback on mount
    const savedSession = localStorage.getItem('streamhub_session');
    if (savedSession) {
      try {
        const parsed = JSON.parse(savedSession);
        if (parsed && parsed.email) {
          this.profile.email = parsed.email;
          this.profile.name = parsed.name || 'Test User';
          this.editEmail = parsed.email;
          this.editName = parsed.name || 'Test User';
          this.isAuthenticated = true;
        }
      } catch (e) {
        // Ignore JSON parse errors
      }
    }

    // Live metrics pulse simulation
    this.metricsTimer = setInterval(() => {
      this.latency = 12 + Math.floor(Math.random() * 5);
      this.activeViewers = 1420 + Math.floor(Math.random() * 25);
      this.cdr.detectChanges();
    }, 2500);

    // Cross-MFE Auth Message Listener
    this.messageListener = (event: MessageEvent) => {
      if (event.data && event.data.type === AUTH_EVENT_TYPE) {
        const { user } = event.data.payload;
        this.profile.email = user.email;
        this.profile.name = user.name;
        this.editEmail = user.email;
        this.editName = user.name;
        this.isAuthenticated = true;
        this.cdr.detectChanges();
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('message', this.messageListener);
    }
  }

  protected setSection(section: 'profile' | 'playback' | 'telemetry' | 'security') {
    this.activeSection = section;
  }

  protected saveProfile() {
    this.profile.name = this.editName;
    this.profile.email = this.editEmail;
    
    // Save updated session back to localStorage
    const savedSession = localStorage.getItem('streamhub_session');
    if (savedSession) {
      try {
        const parsed = JSON.parse(savedSession);
        parsed.name = this.editName;
        parsed.email = this.editEmail;
        localStorage.setItem('streamhub_session', JSON.stringify(parsed));
      } catch (e) {}
    }
    this.showToast('✓ Profile information updated successfully!');
  }

  protected savePlayback() {
    this.showToast('✓ Playback & Quality preferences saved!');
  }

  protected toggleTwoFactor() {
    this.twoFactorEnabled = !this.twoFactorEnabled;
    this.showToast(this.twoFactorEnabled ? '✓ Two-Factor Authentication enabled!' : '⚠️ Two-Factor Authentication disabled.');
  }

  protected revokeDevice(id: string) {
    this.devices = this.devices.filter(d => d.id !== id);
    this.showToast('✓ Device session revoked!');
  }

  protected revokeAllOtherDevices() {
    this.devices = this.devices.filter(d => d.isCurrent);
    this.showToast('✓ All other device sessions signed out!');
  }

  private showToast(msg: string) {
    this.toastMessage = msg;
    if (this.toastTimer) clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => {
      this.toastMessage = null;
      this.cdr.detectChanges();
    }, 3000);
    this.cdr.detectChanges();
  }

  ngOnDestroy() {
    if (typeof window !== 'undefined' && this.messageListener) {
      window.removeEventListener('message', this.messageListener);
    }
    if (this.metricsTimer) {
      clearInterval(this.metricsTimer);
    }
    if (this.toastTimer) {
      clearTimeout(this.toastTimer);
    }
  }
}
