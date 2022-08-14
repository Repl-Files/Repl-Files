import ui from '../styles/ui.module.scss';
import { join } from '../scripts/short';
import Lnk from 'next/link';
import { useState, useEffect } from 'react'

export const Button = (props) => {
  let classes = props.classes || ''
    
  return (<button
    onClick={props.onClick}
    type={props.btnType || undefined}
    className={`
      ${ui.button}
      ${props.theme ? ui["buttonStyle" + props.theme] : ui.buttonStylePrimary}
      ${classes}`}
    
  >{props.children}</button>)
}

export const Input = ({ value, onChange, placeholder, classes, type }) => {
  let cls = classes || []
  return (<input value={value} onChange={onChange} className={join(ui.input, ...cls)} placeholder={placeholder} type={type || "text"} />)
}

export const TextArea = ({ value, onChange, placeholder, classes, rows }) => {
  let cls = classes || []
  return (<textarea maxLength={1000} value={value} onChange={onChange} className={join(ui.input, ...cls)} placeholder={placeholder} rows={rows || 3} />)
}

export const BoxContainer = ({ children, classes }) => {
  let cls = classes || []
  return (<div className={join(ui.boxContainer, ...cls)}>{children}</div>)
}

export const FlexRow = ({ children, classes }) => {
  let cls = classes || []
  return (<div className={join(ui.flexRow, ...cls)}>{children}</div>)
}

export const FlexCol = ({ children, classes }) => {
  let cls = classes || [];
  return (<div className={join(ui.flexCol, ...cls)}>{children}</div>)
}

export const FlexGrow = () => <div style={{ flexGrow: 1 }}></div>

export const Link = ({ children, href }) => {
  const [windowMain, setWindowMain] = useState(true);
  useEffect(() => {
    if (window.location !== window.parent.location) setWindowMain(false)
  }, []);
  if (!windowMain) return (<a href={href} target="_blank" rel="noreferrer">{children}</a>);
  return (<Lnk href={href} passHref><a>{children}</a></Lnk>);
}

export const FormLabel = ({ children, classes }) => {
  let cls = classes || [];
  return (<div className={join(ui.formLabel, ...cls)}>{children}</div>)
}

export const ToggleSwitch = ({ classes, checked, onChange }) => {
  let cls = classes || [];
  return (<label className={join(ui.switch, ...cls)}>
    <input className={ui.switchInput} type="checkbox" checked={checked} onChange={onChange} />
    <span className={ui.slider}></span>
  </label>)
}

export const UserModal = ({user, setUserModal}) => {
    const [userData, setUserData] = useState(false);

  useEffect(() => {
    if(user) (async () => {
      let dt = await Post("/api/gql", {
        query: `query userByUsername($username: String!) {
          userByUsername(username: $username){
            bio followerCount followCount
          }        
        }`,
        variables: { username: user.username }
      });
      setUserData(dt?.data?.userByUsername);
    })();
  }, [user]);

  if (user) return (<div className={styles.userModalBackdrop} onClick={() => setUserModal(false)}>
    <div className={styles.userModal}>
      <FlexRow classes={[styles.flexUserData]}>
        <img className={styles.userImg} src={user.image} alt="pfp"/>
        <div className={styles.flexRightInfo}>
          <h4 style={{ margin: 0 }}>{user.displayName}</h4>
          <a target="_blank" rel="noreferrer" href={`https://replit.com/@` + user.username}>@{user.username}</a>
        </div>
      </FlexRow>
      <div>
        <h6 style={{margin:0, marginTop: 5}}>{userData?.followerCount||0} followers | {userData?.followCount||0} following</h6>
     </div>
      <hr />
      <div className={styles.roleBioInfo}>
        <h5 style={{ marginBottom: 0 }}>About {user.username}</h5>
        {userData && <p className={styles.userBio}>{(userData?.bio) || "User has no bio"}</p>}
        <h5 style={{ marginBottom: 5 }}>Roles</h5>
        <div className={styles.roleContainer}>
          {user.userRoles.sort((a, b) => b.perm - a.perm).map(r => <div className={styles.inlineRole} desc={r.desc} key={Math.random()} style={{ background: r.color }}>{r.name}</div>)}
        </div>
      </div>
      <FlexRow>
        <FlexGrow/>
        <Button theme="Primary" onClick={() => setUserModal(false)}>Close</Button>
      </FlexRow>
    </div>
  </div>);
  return null;
}
