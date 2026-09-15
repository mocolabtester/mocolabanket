/**
 * Araştırma Veri Tablosu İçin Google Apps Script Kodu (Güncellenmiş)
 * 
 * Bu dosyadaki kodu Google Sheets > Uzantılar > Apps Script alanına yapıştırabilirsiniz.
 * 
 * İki ana işlevi vardır:
 * 1) doPost(e): Web sitelerinden gelen verileri tabloya otomatik kaydeder.
 * 2) createSurveyCodebookAndSheet(): Yeni, temiz bir "Yanitlar" sayfası ve tüm değişkenlerin
 *    kodlamasını açıklayan "Kod_Kitabi" (Codebook) sayfası oluşturur.
 */

// Tüm değişkenlerin güncel ve tam listesi
var SURVEY_HEADERS = [
  "timestamp",
  "muhatap",
  "siralama",
  "d1_initial_choice",
  "d1_initial_rating",
  "d1_q2_conf",
  "d1_assigned_model",
  "d1_chat_opened",
  "d1_summary",
  "d1_final_choice",
  "d1_final_rating",
  "d1_q2_conf_final",
  "d1_q3_ai_influence",
  "d1_ai_error",
  "d2_initial_choice",
  "d2_initial_rating",
  "d2_q2_conf",
  "d2_assigned_model",
  "d2_chat_opened",
  "d2_summary",
  "d2_final_choice",
  "d2_final_rating",
  "d2_q2_conf_final",
  "d2_q3_ai_influence",
  "d2_ai_error",
  // MMS Maddeleri (1-20)
  "mms_1", "mms_2", "mms_3", "mms_4", "mms_5",
  "mms_6", "mms_7", "mms_8", "mms_9", "mms_10",
  "mms_11", "mms_12", "mms_13", "mms_14", "mms_15",
  "mms_16", "mms_17", "mms_18", "mms_19", "mms_20",
  // AI Okuryazarlığı (1-34)
  "ai_lit_1", "ai_lit_2", "ai_lit_3", "ai_lit_4", "ai_lit_5",
  "ai_lit_6", "ai_lit_7", "ai_lit_8", "ai_lit_9", "ai_lit_10",
  "ai_lit_11", "ai_lit_12", "ai_lit_13", "ai_lit_14", "ai_lit_15",
  "ai_lit_16", "ai_lit_17", "ai_lit_18", "ai_lit_19", "ai_lit_20",
  "ai_lit_21", "ai_lit_22", "ai_lit_23", "ai_lit_24", "ai_lit_25",
  "ai_lit_26", "ai_lit_27", "ai_lit_28", "ai_lit_29", "ai_lit_30",
  "ai_lit_31", "ai_lit_32", "ai_lit_33", "ai_lit_34",
  // Sosyodemografik & Güven
  "demo_age",
  "demo_gender",
  "demo_ses",
  "demo_ai_used",
  "demo_ai_preferred",
  "demo_religiosity",
  "demo_politics",
  "demo_trust_human",
  "demo_trust_ai",
  "demo_ai_duration",
  "demo_ai_hours",
  "demo_ai_understanding",
  "demo_source_trust",
  "demo_source_future_intent",
  "demo_ai_believability"
];

function doPost(e) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("Yanitlar") || ss.getActiveSheet();
  
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
    
    // Eğer tablo boşsa standart başlıkları oluştur
    if (headers.length === 0 || (headers.length === 1 && headers[0] === "")) {
      headers = SURVEY_HEADERS;
      sheet.appendRow(headers);
    } else {
      // Gelen veride tabloda olmayan bir anahtar varsa sona ekle
      var headersUpdated = false;
      var incomingKeys = Object.keys(data);
      for (var k = 0; k < incomingKeys.length; k++) {
        var key = incomingKeys[k];
        if (headers.indexOf(key) === -1) {
          headers.push(key);
          headersUpdated = true;
        }
      }
      if (headersUpdated) {
        sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
      }
    }
    
    // Satırı başlıklara göre doldur
    var row = [];
    for (var i = 0; i < headers.length; i++) {
      var hKey = headers[i];
      var value = data[hKey];
      if (value !== undefined && value !== null) {
        if (typeof value === 'object') {
          row.push(JSON.stringify(value));
        } else {
          row.push(value);
        }
      } else {
        row.push("");
      }
    }
    
    sheet.appendRow(row);
    return jsonResponse({ result: "success", message: "Veri başarıyla kaydedildi." });
    
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

/**
 * Bu fonksiyonu Apps Script editöründe yukarıdan seçip "Çalıştır" (Run) butonuna basarak 
 * istediğiniz zaman çalıştırabilirsiniz.
 * Temiz bir "Yanitlar" sayfası ve detaylı bir "Kod_Kitabi" (Codebook) sayfası oluşturur.
 */
function createSurveyCodebookAndSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  
  // 1. Yanıtlar Sayfası
  var sheet = ss.getSheetByName("Yanitlar");
  if (!sheet) {
    sheet = ss.insertSheet("Yanitlar");
  }
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(SURVEY_HEADERS);
    sheet.getRange(1, 1, 1, SURVEY_HEADERS.length).setFontWeight("bold").setBackground("#e8f0fe");
  }
  
  // 2. Kod Kitabı Sayfası
  var cbSheet = ss.getSheetByName("Kod_Kitabi");
  if (!cbSheet) {
    cbSheet = ss.insertSheet("Kod_Kitabi");
  } else {
    cbSheet.clear();
  }
  
  var codebookData = [
    ["Değişken Adı", "Soru / Değişken Açıklaması", "Ölçüm Tipi / Değer Aralıkları ve Kodlar"],
    ["timestamp", "Veri gönderim zamanı", "ISO 8601 Tarih Saat (Örn: 2026-09-15T18:00:00.000Z)"],
    ["muhatap", "Deneysel Koşul: Tartışılan Muhatap", "1 = Yapay Zeka, 2 = İnsan (Moderatör/Asistan)"],
    ["siralama", "Deneysel Koşul: Sunum Sıralaması", "1 = Destekleyici -> Karşıt, 2 = Karşıt -> Destekleyici"],
    
    // Dilemma 1
    ["d1_initial_choice", "İkilem 1 İlk Karar (Ücretsiz Yemek)", "1 = Evet (İsrafı Önle), 2 = Hayır (Eşitliği Koru)"],
    ["d1_initial_rating", "İkilem 1 Ahlaki Uygunluk Derecesi (İlk)", "1 (Hiç uygun değil) - 7 (Tamamen uygun) Likert"],
    ["d1_q2_conf", "İkilem 1 Karardan Eminlik Düzeyi (İlk)", "0 (Hiç emin değilim) - 100 (Tamamen eminim) Slider"],
    ["d1_assigned_model", "İkilem 1 Katılımcıya Atanan Model", "unfrns, wstfl, unfrnsh, wstflh"],
    ["d1_chat_opened", "İkilem 1 Sohbet Linkine Tıklanma Durumu", "1 = Tıklandı/Açıldı, 2 = Açılmadı"],
    ["d1_summary", "İkilem 1 Tartışma Özeti", "Açık uçlu metin (minimum 20 karakter)"],
    ["d1_final_choice", "İkilem 1 Son Karar (Tartışma Sonrası)", "1 = Evet (İsrafı Önle), 2 = Hayır (Eşitliği Koru)"],
    ["d1_final_rating", "İkilem 1 Ahlaki Uygunluk Derecesi (Son)", "1 (Hiç uygun değil) - 7 (Tamamen uygun) Likert"],
    ["d1_q2_conf_final", "İkilem 1 Karardan Eminlik Düzeyi (Son)", "0 (Hiç emin değilim) - 100 (Tamamen eminim) Slider"],
    ["d1_q3_ai_influence", "İkilem 1 Muhatabın Karara Etki Derecesi", "0 (Hiç etkisi yok) - 100 (Çok etkili) Slider"],
    ["d1_ai_error", "İkilem 1 Sohbet Bağlantı/Teknik Durum", "1 = Evet (Hata aldım / yanıt alamadım), 2 = Hayır (Sorunsuz görüştüm)"],
    
    // Dilemma 2
    ["d2_initial_choice", "İkilem 2 İlk Karar (Market Hediye Kartı)", "1 = Evet (İsrafı Önle), 2 = Hayır (Eşitliği Koru)"],
    ["d2_initial_rating", "İkilem 2 Ahlaki Uygunluk Derecesi (İlk)", "1 (Hiç uygun değil) - 7 (Tamamen uygun) Likert"],
    ["d2_q2_conf", "İkilem 2 Karardan Eminlik Düzeyi (İlk)", "0 (Hiç emin değilim) - 100 (Tamamen eminim) Slider"],
    ["d2_assigned_model", "İkilem 2 Katılımcıya Atanan Model", "wstfl, unfrns, wstflh, unfrnsh"],
    ["d2_chat_opened", "İkilem 2 Sohbet Linkine Tıklanma Durumu", "1 = Tıklandı/Açıldı, 2 = Açılmadı"],
    ["d2_summary", "İkilem 2 Tartışma Özeti", "Açık uçlu metin (minimum 20 karakter)"],
    ["d2_final_choice", "İkilem 2 Son Karar (Tartışma Sonrası)", "1 = Evet (İsrafı Önle), 2 = Hayır (Eşitliği Koru)"],
    ["d2_final_rating", "İkilem 2 Ahlaki Uygunluk Derecesi (Son)", "1 (Hiç uygun değil) - 7 (Tamamen uygun) Likert"],
    ["d2_q2_conf_final", "İkilem 2 Karardan Eminlik Düzeyi (Son)", "0 (Hiç emin değilim) - 100 (Tamamen eminim) Slider"],
    ["d2_q3_ai_influence", "İkilem 2 Muhatabın Karara Etki Derecesi", "0 (Hiç etkisi yok) - 100 (Çok etkili) Slider"],
    ["d2_ai_error", "İkilem 2 Sohbet Bağlantı/Teknik Durum", "1 = Evet (Hata aldım / yanıt alamadım), 2 = Hayır (Sorunsuz görüştüm)"],
    
    // MMS
    ["mms_1 .. mms_20", "Ahlaki Üstbiliş Ölçeği Maddeleri (20 Madde)", "1 (Kesinlikle Katılmıyorum) - 6 (Kesinlikle Katılıyorum) Likert"],
    
    // AI Lit
    ["ai_lit_1 .. ai_lit_34", "Yapay Zeka Okuryazarlığı Ölçeği Maddeleri (34 Madde)", "1 (Kesinlikle Katılmıyorum) - 5 (Kesinlikle Katılıyorum) Likert"],
    
    // Sosyodemografik & Güven
    ["demo_age", "Katılımcı Yaşı", "Sayısal (Yıl)"],
    ["demo_gender", "Cinsiyet", "0 = Belirtilmedi / Boş, 1 = Kadın, 2 = Erkek, 3 = Belirtmek İstemiyorum, 4 = Diğer"],
    ["demo_ses", "Çocukluktaki Sosyo-ekonomik Düzey", "1 = Çok Kötü, 2 = Kötü, 3 = Orta, 4 = İyi, 5 = Çok İyi"],
    ["demo_ai_used", "Daha Önce Yapay Zeka Kullanımı", "1 = Evet, 2 = Hayır"],
    ["demo_ai_preferred", "En Sık Kullanılan Yapay Zeka Aracı", "1 = ChatGPT, 2 = Claude, 3 = Gemini, 4 = Grok, 5 = Yapay Zeka Kullanmıyorum, 6 = Diğer"],
    ["demo_religiosity", "Dindarlık Derecesi", "1 (Hiç dindar değilim) - 7 (Tamamen dindarım), 0 = Belirtmek İstemiyorum"],
    ["demo_politics", "Politik / Siyasi Görüş", "1 (Sol) - 7 (Sağ), 0 = Belirtmek İstemiyorum"],
    ["demo_trust_human", "Ahlaki İkilemlerde İnsana Genel Güven", "0 (Hiç güvenmem) - 100 (Tamamen güvenirim) Slider"],
    ["demo_trust_ai", "Ahlaki İkilemlerde Yapay Zekaya Genel Güven", "0 (Hiç güvenmem) - 100 (Tamamen güvenirim) Slider"],
    ["demo_ai_duration", "Yapay Zeka Kullanım Süresi", "1 = Hiç kullanmadım, 2 = 6 aydan az, 3 = 6 ay-1 yıl, 4 = 1 yıl-2 yıl, 5 = 2 yıldan fazla"],
    ["demo_ai_hours", "Haftalık Yapay Zeka Kullanım Saati", "Sayısal saat (Örn: 5, ya da 0)"],
    ["demo_ai_understanding", "Sohbetteki Cevapların Açık/Anlaşılırlığı", "1 (Hiç açık değil) - 7 (Tamamen açık) Likert"],
    ["demo_source_trust", "Danışılan Kaynağın Güvenilirliği", "1 (Hiç Güvenilir Değil) - 7 (Tamamen Güvenilir) Likert"],
    ["demo_source_future_intent", "Farklı Konularda Bu Kaynağa Danışma İstekliliği", "1 (Hiç istekli olmam) - 7 (Çok istekli olurum) Likert"],
    ["demo_ai_believability", "Sohbet İçeriğinin İnandırıcılığı (Manipülasyon Kontrolü)", "1 (Hiç inandırıcı değil) - 7 (Tamamen inandırıcı) Likert"]
  ];
  
  cbSheet.getRange(1, 1, codebookData.length, 3).setValues(codebookData);
  cbSheet.getRange(1, 1, 1, 3).setFontWeight("bold").setBackground("#fce8e6");
  cbSheet.autoResizeColumns(1, 3);
}
