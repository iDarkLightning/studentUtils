import React from "react";

const Util = ({ name, image, route }) => {
    return (
        <div className="util">
            <a href={route}>
                <button>
                    <img src={image}/>
                    <h3>{name}</h3>
                </button>
            </a>
        </div>
    )
}

export default Util;