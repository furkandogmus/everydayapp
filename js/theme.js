/**
 * ===============================================
 * EVERYDAY PRO - THEME MANAGEMENT
 * Light / Dark Mode Logic
 * ===============================================
 */

const Theme = {
    current: 'dark',

    /**
     * Initialize theme - load from localStorage or system preference
     */
    init() {
        const savedTheme = localStorage.getItem('ev_theme');
        const systemPreference = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
        
        this.current = savedTheme || systemPreference;
        this.apply();
        return this;
    },

    /**
     * Apply current theme to document
     */
    apply() {
        document.documentElement.setAttribute('data-theme', this.current);
        localStorage.setItem('ev_theme', this.current);
        this.updateToggleIcon();
    },

    /**
     * Toggle between light and dark themes
     */
    toggle() {
        this.current = this.current === 'dark' ? 'light' : 'dark';
        this.apply();
    },

    /**
     * Update the toggle button icon recursively
     */
    updateToggleIcon() {
        const btn = document.getElementById('theme-toggle-btn');
        if (!btn) return;

        const icon = btn.querySelector('[data-lucide]');
        if (!icon) return;

        // Toggle icon based on theme
        // If current is dark, we want to show 'sun' for switching to light
        // If current is light, we want to show 'moon' for switching to dark
        const newIconName = this.current === 'dark' ? 'sun' : 'moon';
        icon.setAttribute('data-lucide', newIconName);
        
        // Refresh lucide icons
        if (window.lucide) {
            window.lucide.createIcons();
        }
    }
};

// Export for use in other modules
window.Theme = Theme;
