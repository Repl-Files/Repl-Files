import styles from '../styles/pages/Login.module.scss'
import { Post } from '../scripts/fetch'
import { Button, FlexCol, FlexRow, FlexGrow, Link } from '../components/ui';
import { useState, useCallback } from 'react';

export default function Login() {

  const [authStep, setAuthStep] = useState(0);
  const [error, setError] = useState("");

  const login = useCallback(() => {
    window.addEventListener('message', authComplete);

    var h = 400;
    var w = 350;
    var left = 0;
    var top = screen.height - (h / 2);

    var authWindow = window.open(
      'https://replit.com/auth_with_repl_site?domain=' + location.host,
      '_blank',
      'modal =yes, toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=' + w + ', height=' + h + ', top=' + top + ', left=' + left)

    function authComplete(e) {
      if (e.data !== 'auth_complete') {
        return;
      }

      window.removeEventListener('message', authComplete);

      Post("/api/login", {}).then(authed => {
        if (authed.success) setAuthStep(1);
        else setError(auth.error)
      })
      authWindow.close();
    }
  }, []);

  return (<div>
    <div className={styles.loginContainer}>
      <FlexCol>

        {authStep === 0 && <FlexCol classes={[styles.autoOverflow]}>
          <h3>Authorize Replit</h3>
          <p>Connect your replit account to get started</p>
          <div><Button onClick={login}>Log in with Replit</Button></div>
          {error && <p style={{ color: "var(--danger-higher)" }}>{error}</p>}
        </FlexCol>}
        
        {authStep === 1 && <FlexCol classes={[styles.autoOverflow]}>
          <h3>Rules and Important Information</h3>
          <p>1. Keep uploads under 2MB<br />
            2. There is only 10MB of storage per person due to database limitations.<br />
            3. No offensive names or files<br />
            4. 24/7 hosting is NOT guaranteed<br />
            5. Do not store sensitive files<br />
            6. Do not spam or attempt to bot this website - in doing so, you will be permanently banned<br />
            7. Don&apos;t bend the rules<br />
            8. Listen to moderators. Their decisions are final</p>
          <FlexRow>
            <FlexGrow/>
            <Button onClick={() => setAuthStep(2)}>Next</Button>
          </FlexRow>
        </FlexCol>}

        {authStep === 2 && <FlexCol>
          <h3>Enjoy!</h3>
          <p>Your account has been setup and you can begin using Repl Files. Remember to adhere to the rules or your account may be banned.<br/>Welcome and let&apos;s start hosting!</p>
          <FlexGrow/>
          <FlexRow>
            <FlexGrow/>
            <Link href="/dashboard"><Button onClick={() => {}}>Get Started</Button></Link>
          </FlexRow>
        </FlexCol>}


        <FlexGrow/>
        <div className={styles.progressContainer}>
          <div className={styles.progressBar + " " + (authStep === 0 ? styles.active : "")}></div>
          <div className={styles.progressBar + " " + (authStep === 1 ? styles.active : "")}></div>
          <div className={styles.progressBar + " " + (authStep === 2 ? styles.active : "")}></div>
        </div>
      </FlexCol>

    </div>
  </div>)
}


import { User } from '../scripts/mongo'
export async function getServerSideProps({ req }){
  let foundUser = await User.findOne({ 
    userId: Number(req.headers['x-replit-user-id']||"0") 
  });
  if(foundUser && !foundUser.banned){
    return {
      redirect: {
        destination: "/dashboard"
      }
    }
  }else{
    return {
      props: {}
    }
  }
}