# EU Orders + EUR Payment Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a country selector to `order.html` so customers across the EU can order, with CZK pricing for Czech orders and fixed EUR pricing for all other EU countries, using the existing Make.com + Packeta pipeline.

**Architecture:** A `<select>` for country is added to the form. When the country changes, the price/currency display updates and the Packeta widget is reconfigured for that country. The Make.com payload gains `country` and the correct `currency`/`unitPrice`/`totalPrice` fields. In Make.com a Router branches on `currency` — CZK goes to the existing CZK invoice flow, EUR triggers a parallel EUR invoice + SEPA QR code flow.

**Tech Stack:** Vanilla HTML/JS, Packeta widget v6, Make.com webhooks

---

## Files

- Modify: `brave_breasts/order.html` — the only file; all changes are in-place

---

### Task 1: Add config vars, give currency span an ID, add country `<select>` HTML + CSS

**Files:**
- Modify: `brave_breasts/order.html`

- [ ] **Step 1: Add `UNIT_PRICE_EUR` and `SUPPORTED_COUNTRIES` to the JS config block**

Find the existing config block near line 1277:
```js
var WEBHOOK_URL = 'https://hook.eu1.make.com/xasecwlgdb71s1wfs5xp5n0skaaz6t8a';
var UNIT_PRICE  = 790;
```

Replace it with:
```js
var WEBHOOK_URL     = 'https://hook.eu1.make.com/xasecwlgdb71s1wfs5xp5n0skaaz6t8a';
var UNIT_PRICE      = 890;  // CZK — CZ orders
var UNIT_PRICE_EUR  = 36;   // EUR — all other EU orders (adjust to your fixed price)

/* Countries shown in the dropdown. Packeta operates pickup points in all of these. */
var SUPPORTED_COUNTRIES = [
    { code: 'cz', label: 'Česká republika', currency: 'CZK' },
    { code: 'sk', label: 'Slovensko',        currency: 'EUR' },
    { code: 'at', label: 'Rakousko',         currency: 'EUR' },
    { code: 'de', label: 'Německo',          currency: 'EUR' },
    { code: 'hu', label: 'Maďarsko',         currency: 'EUR' },
    { code: 'pl', label: 'Polsko',           currency: 'EUR' },
    { code: 'ro', label: 'Rumunsko',         currency: 'EUR' },
    { code: 'hr', label: 'Chorvatsko',       currency: 'EUR' },
    { code: 'si', label: 'Slovinsko',        currency: 'EUR' },
    { code: 'be', label: 'Belgie',           currency: 'EUR' },
    { code: 'fr', label: 'Francie',          currency: 'EUR' },
    { code: 'nl', label: 'Nizozemsko',       currency: 'EUR' },
    { code: 'bg', label: 'Bulharsko',        currency: 'EUR' }
];
```

- [ ] **Step 2: Give the currency span an ID**

Find (around line 1121):
```html
<span class="summary-price-currency">Kč</span>
```

Replace with:
```html
<span class="summary-price-currency" id="priceCurrency">Kč</span>
```

- [ ] **Step 3: Add country `<select>` as the first field inside the contact-details form-grid**

Find (around line 1132):
```html
                <div class="form-grid">
                        <div class="form-field">
                            <label for="fieldName">Jméno a příjmení</label>
```

Replace with:
```html
                <div class="form-grid">
                        <div class="form-field">
                            <label for="fieldCountry">Země doručení</label>
                            <select id="fieldCountry" name="country" autocomplete="country">
                                <!-- populated by JS -->
                            </select>
                            <span class="field-error" id="errCountry">Vyberte prosím zemi doručení.</span>
                        </div>

                        <div class="form-field">
                            <label for="fieldName">Jméno a příjmení</label>
```

- [ ] **Step 4: Add CSS for `select` to match the existing `input` style**

Find (around line 488):
```css
        .form-field input {
            font-family: var(--font-body);
            font-size: 0.95rem;
            color: var(--text-color);
            background: var(--bg-color);
            border: 1.5px solid transparent;
            border-radius: 10px;
            padding: 0.7rem 0.9rem;
            transition: border-color 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
            outline: none;
            width: 100%;
        }
```

Replace with:
```css
        .form-field input,
        .form-field select {
            font-family: var(--font-body);
            font-size: 0.95rem;
            color: var(--text-color);
            background: var(--bg-color);
            border: 1.5px solid transparent;
            border-radius: 10px;
            padding: 0.7rem 0.9rem;
            transition: border-color 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
            outline: none;
            width: 100%;
            appearance: none;
            -webkit-appearance: none;
            cursor: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='32' viewBox='0 0 24 32'%3E%3Cpath d='M2 2 L2 24 L8 18 L14 28 L18 26 L12 16 L20 16 Z' fill='%23ff8fa0' stroke='%23e8909c' stroke-width='1.5' stroke-linejoin='round'/%3E%3C/svg%3E") 2 2, pointer;
        }
```

Also find:
```css
        .form-field input:focus {
            border-color: var(--accent-color);
            background: var(--white);
            box-shadow: 0 0 0 3px rgba(255, 182, 193, 0.2);
        }

        .form-field input.invalid {
            border-color: #e05252;
            box-shadow: 0 0 0 3px rgba(224, 82, 82, 0.1);
        }
```

Replace with:
```css
        .form-field input:focus,
        .form-field select:focus {
            border-color: var(--accent-color);
            background: var(--white);
            box-shadow: 0 0 0 3px rgba(255, 182, 193, 0.2);
        }

        .form-field input.invalid,
        .form-field select.invalid {
            border-color: #e05252;
            box-shadow: 0 0 0 3px rgba(224, 82, 82, 0.1);
        }
```

- [ ] **Step 5: Verify in browser**

Open `order.html` in a browser. The country dropdown should appear as the first field in the contact section, styled identically to the other inputs. The price summary still shows CZK because no JS wiring is in place yet.

- [ ] **Step 6: Commit**

```bash
git add brave_breasts/order.html
git commit -m "feat: add country selector HTML, CSS, and EUR price config"
```

---

### Task 2: Populate the dropdown and implement currency/price switching

**Files:**
- Modify: `brave_breasts/order.html` (JS section)

- [ ] **Step 1: Add `selectedCountry` state variable and populate `<select>` on page load**

Find the STATE block (around line 1333):
```js
        var qty          = 1;
        var selectedSize = 'M';
```

Replace with:
```js
        var qty             = 1;
        var selectedSize    = 'M';
        var selectedCountry = SUPPORTED_COUNTRIES[0]; // default: CZ
```

Then, directly after the closing `})();` of the localStorage IIFE (around line 1359), add:
```js
        /* ─────────────────────────────────────────────
           COUNTRY SELECTOR
           ───────────────────────────────────────────── */
        (function() {
            var sel = document.getElementById('fieldCountry');
            SUPPORTED_COUNTRIES.forEach(function(c) {
                var opt = document.createElement('option');
                opt.value       = c.code;
                opt.textContent = c.label;
                sel.appendChild(opt);
            });
        })();

        document.getElementById('fieldCountry').addEventListener('change', function() {
            var code = this.value;
            selectedCountry = SUPPORTED_COUNTRIES.find(function(c) { return c.code === code; })
                              || SUPPORTED_COUNTRIES[0];

            /* Reset Packeta — pickup points differ per country */
            selectedPoint = null;
            updatePacketaUI();

            updateQtyUI();
        });

        function currentUnitPrice() {
            return selectedCountry.currency === 'EUR' ? UNIT_PRICE_EUR : UNIT_PRICE;
        }

        function currentCurrencyLabel() {
            return selectedCountry.currency === 'EUR' ? '€' : 'Kč';
        }
```

- [ ] **Step 2: Update `updateQtyUI()` to use currency-aware values**

Find the existing `updateQtyUI` function:
```js
        function updateQtyUI() {
            document.getElementById('qtyValue').textContent = qty;
            document.getElementById('qtyMinus').disabled = (qty <= 1);
            document.getElementById('qtyPlus').disabled  = (qty >= 10);

            var total = qty * UNIT_PRICE;
            document.getElementById('priceBreakdown').textContent = qty + ' × ' + UNIT_PRICE + ' Kč';
            document.getElementById('priceTotal').textContent = total;
        }
```

Replace with:
```js
        function updateQtyUI() {
            document.getElementById('qtyValue').textContent = qty;
            document.getElementById('qtyMinus').disabled = (qty <= 1);
            document.getElementById('qtyPlus').disabled  = (qty >= 10);

            var price = currentUnitPrice();
            var label = currentCurrencyLabel();
            var total = qty * price;
            document.getElementById('priceBreakdown').textContent = qty + ' × ' + price + ' ' + label;
            document.getElementById('priceTotal').textContent     = total;
            document.getElementById('priceCurrency').textContent  = label;
        }
```

- [ ] **Step 3: Verify in browser**

Open `order.html`. Select "Slovensko" from the dropdown — the price summary must immediately switch to `1 × 36 €` and the currency badge shows `€`. Switch back to "Česká republika" — it returns to CZK. Packeta selected-point area resets to empty whenever country changes.

- [ ] **Step 4: Commit**

```bash
git add brave_breasts/order.html
git commit -m "feat: currency/price switching on country change"
```

---

### Task 3: Pass selected country to Packeta widget

**Files:**
- Modify: `brave_breasts/order.html` (Packeta JS section)

- [ ] **Step 1: Update `openPacketaWidget()` to use `selectedCountry`**

Find the existing `openPacketaWidget` function:
```js
        function openPacketaWidget() {
            Packeta.Widget.pick(PACKETA_API_KEY, function(point) {
                if (!point) return; // user cancelled
                selectedPoint = point;
                updatePacketaUI();
            }, {
                language: 'cs',
                country: 'cz'
            });
        }
```

Replace with:
```js
        function openPacketaWidget() {
            var lang = selectedCountry.code === 'cz' ? 'cs' : 'en';
            Packeta.Widget.pick(PACKETA_API_KEY, function(point) {
                if (!point) return; // user cancelled
                selectedPoint = point;
                updatePacketaUI();
            }, {
                language: lang,
                country:  selectedCountry.code
            });
        }
```

- [ ] **Step 2: Verify in browser**

Open `order.html`. Select "Slovensko", then click "Vybrat výdejní místo Zásilkovny". The Packeta widget must open with Slovak pickup points and English labels. Switch to "Česká republika", open the widget — it must show CZ points with Czech labels.

- [ ] **Step 3: Commit**

```bash
git add brave_breasts/order.html
git commit -m "feat: Packeta widget uses selected country and language"
```

---

### Task 4: Relax ZIP validation for non-CZ countries

**Files:**
- Modify: `brave_breasts/order.html` (validation JS)

- [ ] **Step 1: Update `isValidZip()` to be country-aware**

Find:
```js
        function isValidZip(value) {
            /* CZ PSČ: exactly 5 digits, optionally with a space after 3rd */
            return /^\d{3}\s?\d{2}$/.test(value.trim());
        }
```

Replace with:
```js
        function isValidZip(value) {
            if (selectedCountry.code === 'cz') {
                /* CZ PSČ: exactly 5 digits, optionally with a space after 3rd */
                return /^\d{3}\s?\d{2}$/.test(value.trim());
            }
            /* Other countries: just require something non-empty */
            return value.trim().length > 0;
        }
```

- [ ] **Step 2: Update ZIP error message to be generic**

Find:
```html
                            <span class="field-error" id="errZip">PSČ musí mít 5 číslic.</span>
```

Replace with:
```html
                            <span class="field-error" id="errZip">Zadejte prosím PSČ / ZIP kód.</span>
```

- [ ] **Step 3: Verify in browser**

Select "Slovensko", enter `81101` as ZIP — form must accept it. Select "Česká republika", enter `81101` — form must reject it (Slovak format fails CZ check). Enter `811 01` or `81100` — accepted.

- [ ] **Step 4: Commit**

```bash
git add brave_breasts/order.html
git commit -m "fix: relax ZIP validation for non-CZ countries"
```

---

### Task 5: Update Make.com payload + document Make.com routing

**Files:**
- Modify: `brave_breasts/order.html` (form submission JS)

- [ ] **Step 1: Update the payload construction in the submit handler**

Find (around line 1529):
```js
            var total  = qty * UNIT_PRICE;

            var payload = {
                name:       name,
                email:      email,
                phone:      phone,
                street:     street,
                street2:    street2,
                city:       city,
                zip:        zip,
                size:       selectedSize,
                qty:        qty,
                unitPrice:  UNIT_PRICE,
                totalPrice: total,
                currency:   'CZK',
                timestamp:  new Date().toISOString(),
```

Replace with:
```js
            var unitPrice = currentUnitPrice();
            var total     = qty * unitPrice;

            var payload = {
                name:       name,
                email:      email,
                phone:      phone,
                street:     street,
                street2:    street2,
                city:       city,
                zip:        zip,
                country:    selectedCountry.code.toUpperCase(),  // e.g. "CZ", "SK", "DE"
                size:       selectedSize,
                qty:        qty,
                unitPrice:  unitPrice,
                totalPrice: total,
                currency:   selectedCountry.currency,            // "CZK" or "EUR"
                timestamp:  new Date().toISOString(),
```

- [ ] **Step 2: Verify payload in browser**

Open DevTools → Network tab. Submit a test order with country = "Slovensko". Inspect the request body sent to Make.com — it must contain:
```json
{
  "country": "SK",
  "currency": "EUR",
  "unitPrice": 36,
  "totalPrice": 36
}
```

Submit again with "Česká republika" — must contain:
```json
{
  "country": "CZ",
  "currency": "CZK",
  "unitPrice": 890,
  "totalPrice": 890
}
```

- [ ] **Step 3: Commit**

```bash
git add brave_breasts/order.html
git commit -m "feat: include country and currency in Make.com order payload"
```

- [ ] **Step 4: Update Make.com scenario (manual step)**

In your Make.com scenario, after the Webhook module:

1. Add a **Router** module.
2. **Route 1 — CZK (existing flow):**
   - Filter: `currency` = `CZK`
   - Connect to your existing invoice + CZK QR code modules unchanged.
3. **Route 2 — EUR:**
   - Filter: `currency` = `EUR`
   - Duplicate the invoice module, point it at your EUR bank account IBAN.
   - Replace the CZK QR code generator with a SEPA Credit Transfer QR code generator (EPC QR). The SEPA QR payload needs: `BIC`, `IBAN`, `amount` (from `totalPrice`), `currency` = `EUR`, `remittance` = order ID or customer name.
   - The `country` field in the payload tells you the customer's country for the invoice address.

Available new fields from the webhook payload:
| Field | Example | Notes |
|---|---|---|
| `country` | `"SK"` | ISO 3166-1 alpha-2, uppercase |
| `currency` | `"EUR"` | `"CZK"` or `"EUR"` |
| `unitPrice` | `36` | In the order currency |
| `totalPrice` | `72` | `qty × unitPrice` |

---

### Task 6: Add country to `validateForm()` (guard against JS edge cases)

**Files:**
- Modify: `brave_breasts/order.html` (validation JS)

The `<select>` always has a value (defaults to CZ), so this is a safety net only.

- [ ] **Step 1: Add country validation to `validateForm()`**

Find the start of `validateForm`:
```js
        function validateForm() {
            var valid = true;
            var missingLabels = [];
            var name   = document.getElementById('fieldName').value.trim();
```

Replace with:
```js
        function validateForm() {
            var valid = true;
            var missingLabels = [];

            /* Country — should always be set, but guard anyway */
            if (!selectedCountry) {
                document.getElementById('fieldCountry').classList.add('invalid');
                document.getElementById('errCountry').classList.add('visible');
                missingLabels.push('Země doručení');
                valid = false;
            }

            var name   = document.getElementById('fieldName').value.trim();
```

- [ ] **Step 2: Clear the country error on select change**

Find the `fieldCountry` change listener added in Task 2:
```js
        document.getElementById('fieldCountry').addEventListener('change', function() {
            var code = this.value;
            selectedCountry = SUPPORTED_COUNTRIES.find(function(c) { return c.code === code; })
                              || SUPPORTED_COUNTRIES[0];

            /* Reset Packeta — pickup points differ per country */
            selectedPoint = null;
            updatePacketaUI();

            updateQtyUI();
        });
```

Replace with:
```js
        document.getElementById('fieldCountry').addEventListener('change', function() {
            var code = this.value;
            selectedCountry = SUPPORTED_COUNTRIES.find(function(c) { return c.code === code; })
                              || SUPPORTED_COUNTRIES[0];

            /* Clear any validation error */
            this.classList.remove('invalid');
            document.getElementById('errCountry').classList.remove('visible');

            /* Reset Packeta — pickup points differ per country */
            selectedPoint = null;
            updatePacketaUI();

            updateQtyUI();
        });
```

- [ ] **Step 3: Final end-to-end browser test**

1. Load `order.html`.
2. Select "Německo" — price shows `1 × 36 €`, currency badge shows `€`.
3. Fill all fields (any German ZIP like `10115` must be accepted).
4. Pick a German Packeta point — widget opens in English with DE points.
5. Check GDPR consent, submit.
6. In Make.com scenario history, confirm the received payload has `country: "DE"`, `currency: "EUR"`, `totalPrice: 36`.
7. Repeat the same flow with "Česká republika" — `country: "CZ"`, `currency: "CZK"`, `totalPrice: 890`.

- [ ] **Step 4: Commit**

```bash
git add brave_breasts/order.html
git commit -m "feat: country validation guard in form submission"
```
