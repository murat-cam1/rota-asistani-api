import React, { useState, useEffect } from 'react';

function App() {
  const [mekanlar, setMekanlar] = useState([]);
  const [favoriler, setFavoriler] = useState([]);
  const [filtre, setFiltre] = useState('Hepsi');
  const [maxSure, setMaxSure] = useState('');

  useEffect(() => {
    fetch('http://localhost:5000/api/rota')
      .then(res => res.json())
      .then(data => setMekanlar(data))
      .catch(err => console.error("Hata:", err));
  }, []);

  // SAYACIN DEĞİŞMESİNİ SAĞLAYAN KRİTİK FONKSİYON
 const favoriEkleCikar = (mekan) => {
    setFavoriler((prev) => {
      // ÇÖZÜM: Number() yerine String() kullanın veya direkt karşılaştırın.
      // Bu sayede "abc" gibi ID'ler veya "1" ile 1 uyumsuzluğu bozulmaz.
      const varMi = prev.find(f => f.id === mekan.id);
      
      if (varMi) {
        return prev.filter(f => f.id !== mekan.id);
      } else {
        // Mekanı eklerken sure'yi sayıya çevirmeyi unutmayın (toplama işlemi için)
        // Ancak ID'yi olduğu gibi bırakın.
        return [...prev, { ...mekan, sure: Number(mekan.sure) }];
      }
    });
  };

  // Toplam süre her render'da favoriler üzerinden hesaplanır
  const toplamSure = favoriler.reduce((toplam, m) => toplam + m.sure, 0);

  const filtrelenmis = mekanlar.filter(m => {
    const katUygun = filtre === 'Hepsi' || m.kategori === filtre;
    const sureUygun = maxSure === '' || Number(m.sure) <= Number(maxSure);
    return katUygun && sureUygun;
  });

  return (
    <div style={{ padding: '40px', background: 'linear-gradient(135deg, #FFF5E1 0%, #FFD2A0 100%)', minHeight: '100vh', fontFamily: 'Segoe UI' }}>
      <h1 style={{ textAlign: 'center', color: '#D35400' }}>🌴 Antalya Rota Asistanı</h1>
      
      {/* Kontrol Paneli */}
      <div style={{ maxWidth: '800px', margin: '0 auto 20px', backgroundColor: 'white', padding: '20px', borderRadius: '20px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap' }}>
          <input type="number" placeholder="Maks. Dk" value={maxSure} onChange={(e) => setMaxSure(e.target.value)} style={{ padding: '10px', borderRadius: '12px', border: '2px solid #FFD2A0' }} />
          {['Hepsi', 'Tarih', 'Doğa', 'Yemek'].map(k => (
            <button key={k} onClick={() => setFiltre(k)} style={{ padding: '10px 20px', borderRadius: '25px', cursor: 'pointer', border: 'none', backgroundColor: filtre === k ? '#E67E22' : '#eee', color: filtre === k ? 'white' : 'black', fontWeight: 'bold' }}>{k}</button>
          ))}
        </div>
      </div>

      {/* SARI ÖZET BARI (BURASI ARTIK DEĞİŞECEK) */}
      <div style={{ textAlign: 'center', marginBottom: '30px', padding: '15px', backgroundColor: '#D35400', color: 'white', borderRadius: '15px', fontWeight: 'bold', boxShadow: '0 4px 10px rgba(0,0,0,0.2)' }}>
        🚀 Seçilen Rota: {favoriler.length} mekan | 🕒 Toplam Süre: {toplamSure} dakika
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '20px' }}>
        {filtrelenmis.map(m => {
          const seciliMi = favoriler.some(f => Number(f.id) === Number(m.id));
          return (
            <div key={m.id} style={{ width: '280px', backgroundColor: 'white', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 8px 16px rgba(0,0,0,0.1)', border: seciliMi ? '3px solid #E67E22' : 'none' }}>
              <img src={m.resim} alt={m.ad} style={{ width: '100%', height: '160px', objectFit: 'cover' }} />
              <div style={{ padding: '20px' }}>
                <h3 style={{ margin: '0' }}>{m.ad}</h3>
                <p>⏳ {m.sure} dk</p>
                <button 
                  onClick={() => favoriEkleCikar(m)}
                  style={{ width: '100%', padding: '12px', borderRadius: '12px', border: 'none', backgroundColor: seciliMi ? '#C0392B' : '#27AE60', color: 'white', cursor: 'pointer', fontWeight: 'bold', marginTop: '10px' }}
                >
                  {seciliMi ? '❌ Listeden Çıkar' : '🧡 Rotaya Ekle'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default App;