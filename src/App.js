import React, { useState, useEffect } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";

// ⚠️ GEMINI API KEY
const GEMINI_API_KEY = ""; 

function App() {
  const [mekanlar, setMekanlar] = useState([]);
  const [favoriler, setFavoriler] = useState([]);
  const [seciliMekanId, setSeciliMekanId] = useState(null);
  const [veriYukleniyor, setVeriYukleniyor] = useState(true);
  
  // Özellik State'leri
  const [muzekartVar, setMuzekartVar] = useState(false);
  const [aiBilgi, setAiBilgi] = useState({ cevap: "", temp: "", durum: "" });
  const [loading, setLoading] = useState(false);

  // 1️⃣ Backend'den Mekanları Çek
  useEffect(() => {
    fetch('http://localhost:5000/api/rota')
      .then(res => {
        if (!res.ok) throw new Error("Backend yok");
        return res.json();
      })
      .then(data => {
        setMekanlar(data);
        setVeriYukleniyor(false);
      })
      .catch(err => {
        console.warn("API Hatası, lütfen Backend'i (node server.js) çalıştır.", err);
        setVeriYukleniyor(false);
      });
  }, []);

  // ✅ KATEGORİLERE GÖRE GRUPLAMA
  const kategoriler = {
    "Tarih": mekanlar.filter(m => m.kategori === "Tarih"),
    "Doğa": mekanlar.filter(m => m.kategori === "Doğa"),
    "Eğlence": mekanlar.filter(m => m.kategori === "Eğlence"),
    "Dalış": mekanlar.filter(m => m.kategori === "Dalış"),
    "Tekne": mekanlar.filter(m => m.kategori === "Tekne"),
    "Yemek": mekanlar.filter(m => m.kategori === "Yemek"),
  };

  // ✅ ARKA PLAN RESİMLERİ
  const kategoriArkaPlanlari = {
    "Tarih": "https://images.unsplash.com/photo-1528164344705-475426870763?q=80&w=2070&auto=format&fit=crop", 
    "Doğa": "https://images.unsplash.com/photo-1433838552652-f9a46b332c40?q=80&w=2070&auto=format&fit=crop", 
    "Eğlence": "https://images.unsplash.com/photo-1566737236500-c8ac43014a67?q=80&w=2070&auto=format&fit=crop", 
    "Dalış": "https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=2070&auto=format&fit=crop",
    "Tekne": "https://images.unsplash.com/photo-1534008897995-27a23e859048?q=80&w=2070&auto=format&fit=crop",
    "Yemek": "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1974&auto=format&fit=crop", 
  };

  const rotayiHaritadaGoster = () => {
    if (favoriler.length === 0) return alert("Listeniz boş! Hadi birkaç güzel yer seçelim.");
    const duraklar = favoriler.map(m => encodeURIComponent(m.ad)).join('/');
    const haritaUrl = `https://www.google.com/maps/dir/Current+Location/${duraklar}`;
    window.open(haritaUrl, '_blank');
  };

  const toggleFavori = (mekan) => {
    const varMi = favoriler.find(f => f.id === mekan.id);
    if (varMi) setFavoriler(favoriler.filter(f => f.id !== mekan.id));
    else setFavoriler([...favoriler, mekan]);
  };

  // 2️⃣ AI & HAVA DURUMU FONKSİYONU
  const askSmartAI = async (mekan) => {
    if (seciliMekanId === mekan.id) { setSeciliMekanId(null); return; }
    
    setSeciliMekanId(mekan.id);
    setLoading(true);
    setAiBilgi({ cevap: "", temp: "", durum: "" });

    try {
      const wRes = await fetch(`http://localhost:5000/api/hava-durumu?lat=${mekan.lat}&lon=${mekan.lon}`);
      if (!wRes.ok) throw new Error("Hava durumu alınamadı");
      const wData = await wRes.json(); 

      const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      
      const prompt = `Antalya ${mekan.ad} konumundayım. Hava şu an ${wData.sicaklik} derece ve ${wData.durum}. Burası için bana turist rehberi ağzıyla çok kısa, samimi bir ipucu ver.`;
      const result = await model.generateContent(prompt);
      
      setAiBilgi({ 
          cevap: result.response.text(), 
          temp: wData.sicaklik, 
          durum: wData.durum 
      });

    } catch (err) {
      console.error(err);
      setAiBilgi({ cevap: "Hava durumu sunucusuna ulaşılamadı ama manzara harika!", temp: "--", durum: "?" });
    } finally { 
      setLoading(false); 
    }
  };

  if (veriYukleniyor) return <div style={{display:'flex', justifyContent:'center', alignItems:'center', height:'100vh', background:'#111827', color:'#38bdf8', fontSize:'20px'}}>🌘 Rotalar Yükleniyor...</div>;

  return (
    <div style={{ fontFamily: "'Poppins', sans-serif", background: '#000' }}>
      
      <style>{`
        /* ✨ GÜNCELLENEN STİLLER: OVAL BUTTON MENÜ */
        html { scroll-behavior: smooth; }
        
        .nav-links {
            display: flex; 
            gap: 15px; /* Kutu aralıkları */
        }
        
        .nav-link {
            color: #cbd5e1;
            text-decoration: none;
            font-size: 13px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 1px;
            
            /* Kutu Tasarımı */
            padding: 8px 20px;
            border: 1px solid rgba(255, 255, 255, 0.15); /* İnce çerçeve */
            border-radius: 50px; /* Tam oval şekil */
            background: rgba(255, 255, 255, 0.05); /* Çok hafif şeffaf arka plan */
            transition: all 0.3s ease; /* Yumuşak geçiş */
        }

        .nav-link:hover {
            color: #fff;
            border-color: #f97316; /* Hover'da turuncu çerçeve */
            background: rgba(249, 115, 22, 0.2); /* Hover'da hafif turuncu dolgu */
            box-shadow: 0 0 15px rgba(249, 115, 22, 0.4); /* Parlama efekti */
            transform: translateY(-2px); /* Hafif yukarı kalkma */
        }
        /* ✨ STİL BİTİŞ */

        body { margin: 0; padding: 0; color: #e2e8f0; }
        * { box-sizing: border-box; }

        .navbar { 
            display: flex; justify-content: space-between; align-items: center; 
            padding: 15px 40px; 
            background: rgba(0, 0, 0, 0.9);
            backdrop-filter: blur(15px);
            position: sticky; top: 0; z-index: 1000;
            border-bottom: 1px solid rgba(255,255,255,0.1);
        }

        .category-section {
            position: relative;
            min-height: 100vh;
            padding: 60px 40px;
            background-attachment: fixed;
            background-position: center;
            background-size: cover;
            background-repeat: no-repeat;
            display: flex;
            flex-direction: column;
            justify-content: center;
            scroll-margin-top: 80px; 
        }

        .overlay {
            position: absolute; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0, 0, 0, 0.75);
            z-index: 1;
        }

        .section-content { position: relative; z-index: 2; }

        .category-title {
            font-size: 40px; font-weight: 800; color: #f8fafc;
            margin-bottom: 30px; 
            text-transform: uppercase; letter-spacing: 2px;
            text-shadow: 0 4px 10px rgba(0,0,0,0.5);
            border-left: 6px solid #f97316;
            padding-left: 20px;
        }

        .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 30px; }
        
        .card {
            background: rgba(30, 41, 59, 0.85);
            backdrop-filter: blur(5px);
            border-radius: 20px; overflow: hidden;
            border: 1px solid rgba(255, 255, 255, 0.1);
            transition: all 0.4s ease;
            display: flex; flex-direction: column;
        }
        .card:hover { transform: translateY(-10px); box-shadow: 0 20px 40px rgba(0,0,0,0.6); border-color: #f97316; }
        
        .img-container { height: 200px; position: relative; }
        .card-img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s ease; }
        .card:hover .card-img { transform: scale(1.05); }

        .btn-gradient {
            background: linear-gradient(135deg, #f97316 0%, #fb923c 100%);
            color: white; border: none; padding: 10px 25px; border-radius: 50px;
            font-weight: bold; cursor: pointer; transition: 0.3s;
        }
        .btn-gradient:hover { transform: scale(1.05); box-shadow: 0 0 15px rgba(249, 115, 22, 0.6); }

        .muzekart-btn {
            background: rgba(255,255,255,0.1); color: white; border: 1px solid rgba(255,255,255,0.2);
            padding: 8px 16px; border-radius: 8px; cursor: pointer;
        }

        @media (max-width: 1000px) {
            .nav-links { display: none; }
        }
      `}</style>

      {/* Navbar */}
      <nav className="navbar">
        <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
            <span style={{fontSize:'28px'}}>🏝️</span>
            <div>
                <div style={{ fontWeight: 800, color: '#38bdf8', fontSize: '18px' }}>ANTALYA</div>
                <div style={{ fontWeight: 400, color: '#f97316', fontSize: '11px', letterSpacing:'1px' }}>ROTA ASİSTANI</div>
            </div>
        </div>

        {/* ✨ GÜNCELLENEN OVAL MENÜ */}
        <div className="nav-links">
            {Object.keys(kategoriler).map(katAdi => (
                <a key={katAdi} href={`#${katAdi}`} className="nav-link">
                    {katAdi}
                </a>
            ))}
        </div>

        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
            <button 
              onClick={() => setMuzekartVar(!muzekartVar)}
              className="muzekart-btn"
              style={{background: muzekartVar ? '#4f46e5' : 'transparent'}}
            >
              {muzekartVar ? "💳 Müzekart Var" : "💳 Müzekart Yok"}
            </button>
            <div style={{fontWeight:'700', color:'#f97316'}}>
               {favoriler.length > 0 ? `${favoriler.length} Mekan Seçildi` : "Rota Oluşturulmadı"}
            </div>
            <button onClick={rotayiHaritadaGoster} className="btn-gradient">
                Rotayı Çiz 🚀
            </button>
        </div>
      </nav>

      {/* ROTA LİSTESİ */}
      {Object.keys(kategoriler).map((katAdi) => {
          const mekanListesi = kategoriler[katAdi];
          if (mekanListesi.length === 0) return null;

          return (
            <div key={katAdi} id={katAdi} className="category-section" style={{ backgroundImage: `url(${kategoriArkaPlanlari[katAdi] || kategoriArkaPlanlari["Doğa"]})` }}>
                <div className="overlay"></div>
                <div className="section-content">
                    <h2 className="category-title">{katAdi} Rotaları</h2>
                    <div className="grid">
                        {mekanListesi.map(m => {
                            const favorideMi = favoriler.some(f => f.id === m.id);
                            const ucret = (muzekartVar && m.kategori === 'Tarih') ? 0 : parseInt(m.ucret);
                            
                            return (
                                <div key={m.id} className="card">
                                    <div className="img-container">
                                        <img src={m.resim} className="card-img" alt={m.ad} />
                                    </div>
                                    <div style={{ padding: '20px', display:'flex', flexDirection:'column', flex:1 }}>
                                        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'10px'}}>
                                            <h3 style={{margin:0, color:'#f1f5f9'}}>{m.ad}</h3>
                                            <span style={{color: ucret === 0 ? '#4ade80' : '#f97316', fontWeight:'bold'}}>
                                                {ucret === 0 ? "ÜCRETSİZ" : `${ucret} ₺`}
                                            </span>
                                        </div>
                                        <p style={{fontSize:'13px', color:'#94a3b8', flex:1}}>{m.aciklama}</p>
                                        
                                        <div style={{ display: 'flex', gap: '10px', marginTop:'15px' }}>
                                            <button onClick={() => askSmartAI(m)} style={{flex:1, padding:'10px', borderRadius:'8px', border:'none', background:'#334155', color:'#38bdf8', cursor:'pointer', fontWeight:'bold'}}>✨ AI İpucu</button>
                                            <button onClick={() => toggleFavori(m)} style={{flex:1, padding:'10px', borderRadius:'8px', border:'none', background: favorideMi ? '#ef4444' : '#0f766e', color:'white', cursor:'pointer', fontWeight:'bold'}}>
                                                {favorideMi ? "Çıkar" : "Ekle +"}
                                            </button>
                                        </div>

                                        {/* 👇 RESTORANLAR İÇİN YORUM BUTONU 👇 */}
                                        {m.kategori === 'Yemek' && m.link && (
                                            <a href={m.link} target="_blank" rel="noreferrer" 
                                               style={{
                                                   display: 'block', 
                                                   marginTop: '10px', 
                                                   textAlign: 'center', 
                                                   color: '#fbbf24', 
                                                   textDecoration: 'none', 
                                                   fontSize: '13px', 
                                                   fontWeight: 'bold',
                                                   border: '1px dashed #fbbf24',
                                                   padding: '5px',
                                                   borderRadius: '8px'
                                               }}>
                                               💬 Yorumları Oku (Google Maps) ↗
                                            </a>
                                        )}
                                        {/* 👆 RESTORAN KODU BİTİŞ 👆 */}

                                        {seciliMekanId === m.id && (
                                            <div style={{marginTop:'15px', padding:'10px', background:'rgba(0,0,0,0.3)', borderRadius:'10px', borderLeft:'3px solid #38bdf8', fontSize:'13px', color:'#e2e8f0'}}>
                                                {loading ? "Zeka düşünüyor..." : (
                                                    <div>
                                                        <div style={{marginBottom:'5px', color: '#fbbf24'}}>🌡️ {aiBilgi.temp}°C - {aiBilgi.durum.toUpperCase()}</div>
                                                        {aiBilgi.cevap}
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
          );
      })}

      <footer className="footer">
        <div className="flex-direction: row; gap: 10px; align-items: center;">
            <span style={{fontWeight:'800', color:'#38bdf8'}}>ANTALYA ROTA ASİSTANI</span>
            <div className="divider"></div>
            <span> Rotaasistanı </span>
        </div>
        
        <div className="footer-right">
            <span>2026</span>
            <div className="divider"></div>
            <span>Kepez / Antalya</span>
            <div className="divider"></div>
            <a href="#" className="footer-link"> Rotaasistanı © Tüm hakları saklıdır.</a>
        </div>
      </footer>
    </div>
  );
}

export default App;