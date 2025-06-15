const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.post('/get-placeid', async (req, res) => {
  const userId = req.body.userId;
  if (!userId) return res.status(400).json({ error: 'Missing userId' });

  try {
    const response = await axios.post('https://presence.roblox.com/v1/presence/users', {
      userIds: [parseInt(userId)]
    });

    const userData = response.data.userPresences[0];
    if (userData && userData.placeId && userData.gameId) {
      // gameId is the jobId (server instance)
      res.json({
        placeId: userData.placeId,
        jobId: userData.gameId
      });
    } else {
      res.json({ placeId: null, jobId: null });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'API request failed' });
  }
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));