import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom'; // Use for query parameters
import { 
  Box, 
  List, 
  ListItem, 
  ListItemText, 
  Typography, 
  TextField, 
  Button, 
  Divider, 
  CircularProgress 
} from '@mui/material';
import { useAuth } from './AuthContext';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

const Messages = () => {
  const { userId, isSignedIn } = useAuth();
  const [searchParams] = useSearchParams(); // Access query parameters
  const conversationId = searchParams.get("conversationId"); // Get conversationId from URL
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!userId || !isSignedIn) return;

    const fetchUserAndConversations = async () => {
      try {
        setIsLoading(true);

        // Fetch conversations
        const conversationsResponse = await axios.get(`${API_URL}/users/${userId}/conversations`);
        const conversations = conversationsResponse.data;

        // Map participants to include full names and set display names
        const conversationsWithNames = conversations.map((conversation) => {
          const otherParticipants = conversation.participants.filter(
            (participant) => participant.user_id !== userId
          );
          const displayName = otherParticipants
            .map((p) => p.fullname || `User ${p.user_id}`)
            .join(', ');
          return {
            ...conversation,
            displayName,
          };
        });

        setConversations(conversationsWithNames);

        // Automatically select a conversation if conversationId is provided in the URL
        if (conversationId) {
          const targetConversation = conversationsWithNames.find(
            (c) => c.conversation_id === parseInt(conversationId, 10)
          );
          if (targetConversation) {
            setSelectedConversation(targetConversation);
            fetchMessages(targetConversation);
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserAndConversations();
  }, [userId, isSignedIn, conversationId]);

  const fetchMessages = async (conversation) => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${API_URL}/conversations/${conversation.conversation_id}/messages`);
      const messagesWithNames = response.data.map((message) => ({
        ...message,
        sender_name:
          conversation.participants.find((p) => p.user_id === message.sender_id)?.fullname ||
          `User ${message.sender_id}`,
      }));
      setMessages(messagesWithNames);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConversationClick = (conversation) => {
    setSelectedConversation(conversation);
    fetchMessages(conversation);
  };

  const handleSendMessage = async () => {
    if (!messageText.trim()) return;

    setIsSubmitting(true);
    try {
      await axios.post(`${API_URL}/messages`, {
        text: messageText,
        sender_id: userId,
        conversation_id: selectedConversation.conversation_id,
      });
      setMessageText('');
      fetchMessages(selectedConversation);
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', marginTop: '2rem' }}>
      {/* Conversations List */}
      <Box sx={{ width: '30%', borderRight: '1px solid #ccc', height: '80vh', overflowY: 'auto' }}>
        <Typography variant="h6" sx={{ padding: '1rem' }}>
          Conversations
        </Typography>
        <Divider />
        <List>
          {conversations.map((conversation, index) => (
            <React.Fragment key={conversation.conversation_id}>
              <ListItem
                button
                onClick={() => handleConversationClick(conversation)}
                selected={
                  selectedConversation && selectedConversation.conversation_id === conversation.conversation_id
                }
              >
                <ListItemText primary={conversation.displayName || 'Unnamed Conversation'} />
              </ListItem>
              {index < conversations.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </List>
      </Box>

      {/* Messages Area */}
      <Box sx={{ width: '70%', padding: '1rem', height: '80vh', overflowY: 'auto' }}>
        {selectedConversation ? (
          <>
            <Typography variant="h6">
              Conversation with {selectedConversation.displayName}
            </Typography>
            <Divider sx={{ marginBottom: '1rem' }} />
            {/* Messages List */}
            <Box sx={{ marginBottom: '1rem' }}>
              {messages.map((message) => (
                <Box key={message.message_id} sx={{ marginBottom: '0.5rem' }}>
                  <Typography
                    variant="body2"
                    color={message.sender_id === userId ? 'primary' : 'textSecondary'}
                  >
                    <strong>{message.sender_name}:</strong> {message.text}
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    {new Date(message.created_at).toLocaleString()}
                  </Typography>
                </Box>
              ))}
            </Box>

            {/* Send Message Input */}
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <TextField
                label="Type your message"
                variant="outlined"
                fullWidth
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
              />
              <Button
                variant="contained"
                color="primary"
                onClick={handleSendMessage}
                disabled={isSubmitting}
                sx={{ marginLeft: '1rem' }}
              >
                {isSubmitting ? 'Sending...' : 'Send'}
              </Button>
            </Box>
          </>
        ) : (
          <Typography variant="h6">Select a conversation to view messages</Typography>
        )}
      </Box>
    </Box>
  );
};

export default Messages;
