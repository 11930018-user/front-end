import React from "react";

const DishesCard = (props) => {
  const { img, title, price, large } = props;

  return (
    <div className={`w-full flex flex-col items-center text-center p-4 ${large ? 'border-none' : 'shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] rounded-lg'}`}>
        <div className="w-full h-64 md:h-72 mb-4 overflow-hidden flex items-center justify-center">
        <img 
          className={`w-full h-full object-cover ${large ? 'rounded-full' : 'rounded-xl'}`} 
          src={img} 
          alt={title} 
        />
      </div>

      <div className="space-y-4 w-full">
        <h3 className="font-semibold text-center text-xl pt-2">{title}</h3>
            {large && (
          <div className="text-gray-500 mb-4">
            .....
          </div>
        )}        
        
        <div className="flex flex-col items-center justify-center gap-3">
          <h3 className="font-semibold text-lg">{price}</h3>
        </div>
      </div>
    </div>
  );
};

export default DishesCard;