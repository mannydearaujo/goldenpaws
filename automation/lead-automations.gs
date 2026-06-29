/**
 * Golden Paws Lead Automations
 *
 * Standalone Google Apps Script project, NOT deployed from this repo.
 * Lives at script.google.com under goldenpawslexington@gmail.com, bound
 * to the "Golden Paws New Client Intake" Google Sheet (Tally form
 * destination) via SpreadsheetApp.openById(). This file is a tracked
 * copy for documentation/recovery — edit in the Apps Script editor and
 * paste the result back here, since Apps Script does not deploy from
 * git.
 *
 * What it does: every 10 minutes (time-based trigger, see createTrigger),
 * scans the intake Sheet for rows with an email and no "Confirmation
 * Sent" timestamp, and sends a branded HTML confirmation email from the
 * Golden Paws Gmail account. Marks the row so it never double-sends.
 *
 * Setup (one-time, already done as of 2026-06-29):
 *   1. Run `createTrigger` once from the Apps Script editor to install
 *      the 10-minute time-based trigger (also clears any duplicate).
 *   2. Authorize Gmail + Sheets access when prompted (signed in as
 *      goldenpawslexington@gmail.com).
 */

const SHEET_ID = '1J9e9kqCWbgIaHyD7yFbGyH6TTW51z7IZEmysfioN6TY';
const SHEET_NAME = 'Sheet1';
const EMAIL_COL = 9;          // I: Email
const FIRST_NAME_COL = 4;     // D: First Name
const PET_NAME_COL = 11;      // K: Pet Name
const CONFIRMATION_COL = 22;  // V: Confirmation Sent (added by ensureColumns)
const BUSINESS_NAME = 'Golden Paws Pet Grooming';
const BUSINESS_PHONE = '(781) 274-9144';
const BUSINESS_PHONE_TEL = '7812749144';
const BUSINESS_ADDRESS = '395 Lowell St, Lexington, MA';
const WEBSITE_URL = 'https://goldenpawspetgrooming.com';
const FROM_NAME = 'Golden Paws Pet Grooming';

function getIntakeSheet_() {
  return SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME);
}

function ensureColumns() {
  const sheet = getIntakeSheet_();
  const header = sheet.getRange(1, CONFIRMATION_COL).getValue();
  if (!header) {
    sheet.getRange(1, CONFIRMATION_COL).setValue('Confirmation Sent');
  }
}

function buildConfirmationPlainText_(firstName, petName) {
  return [
    'Hi ' + firstName + ',',
    '',
    'Thank you for choosing ' + BUSINESS_NAME + '! We received your new client intake for ' + petName + '.',
    '',
    'One of our team members will review your information, including vaccine records, and follow up with you shortly to confirm scheduling.',
    '',
    'Questions in the meantime? Call or text us at ' + BUSINESS_PHONE + '.',
    '',
    'Visit our website: ' + WEBSITE_URL,
    '',
    'Talk soon,',
    BUSINESS_NAME
  ].join('\n');
}

function buildConfirmationHtml_(firstName, petName) {
  return ''
    + '<div style="margin:0;padding:24px 12px;background:#FAF5EC;font-family:Arial,Helvetica,sans-serif;">'
    + '<div style="max-width:480px;margin:0 auto;">'
    + '<div style="background:#1B3A6B;border-radius:8px 8px 0 0;padding:20px 24px;text-align:center;">'
    + '<span style="color:#ffffff;font-size:20px;font-weight:700;">Golden Paws <span style="color:#C9A040;">Pet Grooming</span></span>'
    + '</div>'
    + '<div style="background:#ffffff;padding:28px 24px;border-radius:0 0 8px 8px;">'
    + '<p style="margin:0 0 16px;font-size:16px;line-height:1.6;color:#2A2A2A;">Hi ' + firstName + ',</p>'
    + '<p style="margin:0 0 16px;font-size:16px;line-height:1.6;color:#2A2A2A;">Thank you for choosing ' + BUSINESS_NAME + '! We received your new client intake for <strong>' + petName + '</strong>.</p>'
    + '<p style="margin:0 0 16px;font-size:16px;line-height:1.6;color:#2A2A2A;">One of our team members will review your information, including vaccine records, and follow up with you shortly to confirm scheduling.</p>'
    + '<p style="margin:0 0 24px;font-size:16px;line-height:1.6;color:#2A2A2A;">Questions in the meantime? Call or text us at <a href="tel:' + BUSINESS_PHONE_TEL + '" style="color:#1B3A6B;font-weight:600;text-decoration:none;">' + BUSINESS_PHONE + '</a>.</p>'
    + '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0;">'
    + '<tr><td align="center">'
    + '<a href="' + WEBSITE_URL + '" style="display:inline-block;background:#C9A040;color:#1B3A6B;font-weight:700;font-size:15px;text-decoration:none;padding:14px 32px;border-radius:6px;">Visit Our Website</a>'
    + '</td></tr>'
    + '</table>'
    + '</div>'
    + '<p style="text-align:center;font-size:12px;line-height:1.6;color:#8A8A8A;margin:16px 12px 0;">'
    + BUSINESS_NAME + ' &middot; ' + BUSINESS_ADDRESS + '<br>'
    + '<a href="' + WEBSITE_URL + '" style="color:#1B3A6B;text-decoration:none;">' + WEBSITE_URL.replace('https://', '') + '</a>'
    + '</p>'
    + '</div>'
    + '</div>';
}

function sendNewClientConfirmations() {
  ensureColumns();
  const sheet = getIntakeSheet_();
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return;

  const numRows = lastRow - 1;
  const data = sheet.getRange(2, 1, numRows, CONFIRMATION_COL).getValues();

  data.forEach(function (row, i) {
    const rowNum = i + 2;
    const email = row[EMAIL_COL - 1];
    const alreadySent = row[CONFIRMATION_COL - 1];
    if (!email || alreadySent) return;

    const firstName = row[FIRST_NAME_COL - 1] || 'there';
    const petName = row[PET_NAME_COL - 1] || 'your pup';

    const subject = 'We received your intake, ' + firstName + '! - ' + BUSINESS_NAME;
    const plainBody = buildConfirmationPlainText_(firstName, petName);
    const htmlBody = buildConfirmationHtml_(firstName, petName);

    try {
      GmailApp.sendEmail(email, subject, plainBody, {
        name: FROM_NAME,
        htmlBody: htmlBody
      });
      sheet.getRange(rowNum, CONFIRMATION_COL).setValue(new Date());
    } catch (err) {
      console.error('Failed to send confirmation for row ' + rowNum + ': ' + err);
    }
  });
}

function createTrigger() {
  ScriptApp.getProjectTriggers().forEach(function (t) {
    if (t.getHandlerFunction() === 'sendNewClientConfirmations') {
      ScriptApp.deleteTrigger(t);
    }
  });
  ScriptApp.newTrigger('sendNewClientConfirmations')
    .timeBased()
    .everyMinutes(10)
    .create();
}
