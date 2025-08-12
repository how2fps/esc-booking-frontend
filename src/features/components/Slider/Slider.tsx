import { addDays } from "date-fns";
import * as Icon from "phosphor-react";
import type { GroupBase, OptionsOrGroups, SingleValue, ActionMeta } from 'react-select';

import { useCallback, useEffect, useState } from "react";
import { DateRangePicker } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { Link } from "react-router-dom";
import { AsyncPaginate } from "react-select-async-paginate";


interface DestinationType {
       term: string;
       uid: string;
       lat: number;
       lng: number;
       type: string;
       state?: string;}



interface GuestType {
       adult: number;
       children: number;
       room: number;
}




const noOptionsMessage = (input: { inputValue: string }) => {
       if (input.inputValue.length === 0) {
              return "Type to search";
       } else if (input.inputValue.length < 3) {
              return `Search input must be at least ${3} characters`;
       }
       return "No options";
};

const optionsPerPage = 10;


const loadOptions = async (search: string, page: number) => {
       if (!search || search.length < 3) {
              return {
                     options: [],
                     hasMore: false,
              };
       }
       const response = await fetch("http://localhost:3000/api/search/" + search);
       const data = await response.json();
       //console.log(data);
       
       const hasMore = Math.ceil(data.length / optionsPerPage) > page;

       const slicedOptions = data.slice((page - 1) * optionsPerPage, page * optionsPerPage);

       return {
              options: slicedOptions,
              hasMore,
       };
};

const heroImages = [
  "/images/home/mountainhero.jpg",
  "/images/home/riverhero.jpg",
  "/images/home/sandhero.jpg",
];

const defaultAdditional = { page: 1 };

const loadPageOptions = async (
  q: string,
  _loadedOptions: OptionsOrGroups<DestinationType, GroupBase<DestinationType>>,
  additional = defaultAdditional
) => {
  const { page = 1 } = additional;
  const { options, hasMore } = await loadOptions(q, page);
  console.log("Fetching page:", page, "query:", q, "Option:", options);
  return {
    options,
    hasMore,
    additional: { page: page + 1 },
  };
};
const DestinationSearch = () => {
       const today =new Date()
       const min = new Date()
       min.setDate(today.getDate()+3)
       const [openDate, setOpenDate] = useState(false);
       const [openGuest, setOpenGuest] = useState(false);
       const [location, setLocation] = useState<DestinationType | null>(null);


       const [state, setState] = useState([
              {
                     startDate: new Date(min),
                     endDate: addDays(new Date(min), 7),
                     key: "selection",
              },
       ]);

       const [slideIdx, setSlideIdx] = useState<number>(0);

       useEffect(() => {
              heroImages.forEach((src) => { const img = new Image(); img.src = src; });
              const t = setInterval(() => setSlideIdx((p) => (p + 1) % heroImages.length), 6000);
              return () => clearInterval(t);
       }, []);

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
       const handleLocationChange = (
              newValue: SingleValue<DestinationType>,
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              _actionMeta: ActionMeta<DestinationType>
              ) => {
              if (newValue === null) {
              // Handle null case, e.g., reset state or ignore
              return;
              }
              setLocation(newValue);
              };
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
                     <div className="slider-block style-one relative h-[calc(100vh-160px)] overflow-hidden bg-black" data-testid="slider">
                            <div className="absolute inset-0 w-full h-full z-0 pointer-events-none">
                                   {heroImages.map((src, i) => (
                                          <img
                                          key={src}
                                          src={src}
                                          alt={`Slide ${i + 1}`}
                                          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${
                                                 i === slideIdx ? "opacity-100" : "opacity-0"
                                          }`}
                                          style={{ filter: "brightness(0.5)" }}
                                          />
                                   ))}
                            </div>
                            <div className="container h-full relative z-20">
                                   <div className="content w-full h-full relative flex flex-col items-center justify-center">
                                          <div className="heading flex-col items-center justify-center">
                                                 <div className="text-white font-extrabold text-4xl md:text-5xl drop-shadow-lg">Unlock Unique Stays at Exclusive Prices</div>
                                          </div>

                                          <div className="form-search md:mt-10 mt-6 w-full">
                                                 <form className="bg-white rounded-lg p-5 flex max-lg:flex-wrap items-center justify-between gap-5 relative">
                                                        <div
                                                               
                                                               className="select-block lg:w-full md:w-[48%] w-full"    data-testid="async-select"
                                                              >
                                                               <AsyncPaginate
                                                                       
                                                                      debounceTimeout={300}
                                                                      loadOptionsOnMenuOpen={false} 
                                                                      additional={{ page: 1 }}
                                                                      loadOptions={loadPageOptions}
                                                                      getOptionLabel={(i: DestinationType) => i.term}
                                                                     getOptionValue={(i: DestinationType) => i.uid}
                                                                      noOptionsMessage={noOptionsMessage}
                                                                      onChange={handleLocationChange}
                                                                      styles={{
                                                                             control: (provided) => ({
                                                                                    ...provided,
                                                                                    width: 300,
                                                                                    height: 54,
                                                                             }),
                                                                             menu: (provided) => ({
                                                                                    ...provided,
                                                                                    width: 300,
                                                                             }),
                                                                      }}
                                                               />
                                                        </div>
                                                        <div className="relative lg:w-full md:w-[48%] w-full">
                                                               <div
                                                                      className="select-block w-full"
                                                                      onClick={handleOpenDate}>
                                                                      <Icon.CalendarBlank className="icon text-xl left-5" />
                                                                      <input
                                                                             className="body2 w-full pl-12 pr-5 py-3 border border-outline rounded-lg bg-white text-black"
                                                                             type="text"
                                                                             placeholder="Add Dates"
                                                                             value={`${state[0].startDate.toLocaleDateString()} - ${state[0].endDate.toLocaleDateString()}`}
                                                                             readOnly
                                                                      />
                                                               </div >
                                                               <div data-testid = "picker">
                                                               <DateRangePicker
                                                                      className={`form-date-picker box-shadow md:border-t border-outline  ${openDate ? "open" : ""}`}
                                                                      
                                                                      onChange={(item) => setState([item.selection] as any)}
                                                                      staticRanges={[]}
                                                                      inputRanges={[]}
                                                                  
                                                                      moveRangeOnFirstSelection={false}
                                                                      months={2}
                                                                      ranges={state}
                                                                      direction="horizontal"
                                                                      minDate={min}
                                                               /></div>
                                                        </div>
                                                        <div className="relative lg:w-full md:w-[48%] w-full">
                                                               <div
                                                                      className="select-block w-full"
                                                                      onClick={handleOpenGuest}>
                                                                      <Icon.Users className="icon text-xl left-5" />
                                                                      <input
                                                                             className="body2 w-full pl-12 pr-5 py-3 border border-outline rounded-lg bg-white text-black"
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
                                                                                    <div className="text-title" data-testid="adult">{guest.adult}</div>
                                                                                    <div
                                                                                           className="plus w-8 h-8 flex items-center justify-center rounded-full border border-outline cursor-pointer duration-300 hover:bg-black hover:text-white"
                                                                                           onClick={() => increaseGuest("adult")}>
                                                                                           <Icon.Plus weight="bold"  data-testid ="adult-plus"/>
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
                                                                                    <div className="text-title" data-testid="children">{guest.children}</div>
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
                                                                             <div className="text-title" data-testid = "room-count">{guest.room}</div>
                                                                             <div
                                                                                    className="plus w-8 h-8 flex items-center justify-center rounded-full border border-outline cursor-pointer duration-300 hover:bg-black hover:text-white"
                                                                                    onClick={() => increaseGuest("room")}>
                                                                                    <Icon.Plus weight="bold"  data-testid = "plus"/>
                                                                             </div>
                                                                      </div>
                                                               </div>
                                                        </div>
                                                        <div className="button-block flex-shrink-0 max-lg:w-[48%] max-md:w-full">
                                                               <div className="button-main max-lg:w-full">
                                                                      <Link to={`/hotels?location=${location ? location.uid : "None"}&startDate=${state[0].startDate.toLocaleDateString()}&endDate=${state[0].endDate.toLocaleDateString()}&adult=${guest.adult}&children=${guest.children}&room=${guest.room}`}>Search</Link>
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
