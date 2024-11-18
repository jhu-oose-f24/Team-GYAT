import React, { useState, useEffect } from 'react';
import { 
  Box, 
  List, 
  ListItem, 
  ListItemText, 
  Typography, 
  TextField, 
  Button, 
  Divider 
} from '@mui/material';
import NavBar from './NavBar';
import axios from 'axios';

const Messages = () => {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Replace with the actual logged-in user ID
  const userId = 1;

  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchConversations = async () => {
    try {
      const response = await axios.get(`https://task-market-7ba3283496a7.herokuapp.com/users/${userId}/conversations`);
      const conversations = response.data;

      // Extract unique user IDs from all conversations
      const userIds = [...new Set(conversations.flatMap(c => c.participant_ids.map(p => p.user_id)))];

      // Fetch user details (full names)
      const userDetails = await fetchUserDetails(userIds);

      // Map user IDs to full names and update conversations
      const conversationsWithNames = conversations.map(conversation => ({
        ...conversation,
        participant_ids: conversation.participant_ids.map(participant => ({
          ...participant,
          full_name: userDetails[participant.user_id] || `User ${participant.user_id}`
        }))
      }));

      setConversations(conversationsWithNames);
    } catch (error) {
      console.error('Error fetching conversations:', error);
    }
  };

  const fetchUserDetails = async (userIds) => {
    try {
      const response = await axios.post(`https://task-market-7ba3283496a7.herokuapp.com/user/details`, {
        user_ids: userIds
      });
      return response.data; // Returns { user_id: full_name, ... }
    } catch (error) {
      console.error('Error fetching user details:', error);
      return {};
    }
  };

  const fetchMessages = async (conversationId) => {
    try {
      const response = await axios.get(`https://task-market-7ba3283496a7.herokuapp.com/conversations/${conversationId}/messages`);
      const messagesWithNames = response.data.map(message => ({
        ...message,
        sender_name: conversations
          .find(c => c.conversation_id === conversationId)
          ?.participant_ids.find(p => p.user_id === message.sender_id)?.full_name || `User ${message.sender_id}`
      }));
      setMessages(messagesWithNames);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const handleConversationClick = (conversation) => {
    setSelectedConversation(conversation);
    fetchMessages(conversation.conversation_id);
  };

  const handleSendMessage = async () => {
    if (!messageText.trim()) return;

    setIsSubmitting(true);
    try {
      await axios.post(`https://task-market-7ba3283496a7.herokuapp.com/messages`, {
        text: messageText,
        sender_id: userId,
        conversation_id: selectedConversation.conversation_id,
      });
      setMessageText('');
      fetchMessages(selectedConversation.conversation_id); // Refresh messages
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <NavBar />
      <Box sx={{ display: 'flex', marginTop: '2rem' }}>
        {/* Conversations List */}
        <Box sx={{ width: '30%', borderRight: '1px solid #ccc', height: '80vh', overflowY: 'auto' }}>
          <Typography variant="h6" sx={{ padding: '1rem' }}>Conversations</Typography>
          <Divider />
          <List>
            {conversations.map((conversation) => (
              <ListItem 
                button 
                key={conversation.conversation_id} 
                onClick={() => handleConversationClick(conversation)}
                selected={selectedConversation && selectedConversation.conversation_id === conversation.conversation_id}
              >
                <ListItemText 
                primary={`Conversation ${conversation.conversation_id}`} 
                secondary={`Participants: ${conversation.participants.map(p => p.full_name).join(', ')}`} 
                />
              </ListItem>
            ))}
          </List>
        </Box>

        {/* Messages Area */}
        <Box sx={{ width: '70%', padding: '1rem', height: '80vh', overflowY: 'auto' }}>
          {selectedConversation ? (
            <>
              <Typography variant="h6">Conversation {selectedConversation.conversation_id}</Typography>
              <Divider sx={{ marginBottom: '1rem' }} />
              {/* Messages List */}
              <Box sx={{ marginBottom: '1rem' }}>
                {messages.map((message) => (
                  <Box key={message.message_id} sx={{ marginBottom: '0.5rem' }}>
                    <Typography variant="body2" color={message.sender_id === userId ? 'primary' : 'textSecondary'}>
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
    </>
  );
};

export default Messages;
