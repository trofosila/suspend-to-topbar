"use strict";

const { Gio, GObject, St } = imports.gi;
const { main, panelMenu } = imports.ui;
const SystemActions = imports.misc.systemActions;

const Config = imports.misc.config;
const SHELL_MINOR = parseInt(Config.PACKAGE_VERSION.split(".")[1]);

let SuspendIndicator = class SuspendIndicator extends panelMenu.Button {
  _init() {
    super._init(0.0, `Suspend Indicator`, false);

    let suspend = new St.Icon({
      gicon: new Gio.ThemedIcon({ name: "media-playback-pause-symbolic" }),
      style_class: "system-status-icon",
    });
    this.add_child(suspend);

    this._systemActions = new SystemActions.getDefault();
    this.connect("button-press-event", () => {
      this._systemActions.activateSuspend();
    });
  }
};

// In gnome-shell >= 3.32 this class and several others became GObject
// subclasses. We can account for this change in a backwards-compatible way
// simply by re-wrapping our subclass in `GObject.registerClass()`
if (SHELL_MINOR > 30) {
  SuspendIndicator = GObject.registerClass(
    { GTypeName: "SuspendIndicator" },
    SuspendIndicator
  );
}

let indicator = null;

function enable() {
  indicator = new SuspendIndicator();

  main.panel.addToStatusArea(`Suspend Indicator`, indicator);
}

function disable() {
  if (indicator !== null) {
    indicator.destroy();
    indicator = null;
  }
}
