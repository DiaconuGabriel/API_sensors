function App() {
    return (
        <div className="min-w-[600px] min-h-screen bg-gray-900 p-6">
            <h1 className="text-3xl font-bold text-center mb-4 text-gray-100">Test the API here!</h1>
            <ApiTester />
        </div>
    );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);