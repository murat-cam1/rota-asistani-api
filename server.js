const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// 🔑 OPENWEATHERMAP API KEY
const API_KEY = ""; 

// 🌍 ANTALYA ROTA VERİTABANI (TAM LİSTE)
const mekanlar = [
  // --- TARİH ---
  {
    id: 1, ad: "Hadrian Kapısı", kategori: "Tarih", sure: 30, bolge: "Kaleiçi",
    lat: 36.8851, lon: 30.7085,
    aciklama: "Roma döneminden kalma tarihi kapı, Üç Kapılar olarak da bilinir.",
    resim: "/images/hadrian.jpg", ucret: 0
  },
  {
    id: 60, ad: "Hıdırlık Kulesi", kategori: "Tarih", sure: 45, bolge: "Kaleiçi",
    lat: 36.8810, lon: 30.7030,
    aciklama: "Kaleiçi'nin denizle buluştuğu noktada, gün batımının en iyi izlendiği Roma kulesi.",
    resim: "/images/hıdırlık.jpeg", ucret: 0
  },
  {
    id: 61, ad: "Patara Antik Kenti", kategori: "Tarih", sure: 180, bolge: "Kaş",
    lat: 36.2610, lon: 29.3140,
    aciklama: "Likya'nın başkenti ve dünyanın ilk meclis binasının olduğu yer.",
    resim: "/images/patara.jpg", ucret: 340
  },
  {
    id: 4, ad: "Antalya Müzesi", kategori: "Tarih", sure: 90, bolge: "Muratpaşa",
    lat: 36.8854, lon: 30.6800,
    aciklama: "Bölgenin en kapsamlı arkeoloji müzesi, Herakles heykelini görmelisiniz.",
    resim: "/images/muze.jpg", ucret: 340
  },
  {
    id: 6, ad: "Termessos", kategori: "Tarih", sure: 180, bolge: "Döşemealtı",
    lat: 36.9822, lon: 30.4633,
    aciklama: "Dağların tepesinde saklı, Büyük İskender'in alamadığı antik kent.",
    resim: "/images/Termessos.jpg", ucret: 70
  },
  {
    id: 9, ad: "Perge Antik Kenti", kategori: "Tarih", sure: 120, bolge: "Aksu",
    lat: 36.9525, lon: 30.8522,
    aciklama: "Sütunlu caddeleri ve devasa stadyumuyla ünlü antik başkent.",
    resim: "/images/perge.jpeg", ucret: 250
  },
  {
    id: 16, ad: "Myra Antik Kenti", kategori: "Tarih", sure: 90, bolge: "Demre",
    lat: 36.2585, lon: 29.9850,
    aciklama: "Kaya mezarları ve tiyatrosuyla ünlü Likya kenti. Noel Baba Kilisesi'ne çok yakın.",
    resim: "/images/myra.jpg", ucret: 300
  },
  {
    id: 22, ad: "Aspendos Tiyatrosu", kategori: "Tarih", sure: 120, bolge: "Serik",
    lat: 36.9389, lon: 31.1730,
    aciklama: "Dünyanın en iyi korunmuş Roma tiyatrosu, akustiği büyüleyicidir.",
    resim: "/images/aspendos.jpg", ucret: 340
  },
  {
    id: 23, ad: "Phaselis Antik Kenti", kategori: "Tarih", sure: 150, bolge: "Kemer",
    lat: 36.5273, lon: 30.5516,
    aciklama: "Çam ağaçlarının gölgesinde yüzebileceğiniz antik bir liman kenti.",
    resim: "/images/phaselis.jpg", ucret: 220
  },
  {
    id: 24, ad: "Yivli Minare", kategori: "Tarih", sure: 45, bolge: "Kaleiçi",
    lat: 36.8867, lon: 30.7042,
    aciklama: "Antalya'nın sembolü olan 13. yüzyıl Selçuklu şaheseri.",
    resim: "/images/yivliminare.jpg", ucret: 0
  },

  // --- DOĞA ---
  {
    id: 63, ad: "Manavgat Şelalesi", kategori: "Doğa", sure: 60, bolge: "Manavgat",
    lat: 36.8120, lon: 31.4550,
    aciklama: "Antalya'nın en meşhur şelalesi.",
    resim: "/images/manavgat_selale.jpg", ucret: 30
  },
  {
    id: 64, ad: "Saklıkent Kanyonu", kategori: "Doğa", sure: 240, bolge: "Kaş-Fethiye",
    lat: 36.6430, lon: 29.4000,
    aciklama: "Avrupa'nın en uzun kanyonlarından biri. Buz gibi suda yürüyüş yapın.",
    resim: "/images/saklikent_kanyonu.jpg", ucret: 45
  },
  {
    id: 65, ad: "Olympos Teleferik (Tahtalı)", kategori: "Doğa", sure: 120, bolge: "Kemer",
    lat: 36.5400, lon: 30.4300,
    aciklama: "2365 metre zirveye çıkarak 'Sea to Sky' deneyimi yaşayın.",
    resim: "/images/teleferik.jpg", ucret: 1200
  },
  {
    id: 2, ad: "Düden Şelalesi", kategori: "Doğa", sure: 60, bolge: "Lara",
    lat: 36.8524, lon: 30.7833,
    aciklama: "40 metre yükseklikten denize dökülen muhteşem şelale (Aşağı Düden).",
    resim: "/images/duden.jpg", ucret: 50
  },
  {
    id: 3, ad: "Konyaaltı Sahili", kategori: "Doğa", sure: 120, bolge: "Konyaaltı",
    lat: 36.8778, lon: 30.6556,
    aciklama: "Turkuaz deniz ve Beydağları manzaralı, dünyaca ünlü plaj.",
    resim: "/images/konyaalti.jpg", ucret: 0
  },
  {
    id: 7, ad: "Köprülü Kanyon", kategori: "Doğa", sure: 240, bolge: "Manavgat",
    lat: 37.1911, lon: 31.1783,
    aciklama: "Rafting heyecanı ve buz gibi sularıyla ünlü milli park.",
    resim: "/images/kanyon.jpeg", ucret: 0
  },
  {
    id: 10, ad: "Tünektepe Teleferik", kategori: "Doğa", sure: 90, bolge: "Konyaaltı",
    lat: 36.8550, lon: 30.5970,
    aciklama: "Antalya'yı 605 rakımdan kuşbakışı izleyebileceğiniz zirve.",
    resim: "/images/tunektepe.jpg", ucret: 250
  },
  {
    id: 25, ad: "Kurşunlu Şelalesi", kategori: "Doğa", sure: 90, bolge: "Aksu",
    lat: 37.0022, lon: 30.8208,
    aciklama: "Yeşillikler içinde saklı, huzurlu bir doğa harikası.",
    resim: "/images/kursunlu_selale.jpg", ucret: 60
  },
  {
    id: 26, ad: "Tazı Kanyonu", kategori: "Doğa", sure: 180, bolge: "Manavgat",
    lat: 37.2280, lon: 31.1850,
    aciklama: "Devasa uçurum manzarasıyla sosyal medyanın yeni gözdesi.",
    resim: "/images/tazi.jpg", ucret: 0
  },
  {
    id: 27, ad: "Olympos & Çıralı", kategori: "Doğa", sure: 300, bolge: "Kemer",
    lat: 36.3980, lon: 30.4780,
    aciklama: "Caretta Carettalar, ağaç evler ve sönmeyen ateş Yanartaş.",
    resim: "/images/cıralı.jpg", ucret: 100
  },

  // --- EĞLENCE ---
  {
    id: 66, ad: "Antalya Oyuncak Müzesi", kategori: "Eğlence", sure: 45, bolge: "Kaleiçi",
    lat: 36.8840, lon: 30.7050,
    aciklama: "Kaleiçi marinasında, her yaştan ziyaretçiyi çocukluğuna götüren müze.",
    resim: "/images/oyuncak.jpg", ucret: 50
  },
  {
    id: 21, ad: "Land of Legends", kategori: "Eğlence", sure: 360, bolge: "Belek",
    lat: 36.8767, lon: 31.0733,
    aciklama: "Devasa kaydıraklar ve alışveriş caddesiyle 'Antalya'nın Disneyland'ı'.",
    resim: "/images/legends.jpg", ucret: 3000
  },
  {
    id: 8, ad: "Gaga Club", kategori: "Eğlence", sure: 120, bolge: "Muratpaşa",
    lat: 36.8750, lon: 30.7100,
    aciklama: "Falezlerin üzerinde, manzaralı gece hayatının kalbi.",
    resim: "/images/gaga.jpg", ucret: 1500
  },
  {
    id: 11, ad: "Antalya Akvaryum", kategori: "Eğlence", sure: 90, bolge: "Konyaaltı",
    lat: 36.8789, lon: 30.6606,
    aciklama: "Dünyanın en büyük tünel akvaryumlarından biri.",
    resim: "/images/akvaryum.jpg", ucret: 800
  },
  {
    id: 30, ad: "Aura Club Kemer", kategori: "Eğlence", sure: 180, bolge: "Kemer",
    lat: 36.6020, lon: 30.5600,
    aciklama: "Dünyaca ünlü DJ'lerin sahne aldığı, Kemer'in en popüler gece kulübü.",
    resim: "/images/Club-Aura.jpg", ucret: 1000
  },
  {
    id: 31, ad: "BLM Beach", kategori: "Eğlence", sure: 180, bolge: "Lara",
    lat: 36.8500, lon: 30.7500,
    aciklama: "Falezlerin altında, denize sıfır lüks beach club deneyimi.",
    resim: "/images/blm_beach.jpg", ucret: 750
  },
  {
    id: 32, ad: "Jolly Joker Antalya", kategori: "Eğlence", sure: 180, bolge: "Muratpaşa",
    lat: 36.8800, lon: 30.7100,
    aciklama: "Türkiye'nin en ünlü sanatçılarının canlı konser mekanı.",
    resim: "/images/jolly.jpg", ucret: 500
  },
  {
    id: 12, ad: "Sandland", kategori: "Eğlence", sure: 60, bolge: "Lara",
    lat: 36.8530, lon: 30.8120,
    aciklama: "Kum Heykel Müzesi.",
    resim: "/images/sandland.jpg", ucret: 200
  },
  {
    id: 17, ad: "Antalya Su Altı Müzesi", kategori: "Eğlence", sure: 60, bolge: "Side",
    lat: 36.7589, lon: 31.3916,
    aciklama: "Dalış meraklıları için denizin altında büyüleyici heykeller.",
    resim: "/images/side5apollon.jpg", ucret: 1550
  },

  // --- DALIŞ (Scuba Diving) ---
  {
    id: 40, ad: "Kaş Dalış Merkezi (Kanyon)", kategori: "Dalış", sure: 240, bolge: "Kaş",
    lat: 36.1950, lon: 29.6350,
    aciklama: "Batık uçak ve kanyon dalışıyla Türkiye'nin en iyi dalış noktası.",
    resim: "/images/kas-dalis.jpg", ucret: 2500
  },
  {
    id: 41, ad: "Üç Adalar Dalış", kategori: "Dalış", sure: 240, bolge: "Tekirova",
    lat: 36.4550, lon: 30.5500,
    aciklama: "Mağaralar ve zengin su altı canlılığıyla ünlü profesyonel dalış sahası.",
    resim: "/images/ucadalar.jpg", ucret: 2000
  },
  {
    id: 42, ad: "Paris Batığı", kategori: "Dalış", sure: 120, bolge: "Kemer",
    lat: 36.6000, lon: 30.5800,
    aciklama: "Dünyanın en iyi 100 batığından biri olan Fransız savaş gemisi batığı.",
    resim: "/images/paris2.jpg", ucret: 2200
  },

  // --- TEKNE TURLARI ---
  {
    id: 50, ad: "Suluada Tekne Turu", kategori: "Tekne", sure: 480, bolge: "Adrasan",
    lat: 36.2415, lon: 30.4682,
    aciklama: "Türkiye'nin Maldivleri olarak bilinen, bembeyaz kumsallı ada turu.",
    resim: "/images/suluada.jpg", ucret: 1200
  },
  {
    id: 51, ad: "Kekova Batık Şehir Turu", kategori: "Tekne", sure: 360, bolge: "Demre",
    lat: 36.1850, lon: 29.8650,
    aciklama: "Altı camlı teknelerle su altındaki antik kenti izleyebileceğiniz eşsiz tur.",
    resim: "/images/kekova.jpg", ucret: 1500
  },
  {
    id: 52, ad: "Kaleiçi Korsan Tekne Turu", kategori: "Tekne", sure: 60, bolge: "Kaleiçi",
    lat: 36.8835, lon: 30.7025,
    aciklama: "Kaleiçi marinasından kalkan, falezleri ve Düden Şelalesi'ni denizden gören kısa tur.",
    resim: "/images/korsan.jpg", ucret: 300
  },
  {
    id: 53, ad: "Olympos - Ceneviz Koyu", kategori: "Tekne", sure: 420, bolge: "Olympos",
    lat: 36.4000, lon: 30.4700,
    aciklama: "Sadece tekneyle ulaşılabilen bakir koylara ve Ceneviz limanına yolculuk.",
    resim: "/images/ceneviz.jpg", ucret: 1100
  },

  // --- YEMEK (TÜM İLÇELER + LİNKLER) ---
  {
    id: 13, ad: "7 Mehmet", kategori: "Yemek", sure: 120, bolge: "Muratpaşa (Merkez)",
    lat: 36.8820, lon: 30.6650,
    aciklama: "Antalya mutfağının 3 nesillik temsilcisi. Kulaklı çorba ve kuzu tandır efsane.",
    resim: "/images/7-mehmet.jpg", ucret: 2000,
    link: "https://www.google.com/maps/search/?api=1&query=7+Mehmet+Restaurant+Antalya"
  },
  {
    id: 100, ad: "Topçu Kebap", kategori: "Yemek", sure: 60, bolge: "Muratpaşa (Merkez)",
    lat: 36.8860, lon: 30.7040,
    aciklama: "1885'ten beri hizmet veren, Antalya'nın en eski şiş köftecisi. Tahinli piyaz şart.",
    resim: "/images/kebap.jpg", ucret: 450,
    link: "https://www.google.com/maps/search/?api=1&query=Topcu+Kebap+Antalya"
  },
  {
    id: 14, ad: "Piyazcı Ahmet", kategori: "Yemek", sure: 45, bolge: "Muratpaşa (Merkez)",
    lat: 36.8880, lon: 30.7020,
    aciklama: "Antalya usulü tahinli piyazın mucidi sayılan, salaş ama lezzeti dev mekan.",
    resim: "/images/piyazci.jpg", ucret: 250,
    link: "https://www.google.com/maps/search/?api=1&query=Piyazci+Ahmet+Antalya"
  },
  {
    id: 15, ad: "Börekçi Tevfik", kategori: "Yemek", sure: 30, bolge: "Kaleiçi",
    lat: 36.8850, lon: 30.7050,
    aciklama: "Tarihi serpme böreğin yaşayan efsanesi. Sadece sabahları açık!",
    resim: "/images/borekci.jpg", ucret: 200,
    link: "https://www.google.com/maps/search/?api=1&query=Borekci+Tevfik+Antalya"
  },
  {
    id: 101, ad: "Paçacı Şemsi", kategori: "Yemek", sure: 45, bolge: "Konyaaltı",
    lat: 36.8700, lon: 30.6500,
    aciklama: "Antalya'nın 7/24 yaşayan çorbacısı. Kemik suyu çorbaları şifa kaynağı.",
    resim: "/images/pacaci.jpg", ucret: 300,
    link: "https://maps.app.goo.gl/jR8Z5v7Pq5Qx3Y5A8"
  },
  {
    id: 102, ad: "Şimşek Köfte Piyaz", kategori: "Yemek", sure: 45, bolge: "Aksu",
    lat: 36.9400, lon: 30.8500,
    aciklama: "Havalimanı yolunda, 'Aksu Köftesi' denince akla gelen ilk durak.",
    resim: "/images/kofte_piyaz.jpg", ucret: 350,
    link: "https://www.google.com/maps/search/Şimşek+Köfte+Piyaz+Aksu"
  },
  {
    id: 103, ad: "Ulupınar Tropik Restoran", kategori: "Yemek", sure: 120, bolge: "Kemer",
    lat: 36.4100, lon: 30.4500,
    aciklama: "Ayaklarınız suyun içindeyken alabalık yiyebileceğiniz doğal bir cennet.",
    resim: "/images/tropik.jpeg", ucret: 600,
    link: "https://www.google.com/maps/search/?api=1&query=Ulupinar+Tropik+Restoran"
  },
  {
    id: 104, ad: "Zaika Ocakbaşı", kategori: "Yemek", sure: 180, bolge: "Kaş",
    lat: 36.2000, lon: 29.6380,
    aciklama: "Rezervasyonları aylar öncesinden dolan, Kaş'ın en meşhur et restoranı. Şaşlık efsane.",
    resim: "/images/zaika.jpeg", ucret: 1500,
    link: "https://www.google.com/maps/search/?api=1&query=Zaika+Ocakbasi+Kas"
  },
  {
    id: 105, ad: "Mavi Yengeç Restoran", kategori: "Yemek", sure: 90, bolge: "Demre / Beymelek",
    lat: 36.2400, lon: 30.0300,
    aciklama: "Bölgeye özgü 'Mavi Yengeç' yiyebileceğiniz en otantik lagün restoranı.",
    resim: "/images/yengec.jpg", ucret: 800,
    link: "https://www.google.com/maps/search/?api=1&query=Mavi+Yengec+Restaurant+Demre"
  },
  {
    id: 106, ad: "Dim Çayı Pınarbaşı", kategori: "Yemek", sure: 180, bolge: "Alanya",
    lat: 36.5400, lon: 32.0500,
    aciklama: "Buz gibi nehir suyunun üzerindeki çardaklarda kahvaltı ve alabalık keyfi.",
    resim: "/images/dimcayi.jpg", ucret: 500,
    link: "https://www.google.com/maps/search/Dim+%C3%87ay%C4%B1+P%C4%B1narba%C5%9F%C4%B1+Restaurant+Alanya"
  },
  {
    id: 107, ad: "Kadriye Şiş Köftecisi", kategori: "Yemek", sure: 60, bolge: "Serik",
    lat: 36.8700, lon: 31.0000,
    aciklama: "Serik'e özgü şiş köftenin en lezzetli adresi. Salaş ama lezzet dorukta.",
    resim: "/images/kadriye.jpg", ucret: 300,
    link: "https://www.google.com/maps/search/Serik+Kadriye+Şiş+Köfte"
  },
  {
    id: 29, ad: "Şişçi İbo", kategori: "Yemek", sure: 60, bolge: "Korkuteli",
    lat: 36.9500, lon: 30.5500,
    aciklama: "Yaylaya çıkarken meşhur 'Korkuteli Şiş' ve yanık dondurma molası.",
    resim: "/images/ibo.jpg", ucret: 400,
    link: "https://www.google.com/maps/search/?api=1&query=Sisci+Ibo+Korkuteli"
  },
  {
    id: 108, ad: "Elmalı Helvacısı (İsmail)", kategori: "Yemek", sure: 20, bolge: "Elmalı",
    lat: 36.7300, lon: 29.9100,
    aciklama: "Elmalı'nın meşhur sıcak helvasını tatmadan dönmeyin. 100 yıllık lezzet.",
    resim: "/images/helva.jpg", ucret: 100,
    link: "https://www.google.com/maps/search/?api=1&query=Meshur+Helvaci+Ismail+Elmali"
  },
  {
    id: 109, ad: "Kırkgöz Han", kategori: "Yemek", sure: 90, bolge: "Döşemealtı",
    lat: 37.1000, lon: 30.5800,
    aciklama: "Tarihi kervansaray atmosferinde köy kahvaltısı.",
    resim: "/images/han.jpeg", ucret: 400,
    link: "https://maps.google.com/?cid=15215962309800354763&g_mp=Cidnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaFRleHQ"
  },
  {
    id: 28, ad: "Akdeniz Dondurma", kategori: "Yemek", sure: 20, bolge: "Muratpaşa (Merkez)",
    lat: 36.8845, lon: 30.7060,
    aciklama: "Antalya'ya özgü 'Yanık Dondurma'yı denemeden dönmeyin.",
    resim: "/images/dondurma.jpg", ucret: 80,
    link: "https://maps.google.com/?cid=12290549792784542867&g_mp=Cidnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaFRleHQ"
  },
  {
    id: 110, ad: "Adab-ı Balık", kategori: "Yemek", sure: 120, bolge: "Konyaaltı",
    lat: 36.8628698, lon: 30.6297696,
    aciklama: "Akdeniz'in taze lezzetlerini modern bir 'adab' ile sunan, manzara ve lezzeti birleştiren nezih bir aile restoranı.",
    resim: "/images/adab.jpg", ucret: 700,
    link: "https://www.google.com/maps?cid=10248763939935910034&g_mp=Cidnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaFRleHQ"   
  }
];

// 📍 MEKAN LİSTESİ ENDPOINT
app.get('/api/rota', (req, res) => {
  res.json(mekanlar);
});

// ☁️ HAVA DURUMU ENDPOINT
app.get('/api/hava-durumu', async (req, res) => {
    const { lat, lon } = req.query;
    if (!lat || !lon) return res.status(400).json({ error: "Eksik parametre" });

    try {
        const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=tr`;
        const response = await axios.get(weatherUrl);
        const data = response.data;

        res.json({
            sicaklik: Math.round(data.main.temp),
            durum: data.weather[0].description,
            icon: data.weather[0].icon,
            ruzgar: data.wind.speed
        });

    } catch (error) {
        console.error("Hava durumu hatası:", error.message);
        res.status(500).json({ error: "Hava durumu servisine ulaşılamadı." });
    }
});

app.listen(PORT, () => {
  console.log(`✅ Backend ${PORT} portunda çalışıyor. Veritabanında ${mekanlar.length} mekan var!`);
});