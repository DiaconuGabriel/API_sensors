import React, { useState } from 'react';
import LinkAndMethod from './LinkAndMethod';
import QueryComponent from './QueryComponent';

function ApiTester() {
    const [url, setUrl] = React.useState("https://api-sensors-9kta.onrender.com/measurements_get");
    const [method, setMethod] = React.useState("GET");
    const [headers, setHeaders] = React.useState([
        { id: 1, key: '', value: '', isChecked: false }
    ]);
    const [params, setParams] = React.useState([
        { id: 1, key: '', value: '', isChecked: false }
    ]);
    const [body, setBody] = React.useState("{}");
    const [response, setResponse] = React.useState("");

    const defaultBodies = {
        "https://api-sensors-9kta.onrender.com/measurements_get": JSON.stringify({
        }, null, 2),
        "https://api-sensors-9kta.onrender.com/measurements_post": JSON.stringify({
            "location": "City",
            "co2": 0,
            "pm2.5": 0,
            "temperature": 0,
            "humidity": 0
        }, null, 2),
        "https://api-sensors-9kta.onrender.com/measurements_delete": JSON.stringify({
        }, null, 2),
        "https://api-sensors-9kta.onrender.com/measurements_put": JSON.stringify({
            "id": 0,
            "co2": 0,
            "pm2.5": 0,
            "temperature": 0,
            "humidity": 0
        }, null, 2)
    };

    const handleUrlChange = (newUrl) => {
        setUrl(newUrl);
        setBody(defaultBodies[newUrl] || "{}");
    };

    const sendRequest = async () => {
        try {
            let fullUrl = url;
            
            const queryParams = new URLSearchParams();
            params
                .filter(p => p.isChecked && p.key.trim() !== '')
                .forEach(p => queryParams.append(p.key.trim(), p.value.trim()));

            const queryString = queryParams.toString();
            if (queryString) {
                fullUrl += "?" + queryString;
            }
            console.log(fullUrl);

            const headersObj = headers
                .filter(h => h.isChecked && h.key.trim() !== '')  
                .reduce((acc, h) => ({ ...acc, [h.key.trim()]: h.value.trim() }), {});
            
            headersObj["Content-Type"] = "application/json";
                 
            const options = { method , headers: headersObj};

            if ((method === "POST" || method === "PUT") && body.trim()) {
                try {
                    const bodyObj = JSON.parse(body);
                    options.body = JSON.stringify(bodyObj);
                } catch (error) {
                    console.error("Invalid JSON body:", error.message);
                    setResponse(`Error: Invalid JSON body`);
                    return;
                }
            }

            console.log('Request Details:');
            console.log('Method:', method);
            console.log('URL:', fullUrl);
            console.log('Headers:', headersObj);
            console.log('Query Parameters:', queryParams);
            console.log('Body:', body);
            console.log('Full Options:', options);

            const res = await fetch(fullUrl, options);
            const result = await res.json();
            setResponse(JSON.stringify(result, null, 2));
        } catch (error) {
            setResponse(`Error: You are doing something wrong!`);
        }
    };

    return (
        <div className="max-w-full mx-auto p-6 rounded-lg">
            <LinkAndMethod 
                url={url} 
                setUrl={handleUrlChange}
                method={method}
                setMethod={setMethod}
                sendRequest={sendRequest}
            />
            
            <QueryComponent
                name="Params"
                queries={params}
                setQueries={setParams}
            />

            <QueryComponent
                name="Header"
                queries={headers}
                setQueries={setHeaders}
            />
        
            <h1 className="text-white text-lg pt-6 pl-3">Body</h1>
            <div className="p-3">
                <textarea
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    placeholder="Enter JSON body"
                    className="w-full h-64 p-3 bg-gray-800 text-white border border-white rounded resize-y font-mono"
                />
            </div>

            <h1 className="text-white text-lg pt-6 pl-3">Response</h1>
            <div className="p-3">
                <textarea
                    value={response}
                    readOnly
                    className="w-full h-96 p-3 bg-gray-800 text-white border border-white rounded resize-y font-mono"
                />
            </div>
        </div>
    );
}

export default ApiTester;