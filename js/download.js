console.log("download.js loaded");

document.addEventListener("click", function(e)
{

    const button =
        e.target.closest("#downloadBtn");

    if(!button)
    {
        return;
    }

    let file = null;

    switch(window.currentTool)
    {

        case "compress":

            file = window.compressedFile;

            break;



        case "convert":

            file = window.convertedFile;

            break;



        case "crop":

            file = window.croppedFile;

            break;



        case "resize":

            file = window.resizedFile;

            break;



        case "rotate":

            file = window.rotatedFile;

            break;

    }



    if(!file)
    {
        console.log("No processed file available");
        return;
    }



    let extension = "jpg";



    switch(window.currentTool)
    {

        case "rotate":

            extension = "jpg";

            break;



        case "resize":

            extension = "jpg";

            break;



        case "crop":

            extension = "jpg";

            break;



        case "convert":

        {

            const convertFormat =
                document.getElementById("convertFormat");

            if(convertFormat)
            {

                const format =
                    convertFormat.value;

                if(format === "image/png")
                {
                    extension = "png";
                }
                else if(format === "image/webp")
                {
                    extension = "webp";
                }
                else
                {
                    extension = "jpg";
                }

            }

            break;

        }



        case "compress":

        {

            const compressFormat =
                document.getElementById("format");

            if(compressFormat)
            {

                const format =
                    compressFormat.value;

                if(format === "image/png")
                {
                    extension = "png";
                }
                else if(format === "image/webp")
                {
                    extension = "webp";
                }
                else
                {
                    extension = "jpg";
                }

            }

            break;

        }

    }



    const url =
        URL.createObjectURL(file);

    const link =
        document.createElement("a");

    link.href =
        url;

    link.download =
        "imageoc-image." + extension;

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    setTimeout(() =>
    {
        URL.revokeObjectURL(url);
    },100);

    console.log(
        "Downloaded:",
        link.download
    );

});