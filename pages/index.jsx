import { Button, FlexRow, BoxContainer, Link } from '../components/ui';
import Head from '../components/Head'
import styles from '../styles/pages/index.module.scss';

export default function Home() {
    return (
        <div>
            <Head titleContent='Home' descriptionContent='Repl Files - Eassy file hosting. Free. Forever.' avatar='./favicon.ico' />
            <div className={styles.section}>
                <div className={styles.mainHeader}>
                    <div className={styles.headerFlex}>
                        <div>
                            <h1>ReplFiles. Hosting made eassy.</h1>
                            <p style={{ marginBottom: 20 }}>Eassy hosting. Free hosting. What&apos;s not to love?</p>
                            <Link href="/login">
                                <Button>Get Started</Button>
                            </Link>
                        </div>
                    </div>

                    <div className={styles.illustration1}>
          <img src="/logobig.png" alt="Big logo!"/>
        </div>
                </div>
            </div>

            <div className={styles.section} id='credits' >
                <div className={`${styles.centerSec} slide-left`}>
                    <h2 style={{ textAlign: 'center' }}>Credits</h2>

                    <div className={styles.tContainer}>
                        <div >
                            <img src="https://replit.com/cdn-cgi/image/width=64,quality=80,format=auto/https://storage.googleapis.com/replit/images/1650209136478_ddae1a1e79240cefc81560ad52e2dc00.png" alt="DillonB07" />
                            <div>
                                <h4>DillonB07</h4>
                                <p>I made this!</p>
                            </div>
                        </div>
                        <div >
                            <img src="https://replit.com/cdn-cgi/image/width=3840,quality=80,format=auto/https://storage.googleapis.com/replit/images/1653679979911_2c9d81f5c210b7c837774aed4326fe21.png" alt="VulcanWM" />
                            <div>
                                <h4>VulcanWM</h4>
                                <p>Helped with the file API and database</p>
                            </div>
                        </div>
                        <div>
                            <img src="https://storage.googleapis.com/replit/images/1640002473076_f2d356e46577519b1463a26769c41e38.png" alt="IroncladDev" />
                            <div>
                                <h4>IroncladDev</h4>
                                <p>Inspiration taken from Replyte and Replverse. I also borrowed some code for styling and authentication.</p>
                            </div>
                        </div>

                        <div>
                            <img src="https://replit.com/public/icons/favicon-196.png" alt="Replit" />
                            <div>
                                <h4>Replit</h4>
                                <p>Inspiration taken from Replit design scheme</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className={styles.section}>
                <h2 style={{ textAlign: 'center' }}>Err...</h2>
                <p style={{ textAlign: 'center' }}>I forgot what this section was for! It&apos;ll stay empty forever now.</p>
            </div>

            <div className={styles.section}>
                <div className={styles.centerSec}>
                    <h1 style={{ textAlign: 'center' }}>Let&apos;s use Eassy Hosting!</h1>
                    <div style={{ position: 'absolute', left: '50%', transform: 'translatex(-50%)' }}>
                        <Link href="/login">
                            <Button>Get Started</Button>
                        </Link>
                    </div>

                </div>
            </div>
        </div>)
}
