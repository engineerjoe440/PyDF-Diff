/*******************************************************************************
 * Custom Photo Uploader Tooling.
 ******************************************************************************/

import axios from 'axios';

export default async function uploadPDFFiles({
    files, // list of files to be uploaded
    onPopup, // callback to accept a map including message and severity
    onSuccess, // callback when upload was completed successfully
}) {
    // Generate the Query String from Parameters
    const params = {
        client_id: window.token,
        send_to_email_address: "noreply@example.com",
        top_margin: 0.0,
        bottom_margin: 100.0,
        width: 900,
        style: ["strike", "underline"]
    }
    const query = "?" + new URLSearchParams(params).toString()

    // Create an object of formData
    const formData = new FormData();
    
    // Update the formData object by adding all of the photo files
    Array.from(files).forEach(file => {
      formData.append("files", file);
      console.log(JSON.stringify({"Name": file.name, "Size": file.size}));
    })


    // Request made to the backend api
    // Send formData object
    axios({
        method: 'post',
        url: `/api/v1/generate-diff${query}`,
        data: formData,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'multipart/form-data'
        },
    }).then((response) => {
        if (response.status === 200) {
            // Watch for Backend-Reported Error
            if (!response.data.error){
                onSuccess("tada!");
            } else {
                onPopup({
                    message: response.data.message,
                    severity: "error",
                })
            }
        } else {
            console.error(response);
            onPopup({
                message: response.data.message,
                severity: "error",
            });
        }
    }).catch((error) => {
        if( error.response ){
            console.error(error.response.data); // => the response payload
            onPopup({
                message: (
                    "The server is presently experiencing an error, and is"+
                    " unable to upload photos."
                ),
                severity: "error",
            });
        }
    });
}
