function showImagePreview(file, callback)
{
    const reader = new FileReader();
    const previewBox = document.querySelector(".image-preview");
    const previewImage = document.getElementById("previewImage");
    const uploadArea = document.getElementById("uploadArea");

    reader.onload = function(e)
    {
        previewImage.src = e.target.result;
        previewBox.classList.remove("hidden");
        uploadArea.style.display = "none";
        previewImage.onload = () =>
        {
            if(callback)
            {
                callback();
            }
        };
    };
    reader.readAsDataURL(file);
}