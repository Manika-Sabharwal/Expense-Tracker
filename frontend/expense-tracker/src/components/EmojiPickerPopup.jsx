import React, { useState } from "react";
import EmojiPicker from "emoji-picker-react";
import { LuImage, LuX } from "react-icons/lu";

const EmojiPickerPopup = ({ icon, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="flex flex-col md:flex-row items-start gap-5 mb-6">
        <div
          className="flex items-center gap-4 cursor-pointer"
          onClick={() => setIsOpen(true)}
        >
          <div className="w-12 h-12 flex items-center justify-center text-2xl bg-purple-50 text-primary rounded-lg overflow-hidden">
            {icon ? (
              <img
                src={icon}
                alt="Icon"
                className="w-full h-full object-cover"
              />
            ) : (
              <LuImage />
            )}
          </div>

          <p className="text-sm text-slate-700 font-medium">
            {icon ? "Change Icon" : "Pick Icon"}
          </p>
        </div>
      </div>

      {isOpen && (
        <div className="relative inline-block">
          <button
            type="button"
            className="w-7 h-7 flex items-center justify-center bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 rounded-full absolute -top-2 -right-2 z-10 cursor-pointer"
            onClick={() => setIsOpen(false)}
          >
            <LuX size={16} />
          </button>

          <EmojiPicker
            open={isOpen}
            onEmojiClick={(emojiData) => {
              onSelect(emojiData.getImageUrl());
              setIsOpen(false);
            }}
          />
        </div>
      )}
    </>
  );
};

export default EmojiPickerPopup;