/**
 * ===============================================
 * EVERYDAY PRO - PRAYER SERVICE
 * Fetch and manage prayer times based on location
 * ===============================================
 */

const PrayerService = {
    API_BASE: 'https://api.aladhan.com/v1/timings',

    /**
     * Get user's current location via Geolocation API
     */
    async requestLocation() {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                reject(new Error('Geolocation is not supported by your browser'));
                return;
            }

            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const location = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };
                    resolve(location);
                },
                (error) => {
                    reject(error);
                }
            );
        });
    },

    /**
     * Fetch prayer times for a specific date and location
     */
    async fetchTimes(date, location) {
        // Format date as DD-MM-YYYY
        const dateObj = new Date(date);
        const day = String(dateObj.getDate()).padStart(2, '0');
        const month = String(dateObj.getMonth() + 1).padStart(2, '0');
        const year = dateObj.getFullYear();
        const dateStr = `${day}-${month}-${year}`;

        const url = `${this.API_BASE}/${dateStr}?latitude=${location.lat}&longitude=${location.lng}&method=13`; // Method 13: Diyanet

        try {
            const response = await fetch(url);
            const data = await response.json();
            
            if (data.code === 200) {
                return data.data.timings;
            } else {
                throw new Error('Failed to fetch prayer times');
            }
        } catch (error) {
            console.error('Error fetching prayer times:', error);
            throw error;
        }
    },

    /**
     * Update dynamic prayer habits with new times
     */
    updateHabitTimes(timings) {
        const prayerMap = {
            'h_sabah': timings.Fajr,
            'h_ogle': timings.Dhuhr,
            'h_ikindi': timings.Asr,
            'h_aksam': timings.Maghrib,
            'h_yatsi': timings.Isha
        };

        const habits = window.StateManager.get('habits');
        let updated = false;

        habits.forEach(habit => {
            if (prayerMap[habit.id]) {
                habit.intention.time = prayerMap[habit.id];
                updated = true;
            }
        });

        if (updated) {
            window.StateManager.setState('habits', habits);
        }
    },

    /**
     * Sync prayer times if needed (new day or new location)
     */
    async sync() {
        const state = window.StateManager.get();
        const settings = state.settings;
        const today = new Date().toISOString().split('T')[0];

        if (!settings.location) return;

        // Check if we already have today's times
        if (settings.cachedPrayerTimes[today]) {
            this.updateHabitTimes(settings.cachedPrayerTimes[today]);
            return;
        }

        try {
            const timings = await this.fetchTimes(today, settings.location);
            
            // Save to cache
            const newSettings = {
                ...settings,
                lastPrayerUpdate: today,
                cachedPrayerTimes: {
                    ...settings.cachedPrayerTimes,
                    [today]: timings
                }
            };
            
            window.StateManager.setState('settings', newSettings);
            this.updateHabitTimes(timings);
            
            console.log('Prayer times synced successfully');
        } catch (error) {
            console.error('Prayer times sync failed:', error);
        }
    }
};

window.PrayerService = PrayerService;
