# Yapay Zeka ve Ahlaki Kararlar Araştırma Formu - Kurulum Kılavuzu

Bu kılavuz, hazırlanan web formunu Google E-Tablolar'a bağlayarak veri toplamaya hazır hale getirmenizi ve GitHub Pages üzerinden ücretsiz olarak yayına almanızı sağlayacak adımları içerir.

---

## Aşama 1: Google E-Tabloların Kurulumu (Veri Tabanı)

Katılımcıların gizliliğini (anonimliğini) akademik standartlarda korumak için **iki ayrı Google E-Tablo** oluşturacağız.

### 1. Araştırma Veri Tablosu (Tamamen Anonim)
1. [Google E-Tablolar](https://sheets.google.com) adresine gidin ve boş bir e-tablo oluşturun.
2. Tablonun adını **"Araştırma Verileri (Anonim)"** yapın.
3. Üst menüden **Uzantılar (Extensions) > Apps Komut Dosyası (Apps Script)** seçeneğine tıklayın.
4. Açılan script editöründeki tüm kodları silin.
5. Size verdiğim `google_scripts/survey_script.js` dosyasındaki kodları buraya yapıştırın.
6. Sol üstteki disket ikonuna tıklayarak projeyi **kaydedin**.
7. Sağ üstteki **Dağıt (Deploy) > Yeni Dağıtım (New Deployment)** butonuna tıklayın.
8. Çark simgesine tıklayıp **Web Uygulaması (Web App)** seçeneğini seçin.
9. Ayarları şu şekilde yapılandırın:
   * **Açıklama (Description):** Anket Veri Alıcısı
   * **Uygulamayı şu kişi olarak çalıştır (Execute as):** Ben (E-posta adresiniz)
   * **Erişimi olanlar (Who has access):** Herkes (Anyone)
10. **Dağıt (Deploy)** butonuna tıklayın. (İlk defa yapıyorsanız Google sizden erişim izni isteyecektir, onay verin).
11. Dağıtım tamamlandığında ekranda görünen **Web Uygulaması URL'sini (Web App URL)** kopyalayın. Bu URL `https://script.google.com/macros/s/.../exec` şeklinde görünecektir. Bu URL'yi bir kenara not edin (**API 1: Anket Veri Bağlantısı**).

### 2. Ek Puan Kayıt Tablosu (Öğrenci Kimlik Bilgileri)
1. Yeni bir boş Google E-Tablo daha oluşturun.
2. Tablonun adını **"Ek Puan Öğrenci Listesi"** yapın.
3. Aynı şekilde **Uzantılar > Apps Komut Dosyası** menüsünü açın.
4. Bu kez size verdiğim `google_scripts/credit_script.js` dosyasındaki kodları buraya yapıştırıp **kaydedin**.
5. **Dağıt > Yeni Dağıtım** butonuna tıklayın, tür olarak **Web Uygulaması** seçin.
6. Ayarları yine:
   * **Uygulamayı şu kişi olarak çalıştır:** Ben
   * **Erişimi olanlar:** Herkes
7. **Dağıt** butonuna tıklayıp izinleri onaylayın.
8. Üretilen yeni **Web Uygulaması URL'sini** kopyalayın ve not edin (**API 2: Ek Puan Bağlantısı**).

---

## Aşama 2: Web Formunun Yayınlanması (GitHub Pages)

Web formunu yayına almanın en kolay ve ücretsiz yolu GitHub Pages kullanmaktır:

1. [GitHub](https://github.com) hesabınızda oturum açın ve **Yeni bir Depo (Repository)** oluşturun (Örn: `moral-metacognition-study`).
2. Depoyu **Public (Açık)** olarak işaretleyin.
3. Hazırladığımız şu 3 ana dosyayı depoya yükleyin (Upload files):
   * `index.html`
   * `styles.css`
   * `app.js`
4. Dosyaları yükledikten sonra, depodaki **Settings (Ayarlar)** sekmesine gidin.
5. Sol menüden **Pages** kısmına tıklayın.
6. **Build and deployment** başlığı altındaki **Branch** seçeneğini `None` yerine `main` (veya `master`) olarak değiştirip **Save** butonuna tıklayın.
7. Sayfayı yenileyin. Birkaç dakika içinde GitHub size yayındaki sitenizin linkini verecektir (Örn: `https://kullaniciadiniz.github.io/moral-metacognition-study/`).

---

## Aşama 3: API Bağlantılarının Kurulması (Yönetici Paneli)

Siteniz yayına girdikten sonra verilerin sizin Google E-Tablolarınıza akması için bağlantıları kurmanız gerekir:

1. Yayındaki sitenizin linkine gidin.
2. Sayfanın en altına inin. En altta görünmez bir **"Yönetici Girişi"** yazısı bulunmaktadır (Telif hakkı uyarısının hemen altında).
3. Bu yazıya tıklayın, şifre penceresi açılacaktır.
4. Yönetici şifresini girin: `moralmetacognition2026` ve Giriş Yap'a tıklayın.
5. Açılan **Yönetici Panelinde**:
   * **Araştırma Veri Tablosu API URL** alanına: Aşama 1'de aldığınız **API 1 (Anket Veri Bağlantısı)** linkini yapıştırın.
   * **Ek Puan Tablosu API URL** alanına: Aşama 1'de aldığınız **API 2 (Ek Puan Bağlantısı)** linkini yapıştırın.
   * **Bağlantıları Kaydet** butonuna tıklayın.
6. Artık sisteminiz tamamen kurulmuştur! 

---

## Aşama 4: Anket Yönetimi ve Veri Toplama

* **QR Kod ve Paylaşım:** Yönetici panelindeki QR kodu doğrudan projeksiyonla sınıfa yansıtabilir, telefonunuzdan taratabilir veya ekran görüntüsünü alıp anket posterinize koyabilirsiniz. Hemen yanındaki anket linkini kopyalayıp öğrencilerinize de atabilirsiniz.
* **Katılım Süreci:** Öğrenciler anket boyunca ilerleyecek, Evet/Hayır cevaplarına göre ilgili yapay zekaya yönlendirilecek, süreleri otomatik ölçülecektir.
* **Verilerin Alınması:** 
  1. İnternet bağlantısı olduğu sürece veriler anında ilgili Google E-Tablolarınıza satır satır düşecektir.
  2. Her ihtimale karşı (sınıfta internetin kesilmesi vb.), veriler öğrencilerin tarayıcısında da yedeklenir. İstediğiniz zaman Yönetici Paneline girerek **"Anket Yedeklerini İndir (CSV)"** ve **"Öğrenci Yedeklerini İndir (CSV)"** butonlarına tıklayarak o ana kadar toplanmış yedekleri doğrudan bilgisayarınıza indirebilirsiniz.
  3. İndirilen CSV dosyalarını doğrudan **Excel** veya **SPSS** programlarında açarak analize başlayabilirsiniz.
