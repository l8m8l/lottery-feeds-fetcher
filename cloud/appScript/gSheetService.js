/* eslint no-unused-vars: ["error", { "varsIgnorePattern": "doPost" }] */
/* global ContentService, SpreadsheetApp */

const spreadsheetId = ''
const lotTypes = [
  'PK10-LuckyAirship',
  'PK10-Beijing',
  'SS-Tianjin',
  'LH-HongKong',
  'K3-Lucky3',
  '3D-Welfare'
]

function doPost(e) {
  let error
  try {
    const req = JSON.parse(e.postData.contents)
    _validateRequest(req)
    _handleRequest(req)
  } catch (err) {
    error = err.message
  }
  return _respond({ success: error == null, error, req: JSON.stringify(e) })
}

function _validateRequest(req) {
  if (req == null) throw new Error('Request body is null')
  if (!lotTypes.includes(req.type))
    throw new Error(`'${req.type}' is not a valid lottery type`)
  if (!Array.isArray(req.results))
    throw new Error('Request.results is not an array')
}

function _handleRequest(req) {
  const spreadsheet = SpreadsheetApp.openById(spreadsheetId)
  const sheet = _getOrCreateSheet(spreadsheet, req.type)
  _appendResults(sheet, req.results)
}

function _getOrCreateSheet(spreadsheet, sheetName) {
  const sheet = spreadsheet.getSheetByName(sheetName)
  if (sheet != null) return sheet
  const newSheet = spreadsheet.insertSheet().setName(sheetName)
  newSheet.setColumnWidths(1, 3, 180)
  newSheet.setFrozenRows(1)
  newSheet
    .getRange(1, 1, 1, 3)
    .setValues([['No.', 'Result', 'CreatedAt']])
    .setBackground('#2d2d2d')
    .setFontColor('#ffffff')
    .setFontWeight('bold')
  return newSheet
}

function _appendResults(sheet, results) {
  const lastRow = sheet.getLastRow()
  if (lastRow > 1) {
    const startRow = Math.max(lastRow - 5 + 1, 2)
    const rowNums = lastRow - startRow + 1
    const values = sheet.getRange(startRow, 1, rowNums, 1).getValues()
    const nos = values.map(row => `${row[0]}`)
    results = results.filter(result => !nos.includes(`${result.no}`))
  }
  for (const result of results.reverse()) {
    sheet.appendRow([
      `${result.no}`,
      `${result.result}`,
      `${result.dateCreated}`
    ])
  }
  sheet.getRange('A:C').setNumberFormat('@')
}

function _respond(data) {
  return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(
    ContentService.MimeType.JSON
  )
}
