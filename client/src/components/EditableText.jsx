import React, { useState } from "react";
import "../styles/EditableText.css";

function EditableText({ text, onSave }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(text);

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      setIsEditing(false);
      onSave(editedText);
    }
  };

  

  return (
    <div className="editableText-container">
      {isEditing ? (
        <input
          type="text"
          value={editedText}
          onChange={(e) => setEditedText(e.target.value)}
          onBlur={() => {
            setIsEditing(false);
            onSave(editedText);
          }}
          onKeyDown={handleKeyDown}
          autoFocus
        />
      ) : (
        <p className="editableText-p" onDoubleClick={handleDoubleClick}>"{text}"</p>
      )}
    </div>
  );
}

export default EditableText;