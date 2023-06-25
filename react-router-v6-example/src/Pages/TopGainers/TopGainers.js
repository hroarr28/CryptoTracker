import React, {useEffect, useState} from "react";

import "./TopGainers.css";

function TopGainers({topGainers}) {
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      if (currentPage < Math.ceil(topGainers.length / 5) - 1) {
        setCurrentPage((prevPage) => prevPage + 1);
      } else {
        setCurrentPage(0);
      }
    }, 5000);

    return () => {
      clearInterval(timer);
    };
  }, [currentPage, topGainers]);

  // console.log(websockets);
  // console.log(top20Gainers);

  const handleNextPage = () => {
    if (currentPage < Math.ceil(topGainers.length / 5) - 1) {
      setCurrentPage((prevPage) => prevPage + 1);
    } else {
      setCurrentPage(0);
    }
  };

  const startIndex = currentPage * 5;
  const visibleGainers = topGainers.slice(startIndex, startIndex + 5);

  return (
    <>
      <h1 className='title'>Daily Top Gainers</h1>
      <div className='carousel'>
        <div className='carousel-items-container'>
          {visibleGainers.map((item) => (
            <div className='carousel-item' key={item.s}>
              <h2 className='carousel-item-title'>{`${item.s.slice(
                0,
                -4
              )}/USDT`}</h2>
              <h3 className='carousel-item-percentage' style={{color: "green"}}>
                {item.P}%
              </h3>
              <h2 className='carousel-item-price'>{`$${item.p}`}</h2>
            </div>
          ))}
        </div>
      </div>
      <div className='down-arrow-container'>
        <img
          onClick={handleNextPage}
          className='down-arrow'
          src='https://img.icons8.com/?size=512&id=99977&format=png'
          alt='downArrow'
        />
      </div>
    </>
  );
}

export default TopGainers;
