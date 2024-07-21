/**
 * @name InviteInformation
 * @version 1.0.1
 * @description Shows epic info about an invite!
 * @author TsukiyoDev Team
 * @authorId 981755777754755122
 * @invite sJRAsZaYry
 * @donate https://ko-fi.com/tsukiyodev
 * @source https://github.com/TsukiyoDevs/BetterDiscord-Plugins/tree/main/Plugins/InviteInformation
 * @updateUrl https://github.com/TsukiyoDevs/BetterDiscord-Plugins/blob/main/Plugins/InviteInformation/InviteInformation.plugin.js
 * @changelogDate 2024-07-21
 */

'use strict';

/* @module react */
const React = BdApi.React;
/*@end */

/* @module @manifest */
var manifest = {
    "name": "InviteInformation",
    "version": "1.0.1",
    "description": "Shows epic info about an invite!",
    "author": "TsukiyoDev Team",
    "authorId": "981755777754755122",
    "invite": "sJRAsZaYry",
    "donate": "https://ko-fi.com/tsukiyodev",
    "source": "https://github.com/TsukiyoDevs/BetterDiscord-Plugins/tree/main/Plugins/InviteInformation",
    "changelog": [
/* 
--- Types
> "added": For new features or additions.
> "fixed": For bug fixes or resolved issues.
> "changed": For changes to existing features or functionalities.
> "removed": For features or functionalities that have been removed.
> "deprecated": For features that are no longer recommended or will be removed in the future.
> "security": For updates related to security improvements or fixes.

*/
        {
            "title": "New stuff",
            "type": "Added",
            "items": [
                "Added \"Copy Server ID\""
            ]
        },
        {
            "title": "Removed things",
            "type": "removed",
            "items": [
                "Option to choose the invite splash image, it is now the servers banner for now on"
            ]
        }
    ],
    "changelogDate": "2024-07-21"
};

/*@end */

/* @module @api */
const {
    Components,
    ContextMenu,
    Data,
    DOM,
    Net,
    Patcher,
    Plugins,
    ReactUtils,
    Themes,
    UI,
    Utils,
    Webpack
} = new BdApi(manifest.name);
/*@end */

/* @module @styles */

var Styles = {
    sheets: [],
    _element: null,
    load() {
        DOM.addStyle(this.sheets.join("\n"));
    },
    unload() {
        DOM.removeStyle();
    }
};
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

/* @module settings.json */
var SettingsItems = [
    {
        type: "switch",
        name: "Show Description",
        note: "Show the servers description, if they have one",
        id: "showGuildDescription",
        value: true
    },
    {
        type: "switch",
        name: "Show Boost Level",
        note: "See the boost level of the server and how many boosts",
        id: "showBoostLevel",
        value: true
    },
    {
        type: "switch",
        name: "Show Invite Owner",
        note: "Curious on who made the invite?",
        id: "showInviter",
        value: true
    },
    {
        type: "switch",
        name: "Show Verification Level",
        note: "See what verification level is set on the server",
        id: "showVerificationLevel",
        value: true
    },
    {
        type: "switch",
        name: "Show NSFW",
        note: "See if the server is 18+ or not",
        id: "showNSFW",
        value: true
    },
    {
        type: "switch",
        name: "Show Invite Expiration",
        note: "handy to know when the invite expires",
        id: "showInviteExpiry",
        value: true
    },
    {
        type: "switch",
        name: "Show Server ID",
        note: "Wanna be able to copy the server id?",
        id: "showServerID",
        value: false
    }
];
/*@end */

/* @module settings.jsx */
const useStateFromStores = Webpack.getByStrings("useStateFromStores", {
    searchExports: true
});
const {
    FormDivider,
    FormSwitch,
    FormText,
    FormTitle,
    Select
} = Webpack.getByKeys("Select");

function Dropdown(props) {
    return React.createElement("div", {
        style: {
            marginBottom: "20px"
        }
    }, React.createElement(
        FormTitle, {
            tag: "h3",
            style: {
                margin: "0px",
                color: "var(--header-primary)"
            }
        },
        props.name
    ), props.note && React.createElement(
        FormText, {
            type: FormText.Types.DESCRIPTION,
            style: {
                marginBottom: "5px"
            }
        },
        props.note
    ), React.createElement(
        Select, {
            closeOnSelect: true,
            options: props.options,
            serialize: (v) => String(v),
            select: (v) => Settings.set(props.id, v),
            isSelected: (v) => Settings.get(props.id, props.value) === v
        }
    ), React.createElement(FormDivider, {
        style: {
            marginTop: "20px"
        }
    }));
}

function Switch(props) {
    const value = useStateFromStores([Settings], () => Settings.get(props.id, props.value));
    return React.createElement(
        FormSwitch, {
            ...props,
            value,
            children: props.name,
            onChange: (v) => {
                Settings.set(props.id, v);
            }
        }
    );
}

function renderSettings(items) {
    return items.map((item) => {
        switch (item.type) {
            case "dropdown":
                return React.createElement(Dropdown, {
                    ...item
                });
            case "switch":
                return React.createElement(Switch, {
                    ...item
                });
            default:
                return null;
        }
    });
}

function SettingsPanel() {
    return React.createElement("div", {
        className: "settings-panel"
    }, renderSettings(SettingsItems));
}

/*@end */

/* @module changelog.scss */
Styles.sheets.push("/* changelog.scss */", `.Changelog-Title-Wrapper {
  font-size: 20px;
  font-weight: 600;
  font-family: var(--font-display);
  color: var(--header-primary);
  line-height: 1.2;
}
.Changelog-Title-Wrapper div {
  font-size: 12px;
  font-weight: 400;
  font-family: var(--font-primary);
  color: var(--primary-300);
  line-height: 1.3333333333;
}

.Changelog-Banner {
  width: 405px;
  border-radius: 8px;
  margin-bottom: 20px;
}

.Changelog-Item {
  color: #c4c9ce;
}
.Changelog-Item .Changelog-Header {
  display: flex;
  text-transform: uppercase;
  font-weight: 700;
  align-items: center;
  margin-bottom: 10px;
}
.Changelog-Item .Changelog-Header.added {
  color: #45BA6A;
}
.Changelog-Item .Changelog-Header.fixed {
  color: #EC4245;
}
.Changelog-Item .Changelog-Header.improved {
  color: #5865F2;
}
.Changelog-Item .Changelog-Header::after {
  content: "";
  flex-grow: 1;
  height: 1px;
  margin-left: 7px;
  background: currentColor;
}
.Changelog-Item span {
  display: list-item;
  list-style: inside;
  margin-left: 5px;
}
.Changelog-Item span::marker {
  color: var(--background-accent);
}`); /*@end */

/* @module index.jsx */
class BetterInvites {
    start() {
        this.showChangelog();
        this.patchInvite();
        Styles.load();
    }
    stop() {
        Patcher.unpatchAll();
        Styles.unload();
    }
    showChangelog() {
        if (!manifest.changelog.length || Settings.get("lastVersion") === manifest.version) return;
        const i18n = Webpack.getByKeys("getLocale");
        const formatter = new Intl.DateTimeFormat(i18n.getLocale(), {
            month: "long",
            day: "numeric",
            year: "numeric"
        });
        const title = React.createElement("div", {
            className: "Changelog-Title-Wrapper"
        }, React.createElement("h1", null, "What's New - ", manifest.name), React.createElement("div", null, formatter.format(new Date(manifest.changelogDate)), " - v", manifest.version));
        const items = manifest.changelog.map((item) => React.createElement("div", {
            className: "Changelog-Item"
        }, React.createElement("h4", {
            className: `Changelog-Header ${item.type}`
        }, item.title), item.items.map((item2) => React.createElement("span", null, item2))));
        "changelogImage" in manifest && items.unshift(
            React.createElement("img", {
                className: "Changelog-Banner",
                src: manifest.changelogImage
            })
        );
        Settings.set("lastVersion", manifest.version);
        UI.alert(title, items);
    }
    patchInvite() {
        const [Invite, Key] = Webpack.getWithKey(Webpack.Filters.byStrings("invite", "author", "guild", ".premium_subscription_count"));
        const Styles2 = Webpack.getByKeys("markup");
        Patcher.after(Invite, Key, (_, [props], res) => {
            const guild = res.props.children[0].props.guild;
            const inviter = props.invite.inviter;
            let expireTooltip;
            if (Settings.get("showInviteExpiry", true) && props.invite.expires_at) {
                const expiresAt = new Date(props.invite.expires_at);
                const expiresIn = expiresAt - Date.now();
                const days = Math.floor(expiresIn / 1e3 / 60 / 60 / 24);
                const hours = Math.floor(expiresIn / 1e3 / 60 / 60);
                const minutes = Math.floor(expiresIn / 1e3 / 60);
                if (days > 0) expireTooltip = `${days} day${days !== 1 ? "s" : ""}`;
                else if (hours > 0) expireTooltip = `${hours} hour${hours !== 1 ? "s" : ""}`;
                else expireTooltip = `${minutes} minute${minutes !== 1 ? "s" : ""}`;
            }
            
            const icons = [];
            if (Settings.get("showBoostLevel", true) && guild.premiumTier > 0) {
                icons.push(
                    React.createElement(Components.Tooltip, {
                        text: `Boost Level ${guild.premiumTier}`
                    }, (props2) => React.createElement("img", {
                        ...props2,
                        style: {
                            height: "28px",
                            borderRadius: "5px",
                            objectFit: "contain"
                        },
                        src: "https://discord.com/assets/4a2618502278029ce88adeea179ed435.svg"
                    }))
                );
            }
            if (Settings.get("showInviter", true) && inviter) {
                icons.push(
                    React.createElement(Components.Tooltip, {
                        text: `Invited by ${inviter.username}`
                    }, (props2) => React.createElement(
                        "img", {
                            ...props2,
                            style: {
                                height: "28px",
                                borderRadius: "5px",
                                objectFit: "contain"
                            },
                            src: `https://cdn.discordapp.com/avatars/${inviter?.id}/${inviter?.avatar}.png?size=1024`,
                            onError: (e) => {
                                e.target.src = "https://cdn.discordapp.com/embed/avatars/0.png";
                            },
                            onClick: () => {
                                DiscordNative.clipboard.copy(inviter.id);
                                BdApi.showToast("Copied ID", {
                                    type: "info",
                                    icon: true,
                                    timeout: 4e3
                                });
                            }
                        }
                    ))
                );
            }
            if (Settings.get("showVerificationLevel", true) && guild.verificationLevel > 0) {
                icons.push(
                    React.createElement(Components.Tooltip, {
                        text: `Verification Level ${guild.verificationLevel}`
                    }, (props2) => React.createElement("img", {
                        ...props2,
                        style: {
                            height: "28px",
                            borderRadius: "5px",
                            objectFit: "contain"
                        },
                        src: "https://discord.com/assets/e62b930d873735bbede7ae1785d13233.svg"
                    }))
                );
            }
            if (Settings.get("showNSFW", true) && guild.nsfw_level) {
                icons.push(
                    React.createElement(Components.Tooltip, {
                        text: "NSFW"
                    }, (props2) => React.createElement("img", {
                        ...props2,
                        style: {
                            height: "28px",
                            borderRadius: "5px",
                            objectFit: "contain"
                        },
                        src: "https://discord.com/assets/ece853d6c1c1cd81f762db6c26fade40.svg"
                    }))
                );
            }
            if (Settings.get("showInviteExpiry", true) && props.invite.expires_at) {
                icons.push(
                    React.createElement(Components.Tooltip, {
                        text: `Invite expires in ${expireTooltip}`
                    }, (props2) => React.createElement("img", {
                        ...props2,
                        style: {
                            height: "28px",
                            borderRadius: "5px",
                            objectFit: "contain"
                        },
                        src: "https://discord.com/assets/7a844e444413cf4c3c46.svg"
                    }))
                );
            }
            if (Settings.get("showServerID", false)) {
                icons.push(
                    React.createElement(Components.Tooltip, {
                        text: "Copy Server ID"
                    }, (props2) => React.createElement(
                        "img", {
                            ...props2,
                            style: {
                                height: "28px",
                                borderRadius: "5px",
                                objectFit: "contain"
                            },
                            src: "https://www.svgrepo.com/show/233928/id-card-pass.svg",
                            onClick: () => {
                                DiscordNative.clipboard.copy(guild.id);
                                BdApi.showToast("Copied Server ID", {
                                    type: "info",
                                    icon: true,
                                    timeout: 4e3
                                });
                            }
                        }
                    ))
                );
            }
    
            // Adjust the rendering to include the icons in a grid
            res.props.children[2].props.children.splice(
                1,
                0,
                React.createElement("div", {
                    className: `${manifest.name}-iconWrapper`,
                    style: {
                        display: "grid",
                        gridTemplateColumns: "auto auto",
                        gridGap: "3px",
                        direction: "rtl",
                        alignItems: "center"
                    }
                }, icons)
            );
    
            if (Settings.get("showGuildDescription", true) && guild.description) {
                const index = res.props.children[2].props.children.findIndex((e) => e.type.displayName === "InviteButton.Button");
                res.props.children[2].props.children.splice(
                    index,
                    0,
                    React.createElement("div", {
                        className: `${manifest.name}-guildDescription`,
                        style: {
                            marginTop: "-14px",
                            width: "100%"
                        }
                    }, React.createElement("div", {
                        className: Styles2.markup
                    }, guild.description))
                );
            }
            if (Settings.get("bannerType", "BetterInvites") === "BetterInvites" && guild.banner) {
                if (guild.features.has("INVITE_SPLASH")) res.props.children.splice(0, 1);
                res.props.children.splice(
                    1,
                    0,
                    React.createElement("div", {
                        className: `${manifest.name}-banner`,
                        style: {
                            position: "relative",
                            borderRadius: "4px",
                            height: "92px",
                            margin: "-6px 0 8px 0",
                            overflow: "hidden"
                        }
                    }, React.createElement(
                        "img", {
                            style: {
                                display: "block",
                                width: "100%",
                                height: "100%",
                                objectFit: "cover"
                            },
                            src: `https://cdn.discordapp.com/banners/${guild.id}/${guild.banner}.gif?size=1024`,
                            onError: (e) => {
                                e.target.onError = null;
                                e.target.src = `https://cdn.discordapp.com/banners/${guild.id}/${guild.banner}.png?size=1024`;
                            }
                        }
                    ))
                );
            }
        });
    }
    getSettingsPanel() {
        return React.createElement(SettingsPanel, null);
    }
}

/*@end */

module.exports = BetterInvites;