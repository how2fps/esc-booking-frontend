import { useEffect, useState } from "react";

export const HotelSearch: React.FC<{
       setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
}> = ({ setSearchTerm }) => {
       const [textInputValue, setTextInputValue] = useState<string>("");

       useEffect(() => {
              const handler = setTimeout(() => {
                     setSearchTerm(textInputValue);
              }, 300);

              return () => {
                     clearTimeout(handler);
              };
       }, [textInputValue, setSearchTerm]);

       return (
              <div className="flex-1">
                     <input
                            type="text"
                            placeholder="Search hotels..."
                            value={textInputValue}
                            onChange={(e) => {
                                   setTextInputValue(e.target.value);
                            }}
                            className="w-full h-12 px-4 rounded-lg border border-gray-300 bg-white text-black placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                     />
              </div>
       );
};
