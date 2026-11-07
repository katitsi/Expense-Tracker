import React from "react";

const DeleteAlert = ({ content, onDelete }) => {
  return (
    <div>
      <p className="text-sm">{content}</p>

      <div className="flex justify-end mt-6">
        <button
          type="button"
          className="btn-secodary btn-secodary-fill"
          onClick={onDelete}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default DeleteAlert;
