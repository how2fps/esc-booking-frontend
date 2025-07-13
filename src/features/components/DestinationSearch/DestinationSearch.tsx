import { addDays } from "date-fns";
import * as Icon from "phosphor-react";
import { useCallback, useEffect, useState } from "react";
import { DateRangePicker } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { Link } from "react-router-dom";
import AsyncSelect from "react-select/async";
import Destination from "../data/destinations.json";

interface DestinationType {
       term: string;
       uid: string;
       lat: number;
       lng: number;
       type: string;
       state: string;
}

interface GuestType {
       adult: number;
       children: number;
       room: number;
}

const options: DestinationType[] = (Array.isArray(Destination) ? Destination : Object.values(Destination)).map((d: any) => ({
       ...d,
       state: typeof d.state === "string" ? d.state : "",
}));

const mappedOptions = options.map((option) => ({ value: option.uid, label: option.term }));

const filterOption = (input: string) => {
       if (!input || input.length < 3) {
              return [];
       }
       return mappedOptions.filter((i) => i.label && i.label.toLowerCase().includes(input.toLowerCase()));
};

const noOptionsMessage = (input: { inputValue: string }) => {
       if (input.inputValue.length === 0) {
              return "Type to search";
       } else if (input.inputValue.length < 3) {
              return `Search input must be at least ${3} characters`;
       }
       return "No options";
};

const loadOptions = (inputValue: string, callback: (options: { value: string; label: string }[]) => void) => {
       setTimeout(() => {
              callback(filterOption(inputValue));
       }, 500);
};

const DestinationSearch = () => {
       const [openDate, setOpenDate] = useState(false);
       const [openGuest, setOpenGuest] = useState(false);
       const [location, setLocation] = useState({
              term: "",
              uid: "23",
              lat: 0,
              lng: 0,
              type: "",
              state: "",
       });

       const [state, setState] = useState([
              {
                     startDate: new Date(),
                     endDate: addDays(new Date(), 7),
                     key: "selection",
              },
       ]);

       const [guest, setGuest] = useState<GuestType>({
              adult: 0,
              children: 0,
              room: 0,
       });

       const handleOpenDate = () => {
              setOpenDate((prevOpenDate) => !prevOpenDate);
              setOpenGuest(false);
       };

       const handleOpenGuest = () => {
              setOpenGuest(!openGuest);
              setOpenDate(false);
       };

       const handleClickOutsideDatePopup: EventListener = useCallback(
              (event) => {
                     const targetElement = event.target as Element;
                     if (openDate && !targetElement.closest(".form-date-picker")) {
                            setOpenDate(false);
                     }
              },
              [openDate]
       );

       const handleClickOutsideGuestPopup: EventListener = useCallback(
              (event) => {
                     const targetElement = event.target as Element;
                     if (openGuest && !targetElement.closest(".sub-menu-guest")) {
                            setOpenGuest(false);
                     }
              },
              [openGuest]
       );

       useEffect(() => {
              return () => {
                     document.removeEventListener("click", handleClickOutsideDatePopup);
                     document.removeEventListener("click", handleClickOutsideGuestPopup);
              };
       }, [handleClickOutsideDatePopup, handleClickOutsideGuestPopup]);

       const increaseGuest = (type: keyof GuestType) => {
              setGuest((prevGuest) => ({
                     ...prevGuest,
                     [type]: prevGuest[type] + 1,
              }));
       };

       const decreaseGuest = (type: keyof GuestType) => {
              if (guest[type] > 0) {
                     setGuest((prevGuest) => ({
                            ...prevGuest,
                            [type]: prevGuest[type] - 1,
                     }));
              }
       };

       return (
              <>
                     <div className="slider-block style-one relative h-[620px]">
                            <div className="bg-img absolute top-0 left-0 w-full h-full">
                                   <img
                                          src={"/images/slider/hotel-lobby-2024-12-05-23-25-27-utc.jpg"}
                                          width={5000}
                                          height={3000}
                                          alt="slider"
                                          className="w-full h-full object-cover"
                                          style={{
                                                 filter: "brightness(0.5)",
                                                 WebkitFilter: "brightness(0.5)",
                                                 position: "relative",
                                          }}
                                   />
                            </div>
                            <div className="container py-[176px]">
                                   <div className="content w-full relative">
                                          <div className="heading flex-col items-center justify-center">
                                                 <div className="heading2 text-white text-center">Pick your next journey</div>
                                          </div>

                                          <div className="form-search md:mt-10 mt-6 w-full">
                                                 <form className="bg-white rounded-lg p-5 flex max-lg:flex-wrap items-center justify-between gap-5 relative">
                                                        <div className="select-block lg:w-full md:w-[48%] w-full">
                                                               <AsyncSelect
                                                                      data-testid="async-select"
                                                                      loadOptions={loadOptions}
                                                                      defaultOptions={true}
                                                                      noOptionsMessage={noOptionsMessage}
                                                                      value={location}
                                                                      onChange={setLocation}
                                                                      styles={{
                                                                             control: (provided) => ({
                                                                                    ...provided,
                                                                                    width: 300,
                                                                             }),
                                                                             menu: (provided) => ({
                                                                                    ...provided,
                                                                                    width: 300,
                                                                             }),
                                                                      }}
                                                               />
                                                               <p data-testid="uid">Selected: {location ? location.value : "None"}</p>
                                                        </div>
                                                        <div className="relative lg:w-full md:w-[48%] w-full">
                                                               <div
                                                                      className="select-block w-full"
                                                                      onClick={handleOpenDate}>
                                                                      <Icon.CalendarBlank className="icon text-xl left-5" />
                                                                      <input
                                                                             className="body2 w-full pl-12 pr-5 py-4 border border-outline rounded-lg text-sm"
                                                                             type="text"
                                                                             placeholder="Add Dates"
                                                                             value={`${state[0].startDate.toLocaleDateString()} - ${state[0].endDate.toLocaleDateString()}`}
                                                                             readOnly
                                                                      />
                                                               </div>
                                                               <DateRangePicker
                                                                      className={`form-date-picker box-shadow md:border-t border-outline  ${openDate ? "open" : ""}`}
                                                                      onChange={(item) => setState([item.selection] as any)}
                                                                      staticRanges={[]}
                                                                      inputRanges={[]}
                                                                      moveRangeOnFirstSelection={false}
                                                                      months={2}
                                                                      ranges={state}
                                                                      direction="horizontal"
                                                               />
                                                        </div>
                                                        <div className="relative lg:w-full md:w-[48%] w-full">
                                                               <div
                                                                      className="select-block w-full"
                                                                      onClick={handleOpenGuest}>
                                                                      <Icon.Users className="icon text-xl left-5" />
                                                                      <input
                                                                             className="body2 w-full pl-12 pr-5 py-3 border border-outline rounded-lg"
                                                                             type="text"
                                                                             placeholder="Add Guest"
                                                                             value={`${guest.adult > 0 ? (guest.adult === 1 ? guest.adult + " adult" : guest.adult + " adults") : ""}${guest.children > 0 ? (guest.children === 1 ? ", " + guest.children + " children" : ", " + guest.children + " childrens") : ""}`}
                                                                             readOnly
                                                                      />
                                                               </div>
                                                               <div className={`sub-menu-guest bg-white rounded-b-xl overflow-hidden p-5 absolute top-full md:mt-5 mt-3 left-0 w-full box-shadow md:border-t border-outline ${openGuest ? "open" : ""}`}>
                                                                      <div className="item flex items-center justify-between pb-4 border-b border-outline">
                                                                             <div className="left">
                                                                                    <p>Adults</p>
                                                                                    <div className="caption1 text-variant1">(12 Years+)</div>
                                                                             </div>
                                                                             <div className="right flex items-center gap-5">
                                                                                    <div
                                                                                           className={`minus w-8 h-8 flex items-center justify-center rounded-full border border-outline duration-300 ${guest.adult === 0 ? "opacity-[0.4] cursor-default" : "cursor-pointer hover:bg-black hover:text-white"}`}
                                                                                           onClick={() => decreaseGuest("adult")}>
                                                                                           <Icon.Minus weight="bold" />
                                                                                    </div>
                                                                                    <div className="text-title">{guest.adult}</div>
                                                                                    <div
                                                                                           className="plus w-8 h-8 flex items-center justify-center rounded-full border border-outline cursor-pointer duration-300 hover:bg-black hover:text-white"
                                                                                           onClick={() => increaseGuest("adult")}>
                                                                                           <Icon.Plus weight="bold" />
                                                                                    </div>
                                                                             </div>
                                                                      </div>
                                                                      <div className="item flex items-center justify-between pb-4 pt-4 border-b border-outline">
                                                                             <div className="left">
                                                                                    <p>Children</p>
                                                                                    <div className="caption1 text-variant1">(2-12 Years)</div>
                                                                             </div>
                                                                             <div className="right flex items-center gap-5">
                                                                                    <div
                                                                                           className={`minus w-8 h-8 flex items-center justify-center rounded-full border border-outline duration-300 ${guest.children === 0 ? "opacity-[0.4] cursor-default" : "cursor-pointer hover:bg-black hover:text-white"}`}
                                                                                           onClick={() => decreaseGuest("children")}>
                                                                                           <Icon.Minus weight="bold" />
                                                                                    </div>
                                                                                    <div className="text-title">{guest.children}</div>
                                                                                    <div
                                                                                           className="plus w-8 h-8 flex items-center justify-center rounded-full border border-outline cursor-pointer duration-300 hover:bg-black hover:text-white"
                                                                                           onClick={() => increaseGuest("children")}>
                                                                                           <Icon.Plus weight="bold" />
                                                                                    </div>
                                                                             </div>
                                                                      </div>

                                                                      <div
                                                                             className="button-main w-full text-center"
                                                                             onClick={() => setOpenGuest(false)}>
                                                                             Done
                                                                      </div>
                                                               </div>
                                                        </div>
                                                        <div className="relative lg:w-full md:w-[48%] w-full">
                                                               <div className="item flex items-center justify-between pb-3 pt-3 border border-outline rounded-lg">
                                                                      <div className="left pl-4">
                                                                             <p>Rooms</p>
                                                                      </div>
                                                                      <div className="right flex items-center gap-5 pr-3">
                                                                             <div
                                                                                    className={`minus w-8 h-8 flex items-center justify-center rounded-full border border-outline duration-300 ${guest.room === 0 ? "opacity-[0.4] cursor-default" : "cursor-pointer hover:bg-black hover:text-white"}`}
                                                                                    onClick={() => decreaseGuest("room")}>
                                                                                    <Icon.Minus weight="bold" />
                                                                             </div>
                                                                             <div className="text-title">{guest.room}</div>
                                                                             <div
                                                                                    className="plus w-8 h-8 flex items-center justify-center rounded-full border border-outline cursor-pointer duration-300 hover:bg-black hover:text-white"
                                                                                    onClick={() => increaseGuest("room")}>
                                                                                    <Icon.Plus weight="bold" />
                                                                             </div>
                                                                      </div>
                                                               </div>
                                                        </div>
                                                        <div className="button-block flex-shrink-0 max-lg:w-[48%] max-md:w-full">
                                                               <div className="button-main max-lg:w-full">
                                                                      <Link to={`/hotels/topmap-grid?location=${location ? location.value : "None"}&startDate=${state[0].startDate.toLocaleDateString()}&endDate=${state[0].endDate.toLocaleDateString()}&adult=${guest.adult}&children=${guest.children}&room=${guest.room}`}>Search</Link>
                                                               </div>
                                                        </div>
                                                 </form>
                                          </div>
                                   </div>
                            </div>
                     </div>
              </>
       );
};

export default DestinationSearch;
