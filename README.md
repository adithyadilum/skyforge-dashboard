# Skyforge Dashboard

## Battery Voltage Correction (3S LiPo)

- The dashboard now automatically corrects battery voltage readings from the database by **adding 0.7V** to the received value.
- This compensates for the hardware/database offset (database receives 700mV less than actual voltage).
- Battery percentage is calculated based on the corrected voltage:
  - **0%** at 9.5V
  - **100%** at 12.6V
- Both the actual voltage and percentage are displayed in the web app.

### Example
- If the database shows 11.4V, the dashboard will display 12.1V and the correct percentage for a 3S LiPo battery.

## Features
- Real-time battery monitoring with voltage correction
- Accurate battery percentage for 3S LiPo (9.5V-12.6V)
- Visual battery gauge and cell voltage display

---

For more details, see the code in `src/services/firebaseService.ts` and the System tab UI.
