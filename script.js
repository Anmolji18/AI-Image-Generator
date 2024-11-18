const generateForm = document.querySelector(".generate-form");
const imageGallery = document.querySelector(".image-gallery");

const OPENAI_API_KEY = "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";
let isImageGenerating = false;
 //aoi KEY= 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
const updateImageCard = (imgDataArray) => {
    imgDataArray.forEach((imgObject, index) => {
        const imgCard = imageGallery.querySelectorAll(".img-card")[index];
        const imgElement = imgCard.querySelector("img");
        const downloadBtn =  imgCard.querySelector(".download-btn");

        const aiGeneratedImg = `data:image/jpeg;base64${imgObject.b64_json}`;
        imgElement.src = aiGeneratedImg;

        imgElement.onload = () => {
            imgCard.classList.remove("loading");
            downloadBtn.setAttribute("href", aiGeneratedImg);
            downloadBtn.setAttribute("download", `${new Date().getTime()}.jpg`);
        }

    });
}

const generateAIImages = async (userPrompt , userImgQuantity) => {
    try {
        const response = await fetch("https://api.openai.com/v1/images/generations", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                prompt: userPrompt,
                n: parseInt(userImgQuantity),
                size: "512x512",
                response_format: "b64_json"
            })
        });

        if(!response.ok) throw new Error("Failed to generate images! Please try again.");

        const{ data } = await response.json();
        updateImageCard([...data]);
    } catch (error) {
        alert(error.message);
    } finally {
        isImageGenerating = false;
    }
    
}

const handleFormSubmission = (e) => {
    e.preventDefault();
    if(isImageGenerating) return;
    isImageGenerating = true;

    // Get user input and image quantity values from the form
    const userPrompt = e.srcElement[0].value;
    const userImgQuantity = e.srcElement[1].value;

    const imgCardMarkup = Array.from({length: userImgQuantity}, () => 
        `<div class="img-card loading">
            <img src="images/loader.svg" alt="image">
            <a href="#" class="download-btn">
                <img src="images/download.svg" alt="download icon">
            </a>
        </div>`
    ).join("");
 
    imageGallery.innerHTML = imgCardMarkup;
    generateAIImages(userPrompt , userImgQuantity);
}

generateForm.addEventListener("submit", handleFormSubmission);