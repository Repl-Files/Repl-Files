import ui from '../styles/ui.module.scss';
import { join } from '../scripts/short';
import Lnk from 'next/link';
import { useState, useEffect } from 'react'

export const Button = (props) => {
  let classes = props.classes || ''
    
  return (<button
    onClick={props.onClick}
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