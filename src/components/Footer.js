import React from 'react';
import linkedin from '../gifs/linkedin.gif';
import github from '../gifs/github.gif';


const Footer = () => {
   
    return (
        <div className='footer'><div>My links: </div>
            <a style={{textDecoration:"none"}} href="https://linkedin.com/in/daniel-perez-55b8b2235"> <img style={{width:"30px", borderRadius:"10px",}} src={linkedin} alt="linkedin"></img></a>
            <a style={{textDecoration:"none"}} href="https://github.com/dancosmo"> <img style={{width:"30px", borderRadius:"10px",}} src={github} alt="linkedin"></img></a>
        </div>
    );
}

export default Footer;