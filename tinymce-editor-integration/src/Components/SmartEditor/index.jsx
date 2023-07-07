import React, { useRef } from "react";
import { Editor } from "@tinymce/tinymce-react";

export default function SmartEditor() {
  const editorRef = useRef(null);

  const handleImageUpload = (blobInfo, success, failure) => {
    console.log("Upload", blobInfo.blob());

    const formData = new FormData();
    formData.append("image", blobInfo.blob());

    fetch("http://127.0.0.1:8000/extract/", {
      method: "POST",
      body: formData,
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("File upload failed");
        }
      })
      .then((data) => {
        console.log("Server response:", data);
        editorRef.current.insertContent(data.text);
      })
      .catch((error) => {
        console.error("Error uploading file:", error);
      });
  };

  const handleInsertImage = () => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (file) {
        const blobURL = URL.createObjectURL(file);
        handleImageUpload(
          { blob: () => file, blobUri: blobURL },
          (url) => editorRef.current.insertContent(`<img src="${url}" />`),
          (error) => console.error("Image upload failed:", error)
        );
      }
    });
    input.click();
  };

  const handleEditorInit = (evt, editor) => {
    editorRef.current = editor;
  };

  const handleLogContent = () => {
    if (editorRef.current) {
      console.log(editorRef.current.getContent());
    }
  };

  return (
    <>
      <Editor
        apiKey="your-api-key"
        onInit={handleEditorInit}
        initialValue="<p>This is the initial content of the editor.</p>"
        init={{
          height: 500,
          menubar: false,
          plugins: ["image"],
          toolbar: "image | TextImage",
          setup: (editor) => {
            editor.ui.registry.addButton("TextImage", {
              text: "TextImage",
              icon: "highlight-bg-color",
              tooltip: "Highlight a prompt and click this button to query ChatGPT",
              enabled: true,
              onAction: () => handleInsertImage(),
            });
          },
        }}
      />
      <button onClick={handleLogContent}>Log editor content</button>
    </>
  );
}
