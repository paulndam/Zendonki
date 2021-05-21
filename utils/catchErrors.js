function catchErrors(error, displayError) {
  let errorMessage;
  if (error.response) {
    // the request was made and server responded with status quote that is not in the range of 200
    errorMessage = error.response.data;
    console.log("Error response ===> ", errorMessage);
    //   for cloudinary image upload we might get error from
    if (error.response.data.error) {
      errorMessage = error.response.data.error.message;
    }
  } else if (error.request) {
    // the request was made but got no response
    errorMessage = error.request;
    console.log("Error request", errorMessage);
    console.error("Error request", errorMessage);
  } else {
    // something else happened in making the request anit triggered the error
    errorMessage = error.message;
    console.log("Error message", errorMessage);
    console.error("Error message", errorMessage);
  }
  displayError(errorMessage);
}

export default catchErrors;
