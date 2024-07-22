/**
 * @name noBrokenMentions
 * @description Fetches user information when clicking on a user mention and replaces the mention with the username.
 * @version 1.0.0
 * @updateUrl https://raw.githubusercontent.com/YourGitHubUsername/BetterDiscord-Plugins/main/Plugins/noBrokenMentions/noBrokenMentions.plugin.js
 * @author TsukiyoDev Team
 * @authorId 981755777754755122
 * @invite sJRAsZaYry
 * @authorLink https://github.com/TsukiyoDevs
 * @website https://github.com/YourGitHubUsername/noBrokenMentions
 * @source https://github.com/TsukiyoDevs/BetterDiscord-Plugins/tree/main/Plugins/noBrokenMentions
 */

module.exports = (() => {
    const config = {
        info: {
            name: "noBrokenMentions",
            version: "1.0.1",
            description: "Fetches user information when clicking on a user mention and replaces the mention with the username.",
            github: "https://github.com/YourGitHubUsername/noBrokenMentions",
            github_raw: "https://raw.githubusercontent.com/YourGitHubUsername/noBrokenMentions/main/noBrokenMentions.plugin.js"
        },
        changelog: [
            {
                title: "1.0.1",
                type: "added",
                items: [
                    "Added confirmation popup before fetching user profile."
                ]
            }
        ]
    };

    return !global.ZeresPluginLibrary ? class {
        constructor() { this._config = config; }
        getName() { return config.info.name; }
        getAuthor() { return config.info.authors.map(a => a.name).join(", "); }
        getDescription() { return config.info.description; }
        getVersion() { return config.info.version; }
        load() { BdApi.showConfirmationModal("Library Missing", `The library plugin needed for ${config.info.name} is missing. Please click Download Now to install it.`, {
            confirmText: "Download Now",
            cancelText: "Cancel",
            onConfirm: () => {
                require("request").get("https://betterdiscord.app/gh-raw/rauenzi/BDPluginLibrary/master/release/0PluginLibrary.plugin.js", async (error, response, body) => {
                    if (error) return require("electron").shell.openExternal("https://betterdiscord.app/Download?id=9");
                    await new Promise(r => require("fs").writeFile(require("path").join(BdApi.Plugins.folder, "0PluginLibrary.plugin.js"), body, r));
                });
            }
        }); }
        start() {}
        stop() {}
    } : (([Plugin, Api]) => {
        const plugin = (Plugin, Api) => {
            const { ReactTools, Modals } = Api;

            return class noBrokenMentions extends Plugin {
                constructor() {
                    super();
                    this.handleClick = this.handleClick.bind(this);
                }

                onStart() {
                    this.addClickListener();
                }

                onStop() {
                    this.removeClickListener();
                }

                addClickListener() {
                    document.addEventListener("click", this.handleClick);
                }

                removeClickListener() {
                    document.removeEventListener("click", this.handleClick);
                }

                handleClick(event) {
                    const target = event.target;
                    if (target && target.classList.contains('mention')) {
                        const reactInstance = ReactTools.getReactInstance(target);
                        if (!reactInstance) return;
                        const userId = reactInstance.return.return.return.memoizedProps.children[0].props.id;
                        if (userId) {
                            Modals.showConfirmationModal("Confirmation", "Are you sure you want to load the profile?", {
                                confirmText: "Yes",
                                cancelText: "No",
                                onConfirm: () => {
                                    BdApi.findModuleByProps('fetchUserProfile').fetchUserProfile(userId).then(user => {
                                        if (user) {
                                            target.innerText = `@${user.username}`;
                                            target.classList.add('mention');
                                            target.setAttribute('data-user-id', userId);
                                        }
                                    });
                                }
                            });
                        }
                    }
                }
            };
        };
        return plugin(Plugin, Api);
    })(global.ZeresPluginLibrary.buildPlugin(config));
})();