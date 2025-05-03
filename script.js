document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const uploadArea = document.getElementById('uploadArea');
    const imageInput = document.getElementById('imageInput');
    const originalPreview = document.getElementById('originalPreview');
    const originalImage = document.getElementById('originalImage');
    const resultSection = document.getElementById('resultSection');
    const convertedImage = document.getElementById('convertedImage');
    const downloadBtn = document.getElementById('downloadBtn');
    const loadingOverlay = document.getElementById('loadingOverlay');
    const statusText = document.getElementById('statusText');
    const styleButtons = document.querySelectorAll('.style-grid button');
    
    // State variables
    let selectedFile = null;
    let selectedStyle = null;
    let convertedImageUrl = null;
    
    // Event Listeners
    uploadArea.addEventListener('dragover', handleDragOver);
    uploadArea.addEventListener('dragleave', handleDragLeave);
    uploadArea.addEventListener('drop', handleDrop);
    imageInput.addEventListener('change', handleFileSelect);
    downloadBtn.addEventListener('click', handleDownload);
    
    // Add click event to all style buttons
    styleButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            styleButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            button.classList.add('active');
            
            // Set selected style
            selectedStyle = button.dataset.style;
            
            // If an image is already selected, convert it
            if (selectedFile) {
                convertImage();
            }
        });
    });
    
    // Functions
    function handleDragOver(e) {
        e.preventDefault();
        uploadArea.classList.add('highlight');
    }
    
    function handleDragLeave() {
        uploadArea.classList.remove('highlight');
    }
    
    function handleDrop(e) {
        e.preventDefault();
        uploadArea.classList.remove('highlight');
        
        if (e.dataTransfer.files.length) {
            handleFileSelect({ target: { files: e.dataTransfer.files } });
        }
    }
    
    function handleFileSelect(e) {
        const file = e.target.files[0];
        
        if (!file.type.match('image.*')) {
            alert('Please select an image file (JPEG, PNG, etc.)');
            return;
        }
        
        selectedFile = file;
        
        const reader = new FileReader();
        reader.onload = (event) => {
            originalImage.src = event.target.result;
            originalPreview.classList.remove('hidden');
            
            // Hide result section if shown from previous conversion
            resultSection.classList.add('hidden');
        };
        reader.readAsDataURL(file);
    }
    
    async function convertImage() {
        if (!selectedFile || !selectedStyle) return;
        
        // Show loading overlay
        loadingOverlay.classList.remove('hidden');
        statusText.textContent = 'Uploading image...';
        
        try {
            // In a real implementation, you would:
            // 1. Upload the image to a temporary location (or use Replicate's direct upload)
            // 2. Call the Replicate API with the image URL and selected style
            // 3. Wait for the conversion to complete
            // 4. Get the converted image URL
            
            // For this example, we'll simulate the API call with a timeout
            statusText.textContent = 'Converting image...';
            
            // Simulate API delay (3-5 seconds)
            await new Promise(resolve => setTimeout(resolve, 3000 + Math.random() * 2000));
            
            // For demo purposes, we'll just use the original image as the "converted" image
            // In a real app, this would be the URL from Replicate's response
            convertedImageUrl = originalImage.src;
            
            // Show the result
            convertedImage.src = convertedImageUrl;
            resultSection.classList.remove('hidden');
            
            // Scroll to result
            resultSection.scrollIntoView({ behavior: 'smooth' });
            
        } catch (error) {
            console.error('Conversion error:', error);
            alert('An error occurred during conversion. Please try again.');
        } finally {
            // Hide loading overlay
            loadingOverlay.classList.add('hidden');
        }
    }
    
    function handleDownload() {
        if (!convertedImageUrl) return;
        
        const link = document.createElement('a');
        link.href = convertedImageUrl;
        link.download = `converted-${selectedStyle}-${Date.now()}.jpg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
    
    // For demonstration purposes - in a real app you would use the Replicate API
    // Here's how you would typically call it:
    
    async function callReplicateAPI(imageUrl, style) {
        try {
          const response = await fetch('http://localhost:3000/api/replicate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ imageUrl, style }),
          });
      
          if (!response.ok) throw new Error('API request failed');
          return await response.json();
        } catch (error) {
          console.error('Error:', error);
          throw error;
        }
      }
    
});