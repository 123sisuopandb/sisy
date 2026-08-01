/**
 * PKF Mnemonic Seeds Local Nav Fix
 *
 * MnemonicSeeds.navigateToPage() (used by random/jump/apply-options/
 * address-type tabs) generates extensionless URLs like:
 *     /mnemonic-seeds/bitcoin/2
 * which require server-side rewrites (Netlify/Apache). This static
 * preview host serves .html files directly, so we append ".html" to
 * any mnemonic-seeds path before navigation.
 */
(function () {
    'use strict';

    function fixMnemonicPath(url) {
        if (typeof url !== 'string') return url;
        if (url.indexOf('://') !== -1) return url;

        // /mnemonic-seeds/<chain>/<page>[?query]
        var m = url.match(/^([^?#]*\/mnemonic-seeds\/[^\/?#]+\/[^\/?#]+)([?#].*)?$/);
        if (m) {
            var lastSeg = m[1].substring(m[1].lastIndexOf('/') + 1);
            if (lastSeg.indexOf('.') === -1) {
                return m[1] + '.html' + (m[2] || '');
            }
            return url;
        }

        // /mnemonic-seeds/<chain>[?query]
        var m2 = url.match(/^([^?#]*\/mnemonic-seeds\/[^\/?#]+)([?#].*)?$/);
        if (m2) {
            var seg = m2[1].substring(m2[1].lastIndexOf('/') + 1);
            if (seg.indexOf('.') === -1) {
                return m2[1] + '.html' + (m2[2] || '');
            }
        }
        return url;
    }

    var LP = (typeof Location !== 'undefined') ? Location.prototype
                : Object.getPrototypeOf(window.location);
    var hd = Object.getOwnPropertyDescriptor(LP, 'href') || {};
    if (hd.set) {
        var origSet = hd.set;
        Object.defineProperty(LP, 'href', {
            get: hd.get,
            set: function (v) {
                origSet.call(this, fixMnemonicPath(v));
            },
            configurable: true
        });
    }
})();
