import React, { useState } from 'react';

function Query({data, onChange }) {
    const handleChange = (field, value) => {
        onChange({
            ...data,
            [field]: value
        });
    };

    return ( 
        <div className="grid grid-cols-12 bg-gray-900">
            <div className="col-span-1 bg-gray-800 p-2 border border-white flex items-center justify-center">
                <label className="flex items-center justify-center">
                    <input 
                        type="checkbox" 
                        className="w-6 h-6"
                        checked={data.isChecked}
                        onChange={(e) => handleChange('isChecked', e.target.checked)}
                    />
                </label>
            </div>
            <div className="col-span-5 bg-gray-800 p-4 border border-white">
                <input 
                    type="text"
                    placeholder="Enter Key"
                    className="w-full bg-gray-800 text-white placeholder-gray-400 focus:outline-none"
                    value={data.key}
                    onChange={(e) => handleChange('key', e.target.value)}
                />
            </div>
            <div className="col-span-6 bg-gray-800 p-4 border border-white">
                <input 
                    type="text"
                    placeholder="Enter Value"
                    className="w-full bg-gray-800 text-white placeholder-gray-400 focus:outline-none"
                    value={data.value}
                    onChange={(e) => handleChange('value', e.target.value)}
                />
            </div>
        </div>
    );
}

export default Query;