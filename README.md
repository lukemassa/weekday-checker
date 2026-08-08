## Weekday Checker

A chrome plugin that scans text input and emits a warning if the day of the week / date combo entered is invalid.

![Demo](assets/demo-v2.gif)

## Installation 

## Installation

Install [Weekday Checker in the Chrome Web Store](https://chromewebstore.google.com/detail/weekday-checker/phbbmhafgcohoiimbekcnnhoegcimfgm).

## Developing

### Setup

`npm install`

### Test

1. `npm run build`
2. Go to chrome://extensions
3. "Load Unpacked"
4. Select directory

### Release

1. `npm run package`
2. This creates `weekday-checker.zip`, which should be uploaded Chrome Web Store (TODO: how?)

## Known issues

- By default we assume the year is whatever is closest to now. However if the user explicitly types a year, we should validate off that.
