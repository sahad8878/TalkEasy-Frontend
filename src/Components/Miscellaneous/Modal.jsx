// Modal.js
import React from "react";

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (

    <div  className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-end">
        <button
          className="ab right-1 text-black hover:text-gray-700"
          onClick={onClose}
        >
          <i class="fa-solid fa-xmark "></i>
        </button>

        </div>
        {children}
      </div>
    </div>
  );
};

export default Modal;
