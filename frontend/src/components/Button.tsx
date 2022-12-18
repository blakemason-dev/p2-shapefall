import React from "react";

import './Button.css';

const ev = new Event("deploy-shape");

const Button = () => {
    const handleClick = () => {
        
        window.dispatchEvent(ev);
    }

    return (
        <div className="button">
            <button className="button_deploy" onClick={handleClick}>Deploy Shape</button>
        </div>
    )
}

export default Button;