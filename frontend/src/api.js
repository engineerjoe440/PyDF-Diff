/*******************************************************************************
 * Custom Photo Uploader Tooling.
 ******************************************************************************/

import axios from 'axios';

const toBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
});

export default async function uploadPDFFiles({
    files, // list of files to be uploaded
    onPopup, // callback to accept a map including message and severity
    onSuccess, // callback when upload was completed successfully
}) {
    // Request made to the backend api
    // Send formData object
    axios({
        method: 'post',
        url: "/api/v1/generate-diff",
        data: {
            file_1: await toBase64(files[0]),
            file_2: await toBase64(files[1]),
            send_to_email_address: "engineerjoe440@yahoo.com",
            top_margin: 0.0,
            bottom_margin: 0.0,
            style: "",
            width: 0.0,
        },
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
    }).then((response) => {
        if (response.status === 202) {
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
