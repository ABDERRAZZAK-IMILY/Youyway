import { useEffect, useRef, useState } from 'react';
import { axiosClient } from "../api/axios.js";

export default function Inbox() {
    const [userData, setUserData] = useState({
        auth: null,
        users: []
    });
    const [selectedUser, setSelectedUser] = useState(null);
    const [currentMessages, setCurrentMessages] = useState([]);
    const [messageInput, setMessageInput] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [webSocketChannel, setWebSocketChannel] = useState(null);

    const targetScrollRef = useRef(null);
    const selectedUserRef = useRef(null);

    useEffect(() => {
        const fetchInboxData = async () => {
            try {
                setLoading(true);
                const response = await axiosClient.get('/inbox-data');
                setUserData(response.data);
                
                if (response.data.auth && response.data.auth.user) {
                    localStorage.setItem('userId', response.data.auth.user.id);
                    localStorage.setItem('name', response.data.auth.user.name);
                    setWebSocketChannel(`message.${response.data.auth.user.id}`);
                }
                
                setLoading(false);
            } catch (error) {
                console.error('error fetching inbox data:', error);
                setError('failed to load inbox data. Please try again.');
                setLoading(false);
            }
        };
        fetchInboxData();
    }, []);

    const sendMessage = async () => {
        if (!messageInput.trim()) return;
        try {
            const response = await axiosClient.post(`/messages/${selectedUserRef.current.id}`, {
                message: messageInput
            });
            
            setCurrentMessages(prevMessages => [...prevMessages, response.data]);
            setMessageInput('');
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    const getMessages = async () => {
        try {
            if (!selectedUserRef.current || !selectedUserRef.current.id) {
                console.error('no selected user');
                return;
            }
            
            const response = await axiosClient.get(`/messages/${selectedUserRef.current.id}`);
            setCurrentMessages(response.data);
        } catch (error) {
            console.error('error fetching messages:', error);
            
            if (error.response && error.response.status === 401) {
                setError(' errore 401 Please log in again.');
            } else {
                const errorMessage = error.response?.data?.message;
                setError(`failed to load messages: ${errorMessage}`);
            }
        } 
    };

    useEffect(() => {
        selectedUserRef.current = selectedUser;
        if (selectedUser) {
            getMessages();
        }
    }, [selectedUser]);

    useEffect(() => {
        setTimeout(() => {
            scrollToBottom();
        }, 100);
    }, [currentMessages]);

    const scrollToBottom = () => {
        if (targetScrollRef.current) {
            targetScrollRef.current.scrollIntoView({ behavior: "smooth" });
        }
    };

    useEffect(() => {
        const connectWebSocket = () => {
            if (window.Echo && webSocketChannel) {
                console.log('Connecting to WebSocket channel:', webSocketChannel);
                
                window.Echo.private(webSocketChannel)
                    .listen('MessageSent', (e) => {
                        console.log('MessageSent event received:', e);
                        
                        if (selectedUserRef.current && 
                            (e.message.sender_id === selectedUserRef.current.id || 
                             e.message.recipient_id === selectedUserRef.current.id)) {
                            setCurrentMessages(prevMessages => [...prevMessages, e.message]);
                        }
                        
                        const notificationSound = new Audio('/notification.mp3');
                        notificationSound.play().catch(e => console.log('Error playing sound:', e));
                    });
            } else {
                console.log("Echo is not initialized or WebSocket channel is empty");
            }
        };

        connectWebSocket();

        return () => {
            if (window.Echo && webSocketChannel) {
                console.log('Leaving WebSocket channel:', webSocketChannel);
                window.Echo.leave(webSocketChannel);
            }
        };
    }, [webSocketChannel]);

    const formatTime = (date) => {
        const d = new Date(date);
        return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    if (loading) {
        return (
            <div className="h-screen flex items-center justify-center">
                <div className="text-gray-800 font-bold">Loading...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="h-screen flex items-center justify-center">
                <div className="text-red-500 font-bold">{error}</div>
            </div>
        );
    }

    if (!userData.auth || !userData.auth.user) {
        return (
            <div className="h-screen flex items-center justify-center">
                <div className="text-red-500 font-bold">Authentication error. Please log in again.</div>
            </div>
        );
    }

    return (
        <div>
            <div className="h-screen flex bg-gray-100" style={{height:'90vh'}}>
                {/* sidebar */}
                <div className="w-1/4 bg-white border-r border-gray-200 flex flex-col">
                    <div className="p-4 bg-gray-50 font-bold text-lg border-b border-gray-200">
                        Inbox
                    </div>
                    <div className="flex-1 overflow-y-auto">
                        <div className="p-4 space-y-3">
                            {userData.users.map((user, key) => (
                                <div
                                    key={key}
                                    onClick={()=>setSelectedUser(user)}
                                    className={`flex items-center ${user.id == selectedUser?.id ? 'bg-indigo-600 text-white' : ''} p-2 hover:bg-indigo-600 hover:text-white rounded-lg cursor-pointer transition-colors duration-200`}
                                >
                                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0">
                                        {user.avatar ? (
                                            <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <span className="text-gray-500 text-lg">{user.name.charAt(0).toLowerCase()}</span>
                                        )}
                                    </div>
                                    <div className="ml-3 overflow-hidden">
                                        <div className="font-semibold truncate">{user.name}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="flex flex-col w-3/4">
                    {!selectedUser &&
                        <div className='h-full flex justify-center items-center text-gray-800 font-bold'>
                            Select Conversation
                        </div>
                    }
                    {selectedUser &&
                        <>
                        <div className="p-4 border-b border-gray-200 flex items-center bg-white">
                            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                                {selectedUser.avatar ? (
                                    <img src={selectedUser.avatar} alt={selectedUser.name} className="w-full h-full object-cover" />
                                ) : (
                                    <span className="text-gray-500 text-lg">{selectedUser.name.charAt(0).toLowerCase()}</span>
                                )}
                            </div>
                            <div className="ml-3">
                                <div className="font-bold">{selectedUser?.name}</div>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-gray-50">
                            {currentMessages.map((message, index) => (
                                <div
                                    key={index}
                                    className={`flex flex-col ${message.sender_id == userData.auth.user.id ? "items-end" : "items-start"}`}
                                >
                                    <div
                                        className={`${
                                            message.recipient_id == userData.auth.user.id
                                            ? "bg-gray-200 text-gray-800"
                                            : "bg-indigo-600 text-white"
                                        } px-4 py-2 rounded-2xl max-w-xs`}
                                    >
                                        {message.message}
                                    </div>
                                    <div className="text-xs text-gray-500 mt-1 px-2">
                                        {formatTime(message.created_at || new Date())}
                                    </div>
                                </div>
                            ))}
                            <span ref={targetScrollRef}></span>
                        </div>

                        <div className="p-4 bg-white border-t border-gray-200">
                            <div className="flex items-center">
                                <input
                                    type="text"
                                    placeholder="Type a message..."
                                    className="flex-1 p-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    value={messageInput}
                                    onChange={(e)=>setMessageInput(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                                />
                                <button 
                                    onClick={sendMessage}
                                    className="ml-3 px-6 py-3 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                                    Send
                                </button>
                            </div>
                        </div>
                        </>
                    }
                </div>
            </div>
        </div>
    );
}