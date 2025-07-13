import * as Icon from "phosphor-react";
import React from "react";

interface RateProps {
       currentRate: number | undefined;
       classname: string;
}

const Rate: React.FC<RateProps> = ({ currentRate, classname }) => {
       const arrOfStar = [];
       for (let i = 0; i < 5; i++) {
              if (currentRate) {
                     if (i >= currentRate) {
                            arrOfStar.push(
                                   <Icon.Star
                                          key={i}
                                          className={classname}
                                          color="#9FA09C"
                                          weight="fill"
                                   />
                            );
                     } else {
                            arrOfStar.push(
                                   <Icon.Star
                                          key={i}
                                          className={classname}
                                          color="#F4D118"
                                          weight="fill"
                                   />
                            );
                     }
              }
       }
       return <div className="rate flex">{arrOfStar}</div>;
};

export default Rate;
