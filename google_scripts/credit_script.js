/**
 * Ek Puan / Öğrenci Kayıt Tablosu İçin Google Apps Script Kodu
 * 
 * Bu kod, anketi tamamlayan öğrencilerin ad, soyad, numara ve ders bilgilerini 
 * araştırma verilerinden tamamen bağımsız olarak başka bir Google E-Tablo'ya
 * kaydetmek için kullanılır.
 */

function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  
  function jsonResponse(data) {
    return ContentService.createTextOutput(JSON.stringify(data))
      .setMimeType(ContentService.MimeType.JSON)
      .setHeader('Access-Control-Allow-Origin', '*')
      .setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')
      .setHeader('Access-Control-Allow-Headers', 'Content-Type');
  }
  
  try {
    var data = JSON.parse(e.postData.contents);
    
    // Tablo başlık satırını al veya oluştur
    var lastCol = sheet.getLastColumn();
    var headers = lastCol > 0 ? sheet.getRange(1, 1, 1, lastCol).getValues()[0] : [];
    
    if (headers.length === 0 || (headers.length === 1 && headers[0] === "")) {
      // Sabit başlıklar: Zaman Damgası, Ad Soyad, Öğrenci No, Ders Adı
      headers = ["Zaman Damgası", "Ad Soyad", "Öğrenci Numarası", "Ders Adı"];
      sheet.appendRow(headers);
    }
    
    // Zaman damgası ekle
    var timestamp = new Date();
    var row = [
      timestamp,
      data.student_name || "",
      data.student_id || "",
      data.course_name || ""
    ];
    
    sheet.appendRow(row);
    return jsonResponse({ result: "success", message: "Öğrenci bilgileri başarıyla kaydedildi." });
    
  } catch (error) {
    return jsonResponse({ result: "error", message: error.toString() });
  }
}

function doOptions(e) {
  return ContentService.createTextOutput("")
    .setMimeType(ContentService.MimeType.TEXT)
    .setHeader('Access-Control-Allow-Origin', '*')
    .setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')
    .setHeader('Access-Control-Allow-Headers', 'Content-Type');
}
