## Weekday Checker

A browser extension that scans text input and emits a warning if the day of the week / date combo entered is invalid.

![Demo](assets/demo-v2.gif)
## Installation

### Chrome

Install [Weekday Checker in the Chrome Web Store](https://chromewebstore.google.com/detail/weekday-checker/phbbmhafgcohoiimbekcnnhoegcimfgm).

### Firefox

Install Weekday Checker from Firefox Add-ons. <!-- TODO: add link once published -->

## How it works

The plugin watches text being written into text boxes and scans for snippets that look like dates including the day of the week. It then looks at the date closest to now, in the period 6 months ago to 6 months from now, and determines what day of the week that is. If that date differs from the one written in the text, it pops up a simple alert.

After you clear the alert, it doesn't warn you again about that specific date in that specific text field.

It is designed to be non-invasive, doesn't make any external calls, and doesn't store any information anywhere.

## Developing

### Setup

`npm install`

### Test

#### Chrome

1. `npm run build`
2. Go to chrome://extensions
3. "Load Unpacked"
4. Select directory

#### Firefox

1. `npm run build`
2. `npx web-ext run`

### Release

1. `npm run package`
2. This creates `weekday-checker.zip`, which should be uploaded to:

   * Chrome Web Store (TODO: how?)
   * Firefox Add-ons

## Known issues

* By default we assume the year is whatever is closest to now. However if the user explicitly types a year, we should validate off that.

