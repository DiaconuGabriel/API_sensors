import React, { useState } from 'react';

function LinkAndMethod({ url, setUrl, method, setMethod, sendRequest }){
    return (
        <div className="flex items-center bg-gray-900 p-3">
            <select
                className="w-32 h-16 p-3 border border-white bg-gray-900 text-blue-300"
                value={method}
                onChange={(e) => setMethod(e.target.value)}
            >
                <option>GET</option>
                <option>POST</option>
                <option>PUT</option>
                <option>DELETE</option>
            </select>
            <select
                className="flex-1 h-16 p-3 border border-white bg-gray-900 text-white"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
            >
                <option>https://api-sensors-9kta.onrender.com/measurements_get</option>
                <option>https://api-sensors-9kta.onrender.com/measurements_post</option>
                <option>https://api-sensors-9kta.onrender.com/measurements_delete</option>
                <option>https://api-sensors-9kta.onrender.com/measurements_put</option>
                </select>    
            <button
                className="w-32 h-16 bg-blue-500 text-white p-3 hover:bg-blue-600 border"
                onClick={sendRequest}
            >
                Send Request
            </button>
        </div>
    );
}

export default LinkAndMethod;