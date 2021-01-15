import React, {useMemo, useState} from 'react';
import {useDropzone} from 'react-dropzone';
import { PDFDocument } from 'pdf-lib';
import download from 'downloadjs';
import './App.css';

const baseStyle = {
   flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
    
  padding: '50px',
  borderWidth: 3,
  borderRadius: 3,
  borderColor: '#eeeeee',
  borderStyle: 'dashed',
  backgroundColor: 'rgb(235, 197, 12)',
  color: 'white',
  outline: 'none',
  transition: 'border .24s ease-in-out'
};

const activeStyle = {
  borderColor: '#2196f3'
};

const acceptStyle = {
  borderColor: '#00e676'
};

const rejectStyle = {
  borderColor: '#ff1744'
};

function StyledDropzone(props) {
  
    const [images,setimages]=useState();
  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,
    acceptedFiles
  } = useDropzone({accept: 'image/*' ,

  onDrop: acceptedFiles =>{
        setimages(acceptedFiles[0]);
        console.log(images)
  }
});

  const style = useMemo(() => ({
    ...baseStyle,
    ...(isDragActive ? activeStyle : {}),
    ...(isDragAccept ? acceptStyle : {}),
    ...(isDragReject ? rejectStyle : {})
  }), [
    isDragActive,
    isDragReject,
    isDragAccept
  ]);
  
  
  
  
//    acceptedFiles.map(file => (
//     setimages(file)
//   ));

  async function embedImages() {
    // Fetch JPEG image

const jpgImageBytes =  await images.arrayBuffer()
console.log(jpgImageBytes);
debugger

// // Fetch PNG image
// const pngUrl = 'https://pdf-lib.js.org/assets/minions_banana_alpha.png'
// const pngImageBytes = await fetch(pngUrl).then((res) => res.arrayBuffer())

// Create a new PDFDocument
const pdfDoc = await PDFDocument.create()

// Embed the JPG image bytes and PNG image bytes
const jpgImage = await pdfDoc.embedJpg(jpgImageBytes)
// const pngImage = await pdfDoc.embedPng(pngImageBytes)

// Get the width/height of the JPG image scaled down to 25% of its original size
const jpgDims = jpgImage.scale(0.25)

// Get the width/height of the PNG image scaled down to 50% of its original size
// const pngDims = pngImage.scale(0.5)

// Add a blank page to the document
const page = pdfDoc.addPage()

// Draw the JPG image in the center of the page
page.drawImage(jpgImage, {
x: page.getWidth() / 2 - jpgDims.width / 2,
y: page.getHeight() / 2 - jpgDims.height / 2,
width: jpgDims.width,
height: jpgDims.height,
})

// Draw the PNG image near the lower right corner of the JPG image
// page.drawImage(pngImage, {
// x: page.getWidth() / 2 - pngDims.width / 2 + 75,
// y: page.getHeight() / 2 - pngDims.height,
// width: pngDims.width,
// height: pngDims.height,
// })

// Serialize the PDFDocument to bytes (a Uint8Array)
const pdfBytes = await pdfDoc.save()

    // Trigger the browser to download the PDF document
  await  download(pdfBytes, "pdf-lib_image_embedding_example.pdf", "application/pdf");
}

  return (
      <>

      <div className='heading'>
         <h4>JPG to PDF</h4>
         <p>The best web app to convert JPG to PDF</p>
      </div>
        <div className="container">
        <div {...getRootProps({style})}>
            <input {...getInputProps()} />
            <p>Drag 'n' drop some files here, or click to select files</p>
        </div>
        
        </div>
        <div className='btn_container'> 
        <button className='btn' onClick={embedImages}>Convert</button>
</div>
       

     </>
  );
}

<StyledDropzone />

export default StyledDropzone;