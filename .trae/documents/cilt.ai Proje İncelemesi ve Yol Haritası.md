## Mevcut Durum
- Statik, çok sayfalı HTML/CSS/JS yapısı; her sayfada inline stil ve script.
- Akış: `index.html` → `photo-up.html` → `sonuclar.html`; veriler `localStorage` ile taşınıyor.
- Derleme/bundler yok; `package.json` minimal ve build komutu tanımlı değil.
- Gemini API çağrısı doğrudan istemciden ve `apiKey` boş.

## Tespitler (Kod Referanslarıyla)
- Eksik alan kullanımı: `cilt-tonu` alanı formda yok, ancak okunuyor (`c:\Projects\cilt-ai\index.html`:445).
- Görsel/veri aktarımı kullanılmıyor: Yüklenen görsel ve form verileri `sonuclar.html` içinde okunmuyor; placeholder değerler var (`c:\Projects\cilt-ai\sonuclar.html`:321–363).
- API anahtarı ve güvenlik: Gemini çağrısı `apiKey` boş ve istemcide yapılmış (`c:\Projects\cilt-ai\sonuclar.html`:524–526).
- Base64 görsel `localStorage`’a yazılıyor; büyük veri ve gizlilik açısından uygun değil (`c:\Projects\cilt-ai\photo-up.html`:398–399).
- Build/serve eksik: `package.json` derleme/servis komutları yok (`c:\Projects\cilt-ai\package.json`:6–8).

## Plan
### Aşama 1: Hızlı Düzeltmeler (Akışı çalışır hale getirme)
- `index.html` formuna `cilt-tonu` seçimi ekle ya da referansı kaldır; submit’te null kontrolü ekle.
- `sonuclar.html` içinde `localStorage`’dan `ciltAnaliziVerileri` ve `uploadedImage` okunarak alanları dinamik doldurma; yüklenen görseli galeriye ekleme.
- Hata durumları için kullanıcı geri bildirimi: boş `localStorage`/eksik alanlarda uyarı ve geri yönlendirme.

### Aşama 2: Ortak Stil ve Script Refaktörü
- Tekrarlanan stilleri ortak bir `assets/styles.css` dosyasına, ortak davranışları `assets/main.js` dosyasına taşıma.
- Header/footer ve buton davranışlarını tek yerden yönetme; sayfalardaki kopyala-yapıştırı azaltma.

### Aşama 3: Geliştirme Araçları ve Build
- `package.json`’a basit bir servis komutu ekleme (örn. `http-server` veya `vite` ile `npm run dev`).
- Ortam değişkeni yönetimi için `.env` desteği (yalnızca geliştirme); istemciye sızdırılmaması için backend hazırlığıyla birlikte kullanma.

### Aşama 4: Backend ve Güvenli API Katmanı
- Minimal backend (örn. Node/Express ya da serverless) ekleyerek Gemini çağrısını sunucu tarafına taşıma; API anahtarını yalnız backend’de tutma.
- Görsel yüklemeyi backend’e alıp, `URL.createObjectURL` ile önizleme; yükleme sonrası güvenli depolama (geçici veya kalıcı).
- Veri model taslağı: analiz talebi, kullanıcı metadatası (PII’siz), sonuçlar ve rutin önerileri.

### Aşama 5: Özellik Tamamlama
- “İyileşme Takibi” için yeni sayfa/akış: tarihli analiz karşılaştırmaları, grafiksel değişim.
- “Kredi Yükle” gerçek ödeme akışı: sağlayıcı seçimi (örn. Stripe), kredi bakiyesi state yönetimi.
- “Google ile Kayıt/Giriş” akışı: OAuth 2.0/OpenID Connect ile gerçek entegrasyon.

### Aşama 6: Güvenlik ve Gizlilik
- PII ve görselleri `localStorage`’da tutmama; açık rıza ve veri minimizasyonu prensiplerinin uygulanması.
- ARIA ile erişilebilirlik, form hata mesajları ve klavye navigasyonu iyileştirmeleri.

### Aşama 7: Test ve Otomasyon
- Temel birim testleri (form doğrulama, `localStorage` okuma/yazma mockları).
- Lint ve format (ESLint/Prettier) ekleyerek tutarlılık sağlama.
- CI pipeline (GitHub Actions) ile build ve basit testlerin çalıştırılması.

### Aşama 8: Yayın ve Barındırma
- Statik içerik için CDN önünde barındırma (Netlify/Vercel/Cloudflare Pages), backend için güvenli ortam değişkenleriyle barındırma.
- Cache ve performans: görsel boyutu sınırları, lazy-loading, minify/kompresyon.

### Doğrulama
- Her aşama sonrası doğrulama senaryoları: akışın uçtan uca çalışması, API anahtarı sızıntısı olmaması, yüklenen görselin doğru görünmesi ve rutin üretiminin yanıt vermesi.

Onay verirsen, önce Aşama 1’i uygulayıp akışı dinamik hale getireceğim; ardından refaktör ve backend için artımlı ilerleyeceğim.