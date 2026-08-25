export default function IletisimPage() {
  const whatsapp = "https://wa.me/905375450400";

  return (
    <main className="contactPage">
      <section className="contactHero">
        <p className="eyebrow">SEYDİKEMER EMLAK</p>
        <h1>İletişim</h1>
        <p>
          Gayrimenkul danışmanlığı ve bölge hakkında bilgi almak için
          bizimle iletişime geçebilirsiniz.
        </p>
      </section>

      <section className="contactWrap">
        <div className="contactGrid">
          <a href="tel:+905375450400" className="contactCard">
            <span className="icon">☎</span>
            <div>
              <small>Telefon</small>
              <strong>0537 545 04 00</strong>
            </div>
          </a>

          <a
            href={whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="contactCard"
          >
            <span className="icon">●</span>
            <div>
              <small>WhatsApp</small>
              <strong>Mesaj Gönder</strong>
            </div>
          </a>

          <a
            href="mailto:seydikemeremlak@gmail.com"
            className="contactCard"
          >
            <span className="icon">✉</span>
            <div>
              <small>E-posta</small>
              <strong>seydikemeremlak@gmail.com</strong>
            </div>
          </a>

          <div className="contactCard">
            <span className="icon">⌖</span>
            <div>
              <small>Adres</small>
              <strong>
                Gerişburnu Mah. 68. Cad. No:3/1
                <br />
                Seydikemer / Muğla
              </strong>
            </div>
          </div>
        </div>

        <div className="mapSection">
          <div className="mapTitle">
            <div>
              <p className="eyebrow">KONUM</p>
              <h2>Bizi Haritada Bulun</h2>
            </div>

            <a
              href="https://www.google.com/maps/search/?api=1&query=Gerişburnu+Mahallesi+68.+Cadde+No+3%2F1+Seydikemer+Muğla"
              target="_blank"
              rel="noopener noreferrer"
              className="mapButton"
            >
              Haritalar&apos;da Aç
            </a>
          </div>

          <div className="mapBox">
            <iframe
              src="https://www.google.com/maps?q=Gerişburnu%20Mahallesi%2068.%20Cadde%20No%203%2F1%20Seydikemer%20Muğla&output=embed"
              width="100%"
              height="450"
              style={{ border: 0 }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Seydikemer Emlak Konum"
            />
          </div>
        </div>
      </section>

      <style>{`
        .contactPage{
          min-height:100vh;
          background:#f4f7fb;
          color:#0b1f3a;
        }

        .contactHero{
          background:linear-gradient(120deg,#071b36,#153f6c,#2b6670);
          color:white;
          padding:80px 20px;
          text-align:center;
        }

        .contactHero h1{
          margin:8px 0 12px;
          font-size:clamp(42px,6vw,70px);
        }

        .contactHero p:not(.eyebrow){
          max-width:700px;
          margin:0 auto;
          font-size:18px;
          line-height:1.7;
          color:#dce7f3;
        }

        .eyebrow{
          color:#ff7a18;
          font-weight:800;
          letter-spacing:2px;
          font-size:13px;
          margin:0;
        }

        .contactWrap{
          max-width:1200px;
          margin:0 auto;
          padding:55px 20px 80px;
        }

        .contactGrid{
          display:grid;
          grid-template-columns:repeat(2,minmax(0,1fr));
          gap:18px;
          margin-bottom:55px;
        }

        .contactCard{
          display:flex;
          align-items:center;
          gap:18px;
          padding:25px;
          background:white;
          border:1px solid #e2e8f0;
          border-radius:18px;
          text-decoration:none;
          color:#0b1f3a;
          box-shadow:0 10px 30px rgba(15,35,60,.06);
          transition:.2s ease;
        }

        a.contactCard:hover{
          transform:translateY(-3px);
          border-color:#ff7a18;
        }

        .icon{
          width:52px;
          height:52px;
          flex:0 0 52px;
          display:flex;
          align-items:center;
          justify-content:center;
          border-radius:14px;
          background:#fff1e5;
          color:#ff7a18;
          font-size:25px;
          font-weight:800;
        }

        .contactCard small{
          display:block;
          margin-bottom:5px;
          color:#718096;
          font-size:14px;
        }

        .contactCard strong{
          font-size:18px;
          line-height:1.45;
        }

        .mapSection{
          background:white;
          padding:25px;
          border-radius:22px;
          border:1px solid #e2e8f0;
          box-shadow:0 12px 35px rgba(15,35,60,.07);
        }

        .mapTitle{
          display:flex;
          align-items:center;
          justify-content:space-between;
          gap:20px;
          margin-bottom:20px;
        }

        .mapTitle h2{
          margin:6px 0 0;
          font-size:32px;
        }

        .mapButton{
          background:#ff7a18;
          color:white;
          text-decoration:none;
          font-weight:800;
          padding:14px 20px;
          border-radius:12px;
          white-space:nowrap;
        }

        .mapBox{
          overflow:hidden;
          border-radius:16px;
          border:1px solid #e2e8f0;
        }

        @media(max-width:750px){
          .contactHero{
            padding:55px 18px;
          }

          .contactGrid{
            grid-template-columns:1fr;
          }

          .mapTitle{
            align-items:flex-start;
            flex-direction:column;
          }

          .mapButton{
            width:100%;
            text-align:center;
          }

          .mapBox iframe{
            height:350px;
          }
        }
      `}</style>
    </main>
  );
}