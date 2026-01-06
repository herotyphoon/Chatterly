const express = require('express');

const {
    handleSendRequest,
    handleGetIncomingFriendRequests,
    handleGetOutgoingFriendRequests,
    handleAcceptFriendRequest,
    handleRejectFriendRequest,
    handleDeleteFriendRequest,
    handleGetAllFriends,
    handleRemoveFriend
} = require('../controllers/friends.controllers.js');
const {validateSendFriendRequest} = require('../middleware/friends/validateSendFriendRequest.middleware.js');
const {validateAcceptFriendRequest} = require('../middleware/friends/validateAcceptFriendRequest.middleware.js');
const {validateRejectFriendRequest} = require('../middleware/friends/validateRejectFriendRequest.middleware.js');
const {validateDeleteFriendRequest} = require('../middleware/friends/validateDeleteFriendRequest.middleware.js');
const { validateRemoveFriend } = require('../middleware/friends/validateRemoveFriend.middleware.js');

const router = express.Router();

router.post('/requests', validateSendFriendRequest, handleSendRequest);

router.get('/requests/incoming', handleGetIncomingFriendRequests);

router.get('/requests/outgoing', handleGetOutgoingFriendRequests);

router.patch('/requests/:id/accept', validateAcceptFriendRequest, handleAcceptFriendRequest);

router.patch('/requests/:id/reject', validateRejectFriendRequest, handleRejectFriendRequest);

router.delete('/requests/:id', validateDeleteFriendRequest, handleDeleteFriendRequest);

router.get('/', handleGetAllFriends);

router.delete('/:userId', validateRemoveFriend, handleRemoveFriend);

module.exports = router;