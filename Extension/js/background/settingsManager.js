var settings = null;

function updateSetting(setting, value) {
	chrome.storage.sync.get('settings', function(result) {
		settings = result.settings;

		settings[setting].value = value;
		chrome.storage.sync.set({ settings: settings });
	});
}
//* Retrieve options if set
chrome.storage.sync.get('settings', function(result) {
	settings = result.settings;

	if (!settings) {
		PMD_info('Creating default settings...');
		settings = {
			enabled: {
				string: 'popup.setting.enabled',
				value: true
			},
			mediaKeys: {
				string: 'popup.setting.mediaControl',
				value: true
			},
			titleMenubar: {
				string: 'popup.setting.titleMenubar',
				value: true
			},
			autoLaunch: {
				string: 'popup.setting.autoLaunch',
				value: true
			},
			language: {
				string: 'popup.setting.language',
				value: chrome.i18n.getUILanguage(),
				show: false
			}
		};

		chrome.storage.sync.set({ settings: settings }, function() {
			updateLanguages();
			loadLanguages();
		});

		saveSettings();
		return;
	}

	initSetting('enabled', 'popup.setting.enabled');
	initSetting('autoLaunch', 'popup.setting.autoLaunch');
	initSetting('mediaKeys', 'popup.setting.mediaKeys');
	initSetting('titleMenubar', 'popup.setting.titleMenubar');
	initSetting('language', chrome.i18n.getUILanguage(), 'popup.setting.language', false);
});

function initSetting(setting, string, option = true, show = true) {
	if (!settings) {
		chrome.storage.sync.get('settings', function(result) {
			settings = result.settings;

			if (settings && !settings[setting]) cOption(setting, string, option, show);
		});
	} else if (settings && !settings[setting]) cOption(setting, string, option, show);
}

function cOption(setting, string, option, show) {
	if (!settings[setting]) {
		PMD_info(`Creating option for ${setting}`);
		settings[setting] = {
			string: string,
			value: option
		};

		if (show) settings[setting].show = show;

		chrome.storage.sync.set({ settings: settings }, function() {
			updateLanguages();
			loadLanguages();
		});
		saveSettings();
	}
}

function saveSettings() {
	if (socket.connected) socket.emit('optionUpdate', settings);
	else {
		chrome.storage.local.set({ settingsAppUpdated: false });
	}
}
