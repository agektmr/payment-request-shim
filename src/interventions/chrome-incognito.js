/**
Copyright 2018 Google Inc.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

/**
 * README
 *
 * This intervention handles the scenario where there is a crash in Incognito
 * mode on Chrome's desktop platforms.
 *
 * https://bugs.chromium.org/p/chromium/issues/detail?id=813275
 *
 * FIX
 *
 * This code disables Payment Request in incognito mode on Desktop platforms for
 * versions 63, 64 and 65.
 */

/**
 * Disables Payment Request.
 */
function disablePaymentRequest() {
    delete window.PaymentRequest;
    delete window.PaymentAddress;
}

module.exports = (window, navigator) => {
  if (!window.PaymentRequest) {
    return;
  }

  const userAgent = navigator.userAgent;
  const iosChromeRegex = /.*CriOS.*/g;
  const androidChromeRegex = /.*Android.*Chrome.*/g;
  // Android and iOS are not affected.
  if (iosChromeRegex.exec(userAgent) !== null ||
      androidChromeRegex.exec(userAgent) !== null) {
    return;
  }

  const versionCheck = /.*Chrome\/(?:63|64|65)\.\d.*/g;
  const regexResult = versionCheck.exec(userAgent);
  if (regexResult !== null) {
    const fs = window.RequestFileSystem || window.webkitRequestFileSystem;
    if (fs) {
      fs(window.TEMPORARY,
         100,
         function() {},
         disablePaymentRequest);
    }
  }
};
