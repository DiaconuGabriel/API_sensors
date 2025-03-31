function QueryComponent({name, queries, setQueries }) {
    const addQuery = () => {
        setQueries([
            ...queries,
            { id: queries.length + 1, key: '', value: '', isChecked: false }
        ]);
    };

    const removeQuery = () => {
        if (queries.length > 1) {
            setQueries(queries.slice(0, -1));
        }
    };

    const handleQueryChange = (id, updatedData) => {
        setQueries(queries.map(q => 
            q.id === id ? { ...q, ...updatedData } : q
        ));
    };

    return (
        <div className="mt-4">
            <div className="flex justify-between items-center pl-3 pr-3">
                <h1 className="text-white text-lg pt-6">{name}</h1>
                <div className="flex gap-2">
                    <button 
                        onClick={addQuery}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                        Add
                    </button>
                    <button 
                        onClick={removeQuery}
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                        disabled={queries.length <= 1}
                    >
                        Remove
                    </button>
                </div>
            </div>

            <div className="text-white text-sm p-3">
                {queries.map((query) => (
                    <Query 
                        key={query.id}
                        data={query}
                        onChange={(updatedData) => handleQueryChange(query.id, updatedData)}
                    />
                ))}
            </div>
        </div>
    );
}