/**
 * Araştırma Veri Tablosu İçin Google Apps Script Kodu
 * 
 * Bu kod, katılımcıların anket verilerini (ikilem kararları, ölçek puanları, süreler) 
 * anonim olarak kaydetmek için Google E-Tablo script editörüne yapıştırılmalıdır.
 */

function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  
  // CORS ayarları için response header yardımcı fonksiyonu
  function jsonResponse(data) {
    return ContentService.createTextOutput(JSON.stringify(data))
      .setMimeType(ContentService.MimeType.JSON)
      .setHeader('Access-Control-Allow-Origin', '*')
      .setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')
      .setHeader('Access-Control-Allow-Headers', 'Content-Type');
  }
  
  try {
    var data = JSON.parse(e.postData.contents);
    
    // Tablo başlık satırını al
    var lastCol = sheet.getLastColumn();
    var headers = lastCol > 0 ? sheet.getRange(1, 1, 1, lastCol).getValues()[0] : [];
    
    // Eğer tablo boşsa veya ilk defa veri geliyorsa başlıkları oluştur
    if (headers.length === 0 || (headers.length === 1 && headers[0] === "")) {
      headers = Object.keys(data);
      sheet.appendRow(headers);
    } else {
      // Mevcut başlıkları kontrol et, eksik olanları sona ekle
      var headersUpdated = false;
      var incomingKeys = Object.keys(data);
      for (var k = 0; k < incomingKeys.length; k++) {
        var key = incomingKeys[k];
        if (headers.indexOf(key) === -1) {
          headers.push(key);
          headersUpdated = true;
        }
      }
      // Eğer yeni başlıklar eklendiyse birinci satırı güncelle
      if (headersUpdated) {
        sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
      }
    }
    
    // Gelen verileri başlıklara göre eşleştirerek satır oluştur
    var row = [];
    for (var i = 0; i < headers.length; i++) {
      var key = headers[i];
      var value = data[key];
      
      // JSON nesneleri veya dizileri string haline getir
      if (value !== undefined && value !== null) {
        if (typeof value === 'object') {
          row.push(JSON.stringify(value));
        } else {
          row.push(value);
        }
      } else {
        row.push(""); // Boş veri
      }
    }
    
    // Satırı ekle
    sheet.appendRow(row);
    return jsonResponse({ result: "success", message: "Veri başarıyla kaydedildi." });
    
  } catch (error) {
    return jsonResponse({ result: "error", message: error.toString() });
  }
}

// Tarayıcı CORS istekleri (Preflight) için gerekli OPTIONS yönlendirmesi
function doOptions(e) {
  return ContentService.createTextOutput("")
    .setMimeType(ContentService.MimeType.TEXT)
    .setHeader('Access-Control-Allow-Origin', '*')
    .setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')
    .setHeader('Access-Control-Allow-Headers', 'Content-Type');
}
