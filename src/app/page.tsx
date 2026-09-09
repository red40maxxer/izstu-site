import Image from 'next/image';
import InkBox from './components/InkBox';
import s from './home.module.css';

/* Home page. Layout geometry, type scale and image crops live in
   home.module.css. */

export default function Home() {
  return (
    <div className={s.site}>

      <header className={s.hdrSection}>
        <div className={`${s.grid} ${s.hdrGrid}`}>
          <div className={`${s.img} ${s.banner}`}>
            <Image src="/home/header-banner.png" alt="" fill quality={90} sizes="94vw" priority />
          </div>
          <div className={s.titleBox}>
            <h1>i-stew.art</h1>
          </div>
        </div>
      </header>

      <main>
        <section className={s.sec1}>
          <div className={`${s.grid} ${s.sec1Grid}`}>

            <div className={s.video}>
              <iframe
                src="https://www.youtube.com/embed/mK_Mv3Ca6xk?si=5E30il_SM8J2n6wR"
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            </div>

            <div className={`${s.img} ${s.portrait}`}>
              <Image src="/home/IMG_1921.png" alt="IMG_1921.PNG" fill quality={90} sizes="40vw" priority />
            </div>

            <div className={s.nameBox}>
              {/* Two line-boxes tall; a bare trailing <br> collapses, so the
                  second line is held open with a non-breaking space. */}
              <h6>Isabelle Stewart<br />{' '}</h6>
            </div>

            <div className={`${s.img} ${s.strip}`}>
              <Image src="/home/side-strip.png" alt="" fill quality={90} sizes="7vw" />
            </div>

            <a
              href="https://www.youtube.com/@i-stew"
              target="_blank"
              rel="noreferrer noopener"
              className={`${s.img} ${s.ytPortrait}`}
            >
              <Image src="/home/IMG_1928.png" alt="IMG_1928.PNG" fill quality={90} sizes="11vw" />
              <InkBox />
            </a>

            <div className={`${s.rich} ${s.bio}`}>
              <p>Toronto artist and animator.</p>
              <p>
                contact: <span style={{ fontSize: '14px' }}>isabellepstewart@gmail.com</span>
                <br />
                <br />
                Watch more of my public works on YouTube!<br />{' '}
              </p>
            </div>

          </div>
        </section>

        <section className={s.sec2}>
          <div className={`${s.grid} ${s.sec2Grid}`}>

            <div className={`${s.col} ${s.colA}`}>
              <div className={`${s.colInner} ${s.colAInner}`}>
                <a
                  href="https://youtu.be/bQ10EeYqQtw?si=wL5SVPKB9SXfUasN"
                  target="_blank"
                  rel="noreferrer noopener"
                  className={`${s.img} ${s.thumb1}`}
                >
                  <Image src="/home/yt-thumb-1.png" alt="" fill quality={90} sizes="24vw" />
                  <InkBox />
                </a>
                <a
                  href="https://youtu.be/ADsPBZOKqmc?si=F8BoIkFjFpKhUQjH"
                  target="_blank"
                  rel="noreferrer noopener"
                  className={`${s.img} ${s.thumb2}`}
                >
                  <Image src="/home/yt-thumb-2.png" alt="" fill quality={90} sizes="24vw" />
                  <InkBox />
                </a>
              </div>
            </div>

            <div className={`${s.col} ${s.colB}`}>
              <div className={`${s.colInner} ${s.colBInner}`}>
                <div className={`${s.img} ${s.wide}`}>
                  <Image src="/home/wide-still.webp" alt="" fill quality={90} sizes="21vw" />
                </div>
                {/* TODO: no destination yet - was pointing off-site. */}
                <div className={`${s.img} ${s.square}`}>
                  <Image src="/home/square-link.png" alt="" fill quality={90} sizes="32vw" />
                </div>
                <div className={`${s.img} ${s.tile}`}>
                  <Image src="/home/small-tile.png" alt="" fill quality={90} sizes="7vw" />
                </div>
                <div className={`${s.img} ${s.photo}`}>
                  <Image src="/home/photo.jpg" alt="" fill quality={90} sizes="11vw" />
                </div>
              </div>
            </div>

            <div className={`${s.col} ${s.colC}`}>
              <div className={`${s.colInner} ${s.colCInner}`}>
                <div className={`${s.rich} ${s.noteBox}`}>
                  <p>Site under construction... More to come 👀</p>
                </div>
                <div className={`${s.img} ${s.gif}`}>
                  <Image src="/home/construction.gif" alt="" fill quality={90} sizes="11vw" unoptimized />
                </div>
              </div>
            </div>

          </div>
        </section>
      </main>

    </div>
  );
}
