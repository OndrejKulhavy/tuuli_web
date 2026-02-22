/**
 * Cookie Consent + PostHog Analytics
 * Shared across all tuuli.cz pages.
 * CSS is provided per-page to match each subpage's design.
 */
(function () {
    'use strict';

    var STORAGE_KEY = 'tuuli_cookie_consent';

    function getConsent() {
        try {
            return localStorage.getItem(STORAGE_KEY);
        } catch (e) {
            return null;
        }
    }

    function setConsent(value) {
        try {
            localStorage.setItem(STORAGE_KEY, value);
        } catch (e) {
            /* silent */
        }
    }

    /** Load PostHog and initialize */
    function loadPostHog() {
        !function(t,e){var o,n,p,r;e.__SV||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]),t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}(p=t.createElement("script")).type="text/javascript",p.async=!0,p.src=s.api_host.replace(".i.posthog.com","-assets.i.posthog.com")+"/static/array.js",(r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r);var u=e;for(void 0!==a?u=e[a]=[]:a="posthog",u.people=u.people||[],u.toString=function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e},u.people.toString=function(){return u.toString(1)+".people (stub)"},o="init capture register register_once register_for_session unregister opt_out_capturing has_opted_out_capturing opt_in_capturing reset isFeatureEnabled getFeatureFlag getFeatureFlagPayload reloadFeatureFlags group identify setPersonProperties setPersonPropertiesForFlags resetPersonPropertiesForFlags setGroupPropertiesForFlags resetGroupPropertiesForFlags resetGroups onFeatureFlags addFeatureFlagsHandler onSessionId getSurveys getActiveMatchingSurveys renderSurvey canRenderSurvey getNextSurveyStep".split(" "),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);
        posthog.init('phc_JZggFpLaigK3oMLoXwRLthwg8jV1BEk04H3vy3vVKoL', {
            api_host: 'https://eu.i.posthog.com',
            defaults: '2026-01-30'
        });
    }

    /** Remove the banner from the DOM */
    function removeBanner() {
        var banner = document.getElementById('cookie-consent-banner');
        if (banner) {
            banner.style.opacity = '0';
            banner.style.transform = 'translateY(100%)';
            setTimeout(function () {
                banner.remove();
            }, 400);
        }
    }

    /** Handle accept */
    function accept() {
        setConsent('accepted');
        removeBanner();
        loadPostHog();
    }

    /** Handle decline */
    function decline() {
        setConsent('declined');
        removeBanner();
    }

    /** Create and show the banner */
    function showBanner() {
        var banner = document.createElement('div');
        banner.id = 'cookie-consent-banner';
        banner.setAttribute('role', 'dialog');
        banner.setAttribute('aria-label', 'Cookie consent');
        banner.innerHTML =
            '<div class="cookie-consent-inner">' +
                '<p class="cookie-consent-text">' +
                    'Tento web pou\u017e\u00edv\u00e1 cookies pro anal\u00fdzu n\u00e1v\u0161t\u011bvnosti. ' +
                    'Data zpracov\u00e1v\u00e1me anonymn\u011b pomoc\u00ed PostHog.' +
                '</p>' +
                '<div class="cookie-consent-buttons">' +
                    '<button type="button" class="cookie-btn cookie-btn-accept">P\u0159ijmout</button>' +
                    '<button type="button" class="cookie-btn cookie-btn-decline">Odm\u00edtnout</button>' +
                '</div>' +
            '</div>';

        document.body.appendChild(banner);

        /* Force reflow then animate in */
        banner.offsetHeight;
        banner.classList.add('cookie-consent-visible');

        banner.querySelector('.cookie-btn-accept').addEventListener('click', accept);
        banner.querySelector('.cookie-btn-decline').addEventListener('click', decline);
    }

    /** Init on DOM ready */
    function init() {
        var consent = getConsent();

        if (consent === 'accepted') {
            loadPostHog();
            return;
        }

        if (consent === 'declined') {
            return;
        }

        /* No choice yet — show banner */
        showBanner();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
