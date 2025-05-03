require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Proxy endpoint for Replicate API
app.post('/api/replicate', async (req, res) => {
  const { imageUrl, style } = req.body;

  try {
    const response = await fetch('https://api.replicate.com/v1/predictions', {
      method: 'POST',
      headers: {
        'Authorization': `Token ${process.env.REPLICATE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        version: getModelVersion(style), // Define this function
        input: { image: imageUrl, style }
      }),
    });

    if (!response.ok) throw new Error('Replicate API failed');
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

function getModelVersion(style) {
  const MODEL_VERSIONS = {
    ghibli: "123abc...",  // Replace with actual model IDs
    disney: "456def...",
    // ... other styles
  };
  return MODEL_VERSIONS[style];
}

app.listen(3000, () => console.log('Server running on port 3000'));