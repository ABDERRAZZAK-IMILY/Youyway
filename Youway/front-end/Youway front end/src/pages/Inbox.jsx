
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
                console.error('Error fetching inbox data:', error);
                setError('Failed to load inbox data. Please try again.');
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
                console.error('No selected user');
                return;
            }
            
            const response = await axiosClient.get(`/messages/${selectedUserRef.current.id}`);
            setCurrentMessages(response.data);
        } catch (error) {
            console.error('Error fetching messages:', error);
            
            if (error.response && error.response.status === 401) {
                setError('Authentication error. Please log in again.');
            } else {
                const errorMessage = error.response?.data?.message || 'Unknown error occurred';
                setError(`Failed to load messages: ${errorMessage}`);
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
            }
        };

        connectWebSocket();

        return () => {
            if (window.Echo && webSocketChannel) {
                window.Echo.leave(webSocketChannel);
            }
        };
    }, [webSocketChannel]);

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
                {/* Sidebar */}
                <div className="w-1/4 bg-white border-r border-gray-200">
                    <div className="p-4 bg-gray-100 font-bold text-lg border-b border-gray-200">
                        Inbox
                    </div>
                    <div className="p-4 space-y-4">
                        {userData.users.map((user, key) => (
                            <div
                                key={key}
                                onClick={()=>setSelectedUser(user)}
                                className={`flex items-center ${user.id == selectedUser?.id ? 'bg-blue-500 text-white' : ''} p-2 hover:bg-blue-500 hover:text-white rounded cursor-pointer`}
                            >
                                <div className="w-12 h-12 bg-blue-200 rounded-full"></div>
                                <div className="ml-4">
                                    <div className="font-semibold">{user.name}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Chat Area */}
                <div className="flex flex-col w-3/4">
                    {!selectedUser &&
                        <div className=' h-full flex justify-center items-center text-gray-800 font-bold'>
                            Select Conversation
                        </div>
                    }
                    {selectedUser &&
                        <>
                        {/* Chat Header */}
                        <div className="p-4 border-b border-gray-200 flex items-center">
                            <div className="w-12 h-12 bg-blue-200 rounded-full"></div>
                            <div className="ml-4">
                                <div className="font-bold">{selectedUser?.name}</div>
                            </div>
                        </div>

                        {/* Chat Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                            {currentMessages.map((message, index) => (
                                <div
                                    key={index}
                                    className={`flex ${
                                        message.sender_id  == userData.auth.user.id ? "justify-end" : "justify-start"
                                    }`}
                                >
                                    <div
                                        className={`${
                                            message.recipient_id  == userData.auth.user.id
                                            ? "bg-gray-200 text-gray-800"
                                            : "bg-blue-500 text-white"
                                        } p-3 rounded-lg max-w-xs`}
                                    >
                                        {message.message}
                                    </div>
                                </div>
                            ))}
                            <span ref={targetScrollRef}></span>
                        </div>

                        {/* Message Input */}
                        <div className="p-4 bg-white border-t border-gray-200">
                            <div className="flex items-center">
                                <input
                                    type="text"
                                    placeholder="Type a message..."
                                    className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={messageInput}
                                    onChange={(e)=>setMessageInput(e.target.value)}
                                />
                                <button 
                                    onClick={sendMessage}
                                    className="ml-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
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