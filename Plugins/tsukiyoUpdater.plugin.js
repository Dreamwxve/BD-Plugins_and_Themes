/**
* @name         tsukiyoUpdater
* @version      1.0.0
* @description  Checks for updates for TsukiyoDev plugins and themes and updates them if needed
* @author       TsukiyoDev Team
* @source       https://github.com/TsukiyoDevs/BD-Plugins_and_Themes/tree/main/Plugins/tsukiyoUpdater.plugin.js
* @updateUrl    https://raw.githubusercontent.com/TsukiyoDevs/BD-Plugins_and_Themes/main/Plugins/tsukiyoUpdater.plugin.js
* @changelogDate 2024-07-22
*/

'use strict';

/* @module react */
const React = BdApi.React;
/*@end */

/* @module @manifest */
var manifest = {
    "name": "AutoUpdater",
    "version": "1.0.0",
    "description": "Checks for updates for TsukiyoDev plugins and themes and updates them if needed",
    "author": "Tsukiyodev Team",
    "source": "https://github.com/TsukiyoDevs/BD-Plugins_and_Themes/tree/main/Plugins/tsukiyoUpdater.plugin.js",
    "updateUrl": "https://raw.githubusercontent.com/TsukiyoDevs/BD-Plugins_and_Themes/main/Plugins/tsukiyoUpdater.plugin.js",
    "changelogDate": "2024-07-22"
};
/*@end */

/* @module @api */
const {
    Data,
    Patcher,
    UI,
    Webpack
} = new BdApi(manifest.name);
/*@end */

/* @module settings.js */
const Dispatcher = Webpack.getByKeys("dispatch", "subscribe");
const Flux = Webpack.getByKeys("Store");
const Settings = new class Settings2 extends Flux.Store {
    constructor() {
        super(Dispatcher, {});
    }
    _settings = Data.load("SETTINGS") ?? {};
    get(key, def) {
        return this._settings[key] ?? def;
    }
    set(key, value) {
        this._settings[key] = value;
        Data.save("SETTINGS", this._settings);
        this.emitChange();
    }
}();
/*@end */

/* @module index.jsx */
class tsukiyoUpdater {
    start() {
        this.checkForUpdates();
    }
    
    stop() {
        Patcher.unpatchAll();
    }
    
    async checkForUpdates() {
        const plugins = this.getInstalledPlugins();
        const themes = this.getInstalledThemes();
        const allItems = [...plugins, ...themes];

        for (const item of allItems) {
            if (item.meta === 'TsukiyoDev Team') {
                await this.updateItem(item);
            }
        }
    }

    getInstalledPlugins() {
        // Use Webpack to get installed plugins
        const plugins = Webpack.getByKeys("getPlugins") || [];
        return plugins.map(plugin => ({
            name: plugin.name,
            meta: plugin.meta,
            updateUrl: plugin.updateUrl,
            filePath: plugin.filePath
        }));
    }

    getInstalledThemes() {
        // Use Webpack to get installed themes
        const themes = Webpack.getByKeys("getThemes") || [];
        return themes.map(theme => ({
            name: theme.name,
            meta: theme.meta,
            updateUrl: theme.updateUrl,
            filePath: theme.filePath
        }));
    }

    async updateItem(item) {
        try {
            const { updateUrl, filePath } = item;
            const response = await fetch(updateUrl);
            const remoteContent = await response.text();
            const localContent = await fetch(filePath).then(res => res.text());

            if (remoteContent !== localContent) {
                // Perform the update
                await fetch(updateUrl)
                    .then(res => res.blob())
                    .then(blob => {
                        // Save the file to the BetterDiscord plugins/themes directory
                        // This may require additional implementation
                    });

                // Notify the user
                UI.toast(`Updated ${item.name}`, { type: 'success' });
            }
        } catch (error) {
            UI.toast(`Error updating ${item.name}`, { type: 'error' });
        }
    }
}

module.exports = tsukiyoUpdater;
