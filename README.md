# Futures Contract Size Calculator (NQ & MNQ)

A simple, fast, mobile-first calculator for futures traders to calculate position sizes and expected roundtrip commissions for **NQ** and **MNQ**.

---

## 1. Quick Reference & Specs

| Contract | Point Value | Roundtrip Commission | Quick Rule |
| :--- | :--- | :--- | :--- |
| **NQ** (E-mini) | $20 per point | $5.00 / contract | Divide SL by 20 |
| **MNQ** (Micro) | $2 per point | $1.50 / contract | Divide SL by 2 |

---

## 2. Calculation Logic & Formulas

### Basic Relationship
```
SL Points × Dollar per Point × Contracts = Stop Loss Amount ($)
```

### Formulas for Position Sizing

- **NQ Contracts (Raw):**
  ```
  NQ Contracts = SL Amount / (20 × SL Points)
  ```

- **MNQ Contracts (Raw):**
  ```
  MNQ Contracts = SL Amount / (2 × SL Points)
  ```

---

## 3. Floor Rule (Whole Contracts Only)

Futures cannot be traded in fractions (decimals). To make sure you **never risk more than your predefined Stop Loss amount**, the calculator always floors (rounds down) the contract count:

- **6.4 contracts** → **6 contracts**
- **6.7 contracts** → **6 contracts**
- **6.9 contracts** → **6 contracts**

```
Position Contracts = Math.floor(Raw Contracts)
```

---

## 4. Expected Roundtrip Commission

Commission is calculated based on the actual floored contracts you take:

- **NQ Total Commission:** `Contracts × $5.00`
- **MNQ Total Commission:** `Contracts × $1.50`

*(If contracts = 0, expected commission is $0.00)*

---

## 5. Instrument Selection Rule (from Notes)

```
If (SL Amount / 20) > SL Points  →  Take NQ
Else                             →  Take MNQ
```

- **Why:** If `SL Amount / 20 > SL Points`, you can take at least **1 full NQ contract**.
- If `SL Amount / 20 ≤ SL Points`, an NQ contract would be less than 1 (floored to 0), so you should take **MNQ**.

---

## 6. Red Boundary Warning (< 1 Contract)

If the contract size is under 1 (e.g. `0.65` contracts), the app displays a **glowing red boundary** and alert. This means your dollar risk is too small or your stop loss points are too wide for that contract.

---

## 7. Simple Examples

### Example 1: SL = $200, SL Points = 15.2
- **NQ:** `200 / (20 × 15.2) = 0.65` → **0 contracts** (shows red outline)
- **MNQ:** `200 / (2 × 15.2) = 6.57` → **6 contracts** (floored)
- **Commission:** `6 × $1.50 = $9.00`
- **Recommendation:** Take **MNQ** (since `200 / 20 = 10` is less than `15.2`)

### Example 2: SL = $1,000, SL Points = 20
- **NQ:** `1000 / (20 × 20) = 2.5` → **2 contracts**
- **Commission:** `2 × $5.00 = $10.00`
- **MNQ:** `1000 / (2 × 20) = 25.0` → **25 contracts**
- **Commission:** `25 × $1.50 = $37.50`
- **Recommendation:** Take **NQ** (since `1000 / 20 = 50` is greater than `20`)

---

## 8. App Features

- **Auto-saved SL Amount:** Saved in your browser's local storage so you don't have to type it every time.
- **Mobile Numeric Keypad:** Uses `inputMode="decimal"` to open the number keypad on phones instead of the QWERTY keyboard.
- **Instant Calculations:** Updates immediately with zero lag as you type.
- **Copy Button:** Quickly copy the contract number to paste into your broker.
