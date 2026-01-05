/**
 * ===============================================
 * EVERYDAY PRO - POMODORO TIMER
 * 25min Focus / 5min Break - Deep Work Support
 * ===============================================
 */

const Pomodoro = {
    WORK_DURATION: 25 * 60,  // 25 dakika
    BREAK_DURATION: 5 * 60,  // 5 dakika mola
    
    remaining: 25 * 60,
    isRunning: false,
    isBreak: false,
    interval: null,
    
    /**
     * Initialize Pomodoro from saved state
     */
    init() {
        const saved = localStorage.getItem('ev_pomodoro');
        if (saved) {
            const state = JSON.parse(saved);
            this.remaining = state.remaining || this.WORK_DURATION;
            this.isBreak = state.isBreak || false;
        }
        this.updateDisplay();
        return this;
    },
    
    /**
     * Start/Pause toggle
     */
    toggle() {
        if (this.isRunning) {
            this.pause();
        } else {
            this.start();
        }
    },
    
    /**
     * Start timer
     */
    start() {
        this.isRunning = true;
        this.updateUI();
        
        this.interval = setInterval(() => this.tick(), 1000);
        
        // Play start sound (optional visual feedback)
        const btn = document.getElementById('pomodoro-btn');
        if (btn) btn.classList.add('running');
    },
    
    /**
     * Pause timer
     */
    pause() {
        this.isRunning = false;
        clearInterval(this.interval);
        this.interval = null;
        this.save();
        this.updateUI();
        
        const btn = document.getElementById('pomodoro-btn');
        if (btn) btn.classList.remove('running');
    },
    
    /**
     * Reset timer
     */
    reset() {
        this.pause();
        this.remaining = this.isBreak ? this.BREAK_DURATION : this.WORK_DURATION;
        this.updateDisplay();
        this.save();
    },
    
    /**
     * Skip to break or work
     */
    skip() {
        this.pause();
        this.isBreak = !this.isBreak;
        this.remaining = this.isBreak ? this.BREAK_DURATION : this.WORK_DURATION;
        this.updateDisplay();
        this.updateUI();
        this.save();
    },
    
    /**
     * Countdown tick
     */
    tick() {
        this.remaining--;
        this.updateDisplay();
        
        if (this.remaining <= 0) {
            this.complete();
        }
        
        // Save every 10 seconds
        if (this.remaining % 10 === 0) {
            this.save();
        }
    },
    
    /**
     * Timer complete
     */
    complete() {
        this.pause();
        
        if (this.isBreak) {
            // Break is over, start work
            this.showNotification('💪 ' + (i18n.t('pomodoroWorkTime') || 'Çalışma zamanı!'));
            this.isBreak = false;
            this.remaining = this.WORK_DURATION;
        } else {
            // Work is over, start break
            this.showNotification('🍅 ' + (i18n.t('pomodoroComplete') || 'Pomodoro tamamlandı! Mola zamanı.'));
            this.isBreak = true;
            this.remaining = this.BREAK_DURATION;
        }
        
        this.updateDisplay();
        this.updateUI();
        this.save();
    },
    
    /**
     * Update time display
     */
    updateDisplay() {
        const timeEl = document.getElementById('pomodoro-time');
        if (timeEl) {
            timeEl.textContent = this.formatTime(this.remaining);
        }
    },
    
    /**
     * Update UI state (icons, classes)
     */
    updateUI() {
        const btn = document.getElementById('pomodoro-btn');
        const icon = document.querySelector('#pomodoro-btn [data-lucide]');
        
        if (btn) {
            btn.classList.toggle('break', this.isBreak);
            btn.classList.toggle('running', this.isRunning);
        }
        
        // Refresh icons
        if (window.lucide) lucide.createIcons();
    },
    
    /**
     * Format seconds to mm:ss
     */
    formatTime(seconds) {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    },
    
    /**
     * Show notification toast
     */
    showNotification(message) {
        if (window.App) {
            App.showToast(message, 'success');
        }
        
        // Browser notification if permitted
        if (Notification.permission === 'granted') {
            new Notification('Everyday Pro', { body: message, icon: '🍅' });
        }
    },
    
    /**
     * Request notification permission
     */
    requestPermission() {
        if ('Notification' in window && Notification.permission === 'default') {
            Notification.requestPermission();
        }
    },
    
    /**
     * Save state to localStorage
     */
    save() {
        localStorage.setItem('ev_pomodoro', JSON.stringify({
            remaining: this.remaining,
            isBreak: this.isBreak
        }));
    }
};

// Export globally
window.Pomodoro = Pomodoro;
