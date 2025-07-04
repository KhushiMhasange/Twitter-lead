import { useState, useCallback } from 'react';
import axios from 'axios'

export default function PostFetcher() {
    interface LeadDoc {
     content: string;
     filename: string;
     fileType: string;
     fileSize: number;
     lastModified: string;
    }
    //defines object shape - custom data type
    interface leadData {
    user_id: string;
    organization_id: string;
    documents: LeadDoc[];
    source: string;
    context_type: string;
    scope: string;
    metadata: {
        fileName: string;
        fileType: string;
        fileSize: number;
        lastModified: string;
    };
    }
    interface AxiosErrorMsg{
        response?:{
            data?:{
                message?:string;
            }
        }
    }

    const [tweetIdInput, setTweetIdInput] = useState('');
    const [fetchedLead, setFetchedLead] = useState<leadData | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchTweetById = useCallback(async () => {
        if (!tweetIdInput.trim()) { 
            setError('Please enter a Tweet ID.');
            setFetchedLead(null);
            return;
        }
        setLoading(true); 
        setError(null); 
        setFetchedLead(null);

        try {
            const res = await axios.get<leadData>(`http://localhost:4000/capture-leads?tweetId=${tweetIdInput}`);
            console.log(res.data);
            setFetchedLead(res.data);
            
        } catch (err:unknown) {
            const error = err as AxiosErrorMsg
            const message = error?.response?.data?.message;
            setError(message || 'Failed to fetch tweet. Please check the ID and try again.');
            setFetchedLead(null); 
        } 
        setLoading(false);
    }, [tweetIdInput]);
    return (
        <div className="min-h-screen bg-zinc-900 text-white p-4 flex flex-col items-center font-inter">
            {/* Header Section */}
            <h1 className="text-3xl font-bold text-teal-400 mb-8 mt-4 rounded-lg p-2 shadow-lg">
                Fetch Twitter Posts by ID
            </h1>

            {/* Input and Button Section */}
            <div className="bg-zinc-800 p-6 rounded-lg shadow-xl w-full max-w-md flex flex-col gap-4">
                <label htmlFor="tweetId" className="text-zinc-300 text-lg font-medium">
                    Enter Twitter Tweet ID:
                </label>
                <input
                    type="text"
                    id="tweetId"
                    className="w-full p-3 rounded-md bg-zinc-700 border border-zinc-600 focus:border-teal-500 focus:ring focus:ring-teal-500 focus:ring-opacity-50 text-white placeholder-zinc-400 text-lg"
                    value={tweetIdInput}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTweetIdInput(e.target.value)}
                    placeholder="e.g., 1460323737035677698 or 1234567890123456789" 
                    aria-label="Twitter Tweet ID input"
                />
                <button
                    onClick={fetchTweetById}
                    className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 px-4 rounded-md shadow-md transition duration-300 ease-in-out transform hover:scale-105
                               disabled:bg-zinc-600 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    disabled={loading} 
                    aria-live="polite"
                >
                    {loading && (
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    )}
                    {loading ? 'Fetching Tweet...' : 'Fetch Tweet'}
                </button>
            </div>

            {/* Display Area for Fetched Leads */}
            <div className="mt-8 w-full max-w-2xl bg-zinc-800 p-6 rounded-lg shadow-xl">
                <h2 className="text-2xl font-semibold text-teal-300 mb-4 border-b border-zinc-700 pb-2">
                    Fetched Lead Details
                </h2>

                {error && (
                    <div role="alert" className="bg-red-900 text-red-200 p-3 rounded-md mb-4 border border-red-700">
                        Error: {error}
                    </div>
                )}

                {!fetchedLead && !loading && !error && (
                    <p className="text-zinc-400 text-center">Enter a Tweet ID and click "Fetch Leads" to see details.</p>
                )}

                {fetchedLead && (
                    <div className="mb-4 flex flex-col items-start">
                        <h3 className="text-xl font-bold text-teal-200 mb-2">Lead Summary:</h3>
                        <p className="text-zinc-100"><strong>User ID:</strong> {fetchedLead.user_id}</p>
                        <p className="text-zinc-100"><strong>Organization ID:</strong> {fetchedLead.organization_id}</p>
                        <p className="text-zinc-100"><strong>Source:</strong> {fetchedLead.source}</p>
                        <p className="text-zinc-100"><strong>Context Type:</strong> {fetchedLead.context_type}</p>
                        <p className="text-zinc-100"><strong>Scope:</strong> {fetchedLead.scope}</p>
                        <h4 className="text-lg font-semibold text-teal-200 mt-4 mb-2">Documents (Leads):</h4>
                        {fetchedLead.documents && fetchedLead.documents?.length > 0 ? (
                            fetchedLead.documents.map((leadDoc, index) => (
                                <div key={index} className="bg-zinc-700 w-full p-4 rounded-md mb-3 shadow-inner">
                                    <p className="text-zinc-100 text-base text-left leading-relaxed whitespace-pre-wrap break-words mb-2">
                                        {leadDoc.content || 'No content available.'}
                                    </p>
                                </div>
                            ))
                        ) : (
                            <p className="text-zinc-400">No lead documents found for this tweet ID.</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
